import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="ru">
      <body style={{ background: "#131214", color: "#fafcf0", fontFamily: "system-ui", display: "grid", placeItems: "center", minHeight: "100dvh" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 64, fontWeight: 700, color: "#02d866", margin: 0 }}>404</p>
          <Link href="/ru" style={{ color: "#fafcf0" }}>На главную</Link>
        </div>
      </body>
    </html>
  );
}
