import { dishes } from "../../menu/lib/dishes";

export function GET() {
  return Response.json({ dishes });
}