import Image from "next/image";

export default function BotanicalHeroSection() {
  const features = [
    {
      label: "Premium Quality\nFabric",
      sub: "100% Premium Rayon",
    },
    {
      label: "Breathable &\nSkin Friendly",
      sub: "Adjustable Back Strap\nBack Tie-up",
    },
    {
      label: "Designed for\nAll-Day Comfort",
      sub: "",
    },
    {
      label: "Wash & Care",
      sub: "",
      isWashCare: true,
    },
  ];

  const colors = [
    { bg: "#2E4A7A", border: "#6B9BDB" }, // selected - light border
    { bg: "#3A5FA0", border: "transparent" },
    { bg: "#B85C5C", border: "transparent" },
    { bg: "#1C3558", border: "transparent" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap');

        .botanical-section {
          font-family: 'Mona Sans', sans-serif;
          position: relative;
          width: 100%;
          min-height: 80vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Background image */
        .botanical-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .botanical-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }

        /* Optional subtle overlay to help card contrast */
        .botanical-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.08) 0%,
            rgba(0,0,0,0.0) 50%,
            rgba(0,0,0,0.18) 100%
          );
          z-index: 1;
        }

        /* Inner layout */
        .botanical-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 5vw;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          min-height: 80vh;
          box-sizing: border-box;
        }

        /* ── CARD ── */
        .botanical-card {
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 20px;
          width: 100%;
          max-width: 340px;
          padding: 18px;
          box-sizing: border-box;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10);
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Card top image */
        .card-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 2.6;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 14px;
        }

        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        /* Feature pills inside card */
        .card-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
        }

        .card-feature-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card-feature-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #f2f0eb;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .card-feature-text {
          display: flex;
          flex-direction: column;
        }

        .card-feature-label {
          font-size: 12px;
          font-weight: 600;
          color: #1a1208;
          line-height: 1.3;
          white-space: pre-line;
        }

        .card-feature-sub {
          font-size: 10.5px;
          font-weight: 400;
          color: #6b5f4e;
          line-height: 1.3;
          margin-top: 1px;
          white-space: pre-line;
        }

        /* Wash care icons row */
        .wash-care-icons {
          display: flex;
          gap: 4px;
          margin-top: 2px;
        }

        .wash-care-icon {
          width: 22px;
          height: 22px;
          background: #e8e4dd;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }

        /* Divider */
        .card-divider {
          height: 1px;
          background: #ede9e2;
          margin: 12px 0;
        }

        /* Product name */
        .card-product-name {
          font-size: 17px;
          font-weight: 700;
          color: #0E0E0E;
          margin: 0 0 8px 0;
          letter-spacing: -0.01em;
        }

        /* Description */
        .card-desc {
          font-size: 12px;
          font-weight: 500;
          color: #0E0E0E;
          line-height: 1.55;
          margin: 0 0 14px 0;
        }

        /* Bottom row: button + colors */
        .card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .card-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          color: #1a1208;
          font-family: 'Mona Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          padding: 9px 16px;
          border-radius: 100px;
          border: 1.5px solid #d6d0c6;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.18s, border-color 0.18s;
        }

        .card-add-btn:hover {
  background: #281000;
  border-color: #B5AFA4;
  color: #ffffff;
}

        .card-colors {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .card-color-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.15s;
        }

        .card-color-dot:hover {
          transform: scale(1.15);
        }

        .card-color-dot.selected {
          outline: 2px solid #6B9BDB;
          outline-offset: 2px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .botanical-inner {
            justify-content: center;
            align-items: flex-end;
            padding: 40px 20px 40px;
          }

          .botanical-card {
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .botanical-section {
            min-height: 100svh;
          }

          .botanical-inner {
            padding: 32px 16px 32px;
          }

          .card-product-name {
            font-size: 15px;
          }
        }
      `}</style>

      <section className="botanical-section">
        {/* Background */}
        <div className="botanical-bg">
          <Image
            src="/retail/home/11.png"
            alt="Botanical background"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            sizes="100vw"
          />
        </div>

        {/* Overlay */}
        <div className="botanical-overlay" />

        {/* Content */}
        <div className="botanical-inner">
          <div className="botanical-card">

            {/* Product image inside card */}
            <div className="card-image-wrap">
              <Image
                src="/retail/home/8.png"
                alt="Botanical Halter Maxi Dress"
                fill
                style={{ objectFit: "cover", objectPosition: "top center" }}
                sizes="340px"
              />
            </div>

           

            <div className="card-divider" />

            {/* Product name */}
            <h2 className="card-product-name">Botanical Halter Maxi</h2>

            {/* Description */}
            <p className="card-desc">
              Adjustable back strap · Back tie-up · Floor length ·
              Breathable rayon · 100% Premium Rayon · Halter Maxi Dress
            </p>

            {/* Bottom: CTA + colors */}
            <div className="card-bottom">
              <button className="card-add-btn">
                + Add To Cart
              </button>
              <div className="card-colors">
                {[
                  { bg: "#2E4A7A", selected: true },
                  { bg: "#3A5FA0", selected: false },
                  { bg: "#B85C5C", selected: false },
                  { bg: "#1C3558", selected: false },
                ].map((c, i) => (
                  <div
                    key={i}
                    className={`card-color-dot${c.selected ? " selected" : ""}`}
                    style={{ backgroundColor: c.bg }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}