import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import { profile } from "@/config/profile";
import { siteConfig } from "@/config/site";

// The card shown when a link to the site is shared: the Living Systems Atlas
// behind the headline, in the fixed dark Emerald palette (a social preview
// cannot follow the visitor's theme).
export const alt = `${profile.name}, full stack engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Satori reads PNG and JPEG, not WebP, so the card has its own JPEG cut.
  const atlas = await readFile(path.join(process.cwd(), "public/visuals/atlas/living-systems-atlas-og.jpg"));
  const src = `data:image/jpeg;base64,${atlas.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#07100d", color: "#ecf7f0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={1008} height={630} style={{ position: "absolute", right: -60, top: 0, opacity: 0.9 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #07100d 30%, rgba(7,16,13,0.6) 60%, rgba(7,16,13,0) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: "100%" }}>
          <div style={{ fontSize: 24, color: "#a0b6a8" }}>{siteConfig.url.replace("https://", "")}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 80, letterSpacing: -3, lineHeight: 1.0, maxWidth: 700, fontWeight: 600 }}>
              I build software for the real world.
            </div>
            <div style={{ marginTop: 32, fontSize: 30, color: "#67e39b" }}>{profile.displayName}</div>
            <div style={{ marginTop: 6, fontSize: 24, color: "#a0b6a8" }}>Web platforms, mobile apps and Windows software</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
