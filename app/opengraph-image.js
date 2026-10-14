import { ImageResponse } from "next/og";

export const alt = "Addis Eats Ethiopian restaurant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "#fffaf4",
          background: "linear-gradient(135deg, #672e19 0%, #a3471d 58%, #d18a43 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 700 }}>ADDIS EATS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 70, fontWeight: 700 }}>Ethiopian food</div>
          <div style={{ fontSize: 42 }}>Made for sharing.</div>
          <div style={{ fontSize: 26 }}>Freshly prepared in Addis Ababa</div>
        </div>
      </div>
    ),
    size,
  );
}