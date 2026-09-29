import { ImageResponse } from "next/og";

export const alt = "IA para E-commerce 2026 — Central de Inteligência EyAgencia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0f2422 0%, #173b38 58%, #0b1716 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: "72px",
        }}
      >
        <div style={{ position: "absolute", right: "-100px", top: "-120px", width: "430px", height: "430px", borderRadius: "999px", background: "rgba(58,122,115,0.32)" }} />
        <div style={{ position: "absolute", left: "-130px", bottom: "-210px", width: "500px", height: "500px", borderRadius: "999px", background: "rgba(240,129,91,0.18)" }} />

        <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", gap: "52px" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "61%" }}>
            <div style={{ display: "flex", alignSelf: "flex-start", border: "1px solid rgba(158,194,189,0.55)", borderRadius: "999px", padding: "12px 20px", fontSize: "18px", fontWeight: 800, letterSpacing: "2px", color: "#b8d8d4" }}>
              CENTRAL DE INTELIGÊNCIA EYAGENCIA
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "34px", fontSize: "64px", fontWeight: 900, lineHeight: 1.03 }}>
              <span>IA para E-commerce</span>
              <span style={{ color: "#f0815b" }}>em 2026</span>
            </div>
            <div style={{ display: "flex", marginTop: "26px", fontSize: "25px", lineHeight: 1.35, color: "#d8e8e5" }}>
              Ferramentas, agentes e aplicações para aquisição, conversão, CRM, conteúdo e operação.
            </div>
            <div style={{ display: "flex", marginTop: "34px", fontSize: "18px", fontWeight: 700, color: "#9cc2bd" }}>
              eyagencia.com.br/ia-ecommerce
            </div>
          </div>

          <div style={{ display: "flex", width: "34%", height: "390px", borderRadius: "34px", border: "1px solid rgba(158,194,189,0.55)", background: "rgba(255,255,255,0.07)", padding: "30px", flexDirection: "column", justifyContent: "space-between" }}>
            {["SEO + GEO", "Agentes", "CRM", "Ads + CRO", "Analytics"].map((item, index) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "15px 18px", borderRadius: "18px", background: index === 3 ? "rgba(240,129,91,0.14)" : "rgba(255,255,255,0.08)", fontSize: "20px", fontWeight: 800 }}>
                <span style={{ display: "flex", width: "13px", height: "13px", borderRadius: "999px", background: index === 3 ? "#f0815b" : "#79afaa" }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
