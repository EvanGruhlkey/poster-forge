import React from "react";
import { interpolate, Easing } from "remotion";
import { UI } from "./constants";
import {
  NavbarUI,
  CardUI,
  BtnUI,
  InputUI,
  MapPinIcon,
  ChevronRightIcon,
  LoaderIcon,
} from "./components";

const TYPING_CITY = "Barcelona";
const TYPING_COUNTRY = "Spain";
const FOUND_TEXT = "Barcelona, Spain";
const FOUND_COORDS = "(41.3874, 2.1686)";

const CITY_TYPE_START = 170;
const CITY_TYPE_END = 230;
const COUNTRY_TYPE_START = 340;
const COUNTRY_TYPE_END = 410;
const FIND_CLICK = 490;
const FOUND_FRAME = 570;
const NEXT_CLICK = 750;

function getTyped(text: string, lf: number, start: number, end: number) {
  if (lf < start) return "";
  const progress = interpolate(lf, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return text.slice(0, Math.ceil(progress * text.length));
}

export const LocationPage: React.FC<{ localFrame: number }> = ({
  localFrame: lf,
}) => {
  const opacity = interpolate(lf, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cityValue = getTyped(TYPING_CITY, lf, CITY_TYPE_START, CITY_TYPE_END);
  const countryValue = getTyped(TYPING_COUNTRY, lf, COUNTRY_TYPE_START, COUNTRY_TYPE_END);
  const isFinding = lf >= FIND_CLICK && lf < FOUND_FRAME;
  const isFound = lf >= FOUND_FRAME;
  const cityFocused = lf >= CITY_TYPE_START - 5 && lf < COUNTRY_TYPE_START - 5;
  const countryFocused = lf >= COUNTRY_TYPE_START - 5 && lf < FIND_CLICK;

  const foundOpacity = interpolate(lf, [FOUND_FRAME, FOUND_FRAME + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        background: UI.pageBg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavbarUI isApp />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 40px 0",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: UI.text,
            margin: 0,
            textAlign: "center",
          }}
        >
          Pick Your Location
        </h1>
        <p
          style={{
            fontSize: 14,
            color: UI.textMuted,
            marginTop: 6,
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          Enter the city or address you want to map.
        </p>

        <CardUI style={{ width: 600 }}>
          <div
            style={{
              padding: "18px 20px 6px",
              borderBottom: `1px solid ${UI.cardBorder}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 16,
                fontWeight: 600,
                color: UI.text,
              }}
            >
              <MapPinIcon size={18} color={UI.text} />
              Location
            </div>
            <p
              style={{
                fontSize: 13,
                color: UI.textMuted,
                margin: "4px 0 12px",
              }}
            >
              Search by city name or paste coordinates
            </p>
          </div>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: UI.text,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  City
                </label>
                <InputUI
                  value={cityValue}
                  placeholder="Paris"
                  focused={cityFocused}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: UI.text,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Country
                </label>
                <InputUI
                  value={countryValue}
                  placeholder="France"
                  focused={countryFocused}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: UI.text,
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Or search by address / place name
              </label>
              <InputUI value="" placeholder="e.g. Eiffel Tower, Paris" />
            </div>

            <BtnUI
              variant="primary"
              active={isFinding}
              style={{ alignSelf: "flex-start" }}
            >
              {isFinding ? (
                <LoaderIcon size={15} color="#fff" />
              ) : (
                <MapPinIcon size={15} color="#fff" />
              )}
              Find Location
            </BtnUI>

            {isFound && (
              <div
                style={{
                  opacity: foundOpacity,
                  borderRadius: 8,
                  border: `1px solid ${UI.cardBorder}`,
                  background: "rgba(241,245,249,0.5)",
                  padding: "10px 14px",
                  fontSize: 14,
                }}
              >
                <span style={{ fontWeight: 600, color: UI.text }}>
                  {FOUND_TEXT}
                </span>
                <span
                  style={{ marginLeft: 10, color: UI.textMuted }}
                >
                  {FOUND_COORDS}
                </span>
              </div>
            )}
          </div>
        </CardUI>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "flex-end",
            width: 600,
          }}
        >
          <BtnUI
            size="lg"
            disabled={!isFound}
            active={lf >= NEXT_CLICK && lf < NEXT_CLICK + 10}
          >
            Next: Customize Design
            <ChevronRightIcon size={15} color="#fff" />
          </BtnUI>
        </div>
      </div>
    </div>
  );
};
