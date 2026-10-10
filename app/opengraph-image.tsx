import { ImageResponse } from "next/og";

import { profile } from "@/config/profile";
import { siteConfig } from "@/config/site";

// The card shown when a link to the site is shared. Fixed dark colours and
// the default accent: a social preview cannot follow the visitor's theme.
export const alt = `${profile.name}, full stack engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#09090b",
          backgroundImage: "radial-gradient(circle at 85% 15%, rgba(52,211,153,0.28), transparent 45%)",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#a1a1aa" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#34d399" }} />
          {siteConfig.url.replace("https://", "")}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 78, letterSpacing: -2, lineHeight: 1.05, maxWidth: 980 }}>
            I build software that runs real businesses.
          </div>
          <div style={{ marginTop: 30, fontSize: 32, color: "#34d399" }}>{profile.name}</div>
          <div style={{ marginTop: 6, fontSize: 26, color: "#a1a1aa" }}>
            Full stack engineer: web platforms, mobile apps and Windows software
          </div>
        </div>
      </div>
    ),
    size
  );
}
