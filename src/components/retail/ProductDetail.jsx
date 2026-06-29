import Image from "next/image";

export default function KasturiSection() {
  const features = [
    {
      title: "100% Premium Kasturi Silk",
      desc: "Soft, Luminous, And Skin-friendly",
    },
    {
      title: "Signature Paisley Print",
      desc: "Rooted In Pushkar's Textile Heritage",
    },
    {
      title: "Adjustable Halter Tie-up",
      desc: "Customisable Fit For Every Body",
    },
    {
      title: "Luxury Silk Shine Finish",
      desc: "Natural Lustre, No Artifice",
    },
    {
      title: "Precision Stitching",
      desc: "Boutique-quality Finishing, Export-grade Standard",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap');

        .kasturi-section {
  font-family: 'Mona Sans', sans-serif;
  background-color: #FFF7F2;
  color: #281000;
  box-sizing: border-box;
  width: 100%;
  padding-top: 60px;
  padding-bottom: 60px;
}

        .kasturi-inner {
  display: flex;
  align-items: flex-end;
  gap: 0;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

        /* ── LEFT CONTENT ── */
        .kasturi-content {
  flex: 0 0 50%;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 48px;
  box-sizing: border-box;
}

        .kasturi-eyebrow {
  font-size: 18px;
  font-weight: 700; /* SemiBold */
  
  color: #281000;
  margin: 0 0 20px 0;
  opacity: 2;
}

        .kasturi-headline {
          font-size: clamp(30px, 3.6vw, 34px);
          font-weight: 400;
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: #281000;
          margin: 0 0 28px 0;
        }

        .kasturi-body {
          font-size: clamp(14px, 1.1vw, 16px);
          font-weight: 500;
          line-height: 1.65;
          color: #281000;
          opacity: 0.82;
          margin: 0 0 32px 0;
          max-width: 520px;
        }

        .kasturi-features {
          list-style: none;
          padding: 0;
          margin: 0 0 32px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .kasturi-features li {
          font-size: clamp(13px, 1vw, 15px);
          font-weight: 500;
          color: #281000;
          display: flex;
          align-items: baseline;
          gap: 8px;
          line-height: 1.5;
        }

        .kasturi-features li::before {
          content: "→";
          font-size: 13px;
          flex-shrink: 0;
          opacity: 0.6;
        }

        .kasturi-features li strong {
          font-weight: 500;
        }

        .kasturi-care {
          font-size: clamp(12px, 0.9vw, 14px);
          font-weight: 500;
          color: #281000;
          opacity: 0.7;
          line-height: 1.7;
          margin: 0 0 36px 0;
        }

        .kasturi-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #281000;
          color: #FFF7F2;
          font-family: 'Mona Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 14px 28px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          width: fit-content;
        }

        .kasturi-btn:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .kasturi-btn svg {
          transition: transform 0.2s ease;
        }

        .kasturi-btn:hover svg {
          transform: translateX(3px);
        }

        /* ── RIGHT IMAGE ── */
       .kasturi-image-wrap {
  flex: 0 0 50%;
  max-width: 50%;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 720px;
}

        .kasturi-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
  .kasturi-inner {
    flex-direction: column;
    gap: 40px;
    align-items: stretch;
  }

  .kasturi-content {
    flex: 0 0 100%;
    max-width: 100%;
    padding-right: 0;
  }

  .kasturi-image-wrap {
    flex: 0 0 100%;
    max-width: 100%;
    width: 100%;
    min-height: 520px;
    border-radius: 16px;
  }
}

       @media (max-width: 640px) {
  .kasturi-section {
    padding: 40px 20px;
  }

  .kasturi-image-wrap {
    width: 100%;
    max-width: 100%;
    min-height: 420px;
    border-radius: 12px;
  }

  .kasturi-headline {
    font-size: 30px;
  }
}
      `}</style>

      <section className="kasturi-section">
  <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24">
    <div className="kasturi-inner">

          {/* LEFT: Content */}
          <div className="kasturi-content">
            {/* Eyebrow / small label */}
            <p className="kasturi-eyebrow">Kasturi Silk Crop Tie-Top</p>

            {/* Hero headline */}
            <h1 className="kasturi-headline">
              The Art Of Dressing Well,<br />Distilled Into One Piece
            </h1>

            {/* Body paragraph */}
            <p className="kasturi-body">
              A Luxurious Halter-style Crop Top Crafted From 100% Premium Kasturi Silk Where
              The Richness Of Traditional Indian Textile Meets A Silhouette Built For The Modern
              Wardrobe.
            </p>

            {/* Feature points */}
            <ul className="kasturi-features">
              {features.map((f, i) => (
                <li key={i}>
                  <strong>{f.title}</strong> – {f.desc}
                </li>
              ))}
            </ul>

            {/* Care instructions */}
            <p className="kasturi-care">
              Hand Wash Or Dry Clean Recommended.<br />
              Iron On Reverse Side At Low Heat. Shade Dry.
            </p>

            {/* CTA Button */}
            <a href="#" className="kasturi-btn">
              Shop This Style
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="#FFF7F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* RIGHT: Image */}
          <div className="kasturi-image-wrap">
            <Image
              src="/retail/home/3.png"
              alt="Kasturi Silk Crop Tie-Top"
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
          </div>

              </div>
      </div>
    </section>
    </>
  );
}