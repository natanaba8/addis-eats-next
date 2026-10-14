import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { findDish } from "../lib/dishes";
import { etb } from "../../../lib/format.js";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ethiopian menu dish from Addis Eats";

export default async function DishOpenGraphImage({ params }) {
  const { id } = await params;
  const dish = findDish(id);
  if (!dish) notFound();

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
        <div style={{ fontSize: 30, fontWeight: 700 }}>ADDIS EATS MENU</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 76, fontWeight: 700 }}>{dish.name}</div>
          <div style={{ fontSize: 30 }}>{dish.description}</div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>
            {etb(dish.price)}
          </div>
        </div>
      </div>
    ),
    size,
  );
}