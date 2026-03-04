import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

import { createClient } from "@supabase/supabase-js";
import { spawn } from "child_process";
import * as fs from "fs";
import * as crypto from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PYTHON_EXECUTABLE = process.env.PYTHON_EXECUTABLE || "python";
const POSTER_CLI_PATH =
  process.env.POSTER_CLI_PATH || "./create_map_poster.py";
const POLL_INTERVAL_MS = 5000;
const TMP_DIR = path.resolve("tmp");

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const STYLE_TO_THEME: Record<string, string> = {
  classic: "warm_beige",
  modern: "blueprint",
  night: "midnight_blue",
  blueprint: "blueprint",
  noir: "noir",
};

const SIZES = [
  { key: "png_24x36", width: 12, height: 18 },
  { key: "png_18x24", width: 9, height: 12 },
  { key: "png_12x18", width: 6, height: 9 },
  { key: "png_11x14", width: 5.5, height: 7 },
  { key: "png_8x10", width: 4, height: 5 },
] as const;

function ensureTmpDir() {
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }
}

interface PosterConfig {
  style_id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  distance: number;
  width: number;
  height: number;
  show_labels: boolean;
  show_water: boolean;
  show_parks: boolean;
  title: string;
  subtitle: string;
  date_line: string;
  format: string;
}

function runPythonCli(
  config: PosterConfig,
  outputFile: string,
  format: string,
  width: number,
  height: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const theme = STYLE_TO_THEME[config.style_id] || "warm_beige";

    const args = [
      POSTER_CLI_PATH,
      "--city",
      config.city,
      "--country",
      config.country,
      "--latitude",
      String(config.lat),
      "--longitude",
      String(config.lon),
      "--theme",
      theme,
      "--distance",
      String(config.distance),
      "--width",
      String(width),
      "--height",
      String(height),
      "--format",
      format,
    ];

    if (config.title && config.title !== config.city) {
      args.push("--display-city", config.title);
    }
    if (config.subtitle) {
      args.push("--country-label", config.subtitle);
    }

    console.log(
      `  Running: ${PYTHON_EXECUTABLE} ${args.join(" ").substring(0, 120)}...`
    );

    const proc = spawn(PYTHON_EXECUTABLE, args, {
      cwd: path.resolve("."),
      env: {
        ...process.env,
        CACHE_DIR: path.resolve("cache"),
        PYTHONIOENCODING: "utf-8",
      },
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        console.error(`  Python exited with code ${code}`);
        console.error(`  stderr: ${stderr.substring(0, 500)}`);
        reject(new Error(`Python process exited with code ${code}: ${stderr.substring(0, 300)}`));
        return;
      }

      // Find generated file in posters/ directory
      const postersDir = path.resolve("posters");
      if (fs.existsSync(postersDir)) {
        const files = fs
          .readdirSync(postersDir)
          .filter((f) => f.endsWith(`.${format}`))
          .sort(
            (a, b) =>
              fs.statSync(path.join(postersDir, b)).mtimeMs -
              fs.statSync(path.join(postersDir, a)).mtimeMs
          );

        if (files.length > 0) {
          const latestFile = path.join(postersDir, files[0]);
          fs.copyFileSync(latestFile, outputFile);
          resolve();
          return;
        }
      }

      reject(new Error("Generated file not found in posters/ directory"));
    });

    proc.on("error", (err) => {
      reject(new Error(`Failed to spawn Python: ${err.message}`));
    });
  });
}

async function uploadFile(
  localPath: string,
  storagePath: string
): Promise<void> {
  const fileBuffer = fs.readFileSync(localPath);
  const contentType = localPath.endsWith(".pdf")
    ? "application/pdf"
    : localPath.endsWith(".svg")
      ? "image/svg+xml"
      : "image/png";

  const { error } = await supabase.storage
    .from("posters")
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed for ${storagePath}: ${error.message}`);
  }
}

async function processJob(jobId: string): Promise<void> {
  console.log(`\nProcessing job ${jobId}...`);

  // Mark as running
  await supabase
    .from("poster_jobs")
    .update({ status: "running", updated_at: new Date().toISOString() })
    .eq("id", jobId);

  const { data: job, error } = await supabase
    .from("poster_jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    console.error(`  Job ${jobId} not found`);
    return;
  }

  const config = job.input as PosterConfig;
  const userId = job.user_id;
  const isPreview = job.is_preview;
  const jobDir = path.join(TMP_DIR, jobId);
  fs.mkdirSync(jobDir, { recursive: true });

  try {
    const output: Record<string, string> = {};

    if (isPreview) {
      // Generate a single small preview PNG
      const outputFile = path.join(jobDir, "preview.png");
      await runPythonCli(config, outputFile, "png", 4, 5.3);

      const storagePath = `${userId}/${jobId}/preview.png`;
      await uploadFile(outputFile, storagePath);
      output.preview = storagePath;
    } else {
      // Generate PDF
      const pdfFile = path.join(jobDir, "poster.pdf");
      await runPythonCli(config, pdfFile, "pdf", 12, 16);
      const pdfPath = `${userId}/${jobId}/poster.pdf`;
      await uploadFile(pdfFile, pdfPath);
      output.pdf = pdfPath;

      // Generate multiple PNG sizes
      for (const size of SIZES) {
        const pngFile = path.join(jobDir, `${size.key}.png`);
        await runPythonCli(config, pngFile, "png", size.width, size.height);
        const pngPath = `${userId}/${jobId}/${size.key}.png`;
        await uploadFile(pngFile, pngPath);
        output[size.key] = pngPath;
      }

      // Generate preview for library
      const previewFile = path.join(jobDir, "preview.png");
      await runPythonCli(config, previewFile, "png", 4, 5.3);
      const previewPath = `${userId}/${jobId}/preview.png`;
      await uploadFile(previewFile, previewPath);
      output.preview = previewPath;

      // Create poster record
      await supabase.from("posters").insert({
        user_id: userId,
        job_id: jobId,
        title: config.title || config.city,
        subtitle: config.subtitle || null,
        location_text: `${config.city}, ${config.country}`,
        config,
        config_hash: job.config_hash,
        storage_paths: output,
      });

      // Increment usage
      const periodStart = new Date();
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);
      const periodEnd = new Date(
        periodStart.getFullYear(),
        periodStart.getMonth() + 1,
        0
      );

      const { data: existing } = await supabase
        .from("usage")
        .select("id, posters_generated")
        .eq("user_id", userId)
        .eq("period_start", periodStart.toISOString().split("T")[0])
        .single();

      if (existing) {
        await supabase
          .from("usage")
          .update({ posters_generated: existing.posters_generated + 1 })
          .eq("id", existing.id);
      } else {
        await supabase.from("usage").insert({
          user_id: userId,
          period_start: periodStart.toISOString().split("T")[0],
          period_end: periodEnd.toISOString().split("T")[0],
          posters_generated: 1,
        });
      }
    }

    // Mark done
    await supabase
      .from("poster_jobs")
      .update({
        status: "done",
        output,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    console.log(`  Job ${jobId} completed successfully!`);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error(`  Job ${jobId} failed:`, errorMessage);

    await supabase
      .from("poster_jobs")
      .update({
        status: "failed",
        error: errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);
  } finally {
    // Cleanup tmp files
    try {
      fs.rmSync(jobDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  }
}

async function pollForJobs() {
  const { data: jobs, error } = await supabase
    .from("poster_jobs")
    .select("id")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) {
    console.error("Poll error:", error.message);
    return;
  }

  if (jobs && jobs.length > 0) {
    await processJob(jobs[0].id);
  }
}

async function main() {
  console.log("Poster Armory Worker started");
  console.log(`  Supabase URL: ${SUPABASE_URL}`);
  console.log(`  Python: ${PYTHON_EXECUTABLE}`);
  console.log(`  CLI: ${POSTER_CLI_PATH}`);
  console.log(`  Polling every ${POLL_INTERVAL_MS}ms`);
  console.log("");

  ensureTmpDir();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await pollForJobs();
    } catch (err) {
      console.error("Worker loop error:", err);
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

main();
