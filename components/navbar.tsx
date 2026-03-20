"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, LogOut, Library, CreditCard } from "lucide-react";
import { Logo } from "@/components/logo";
import { useEffect, useState } from "react";
import type { User as SupaUser } from "@supabase/supabase-js";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoaded(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoaded(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isApp = pathname.startsWith("/app");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Logo className="h-6 w-6" />
          Poster Armory
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/pricing"
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname === "/pricing"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Pricing
          </Link>

          {!authLoaded ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
            </div>
          ) : user ? (
            <>
              {isApp && (
                <Link
                  href="/app/library"
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    pathname === "/app/library"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  My Library
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {user.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    My Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push("/app")}>
                    <MapPin className="mr-2 h-4 w-4" />
                    New Poster
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/app/library")}
                  >
                    <Library className="mr-2 h-4 w-4" />
                    My Library
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/app/billing")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                My Account
              </Link>
              <Button asChild size="sm">
                <Link href="/login">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
