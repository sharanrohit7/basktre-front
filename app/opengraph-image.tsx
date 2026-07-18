import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "Basktre — intelligent LLM router and unified AI API gateway";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#071410", color: "white" }}><div style={{ fontSize: 28, color: "#4ade80", marginBottom: 24 }}>basktre</div><div style={{ fontSize: 66, lineHeight: 1.08, maxWidth: 980 }}>One API for every LLM.<br />Automatically routed for lower cost.</div><div style={{ fontSize: 25, color: "#a7b8ae", marginTop: 34 }}>60+ models · 4% top-up fee · no prompt or response logging</div></div>, size);
}
