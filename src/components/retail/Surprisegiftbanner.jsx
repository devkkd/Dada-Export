export default function SurpriseGiftBanner() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap');

        .sgb-wrapper {
          font-family: 'Mona Sans', sans-serif;
          background-color: #FFF7F2;
          width: 100%;
          padding: 28px 40px;
          box-sizing: border-box;
        }

        .sgb-card {
          background-color: #281000;
          border-radius: 18px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 0;
          min-height: 110px;
          box-sizing: border-box;
        }

        /* ── GOLDEN CROSS STRIPS ── */
        .sgb-strip-v {
          position: absolute;
          left: 70px;
          top: 0;
          bottom: 0;
          width: 6px;
          background: linear-gradient(to bottom,
            #6B4C00 0%,
            #C9A030 15%,
            #F5D878 35%,
            #E8C050 50%,
            #F5D878 65%,
            #C9A030 85%,
            #6B4C00 100%
          );
          z-index: 2;
        }

        .sgb-strip-h {
          position: absolute;
          left: 0;
          right: 0;
          top: 30%;
          height: 6px;
          background: linear-gradient(to right,
            #6B4C00 0%,
            #C9A030 5%,
            #F5D878 20%,
            #E8C050 50%,
            #F5D878 80%,
            #C9A030 95%,
            #6B4C00 100%
          );
          z-index: 2;
        }

        /* ── BOW COLUMN ── */
        .sgb-bow-col {
          flex-shrink: 0;
          width: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
          align-self: stretch;
          position: relative;
          z-index: 3;
          left: 10px;
          top: -26px;
        }

        /* ── CONTENT ── */
        .sgb-content {
          flex: 1;
          padding: 75px 24px 24px 3px;
          z-index: 3;
          min-width: 0;
        }

        .sgb-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #FEE6C3;
          margin: 0 0 7px 0;
          opacity: 0.80;
        }

        .sgb-headline {
          font-size: clamp(16px, 1.8vw, 21px);
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 7px 0;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .sgb-desc {
          font-size: clamp(11px, 0.85vw, 13px);
          font-weight: 400;
          color: #FEE6C3;
          line-height: 1.55;
          margin: 0;
          opacity: 0.80;
        }

        /* ── BUTTON ── */
        .sgb-btn-col {
          flex-shrink: 0;
          padding: 70px 32px 24px 16px;
          z-index: 3;
        }

        .sgb-btn {
          background: #FEE6C3;
          color: #281000;
          font-family: 'Mona Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          border: none;
          border-radius: 100px;
          padding: 13px 30px;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity 0.18s, transform 0.18s;
        }

        .sgb-btn:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        /* ── TABLET (641px – 900px) ── */
        @media (max-width: 900px) {
          .sgb-wrapper {
            padding: 20px 20px;
          }

          .sgb-bow-col {
            width: 110px;
          }

          .sgb-strip-v {
            left: 57px;
          }

          .sgb-headline {
            font-size: clamp(14px, 2.2vw, 18px);
          }

          .sgb-btn-col {
            padding: 70px 20px 24px 12px;
          }

          .sgb-btn {
            font-size: 12.5px;
            padding: 11px 22px;
          }
        }

        /* ── MOBILE (max 640px) — vertical stacked layout ── */
        @media (max-width: 640px) {
          .sgb-wrapper {
            padding: 16px 14px;
          }

          .sgb-card {
            flex-direction: column;
            align-items: stretch;
            min-height: unset;
            border-radius: 14px;
          }

          /* On mobile: top section has bow + text side by side */
          .sgb-top-row {
            display: flex;
            align-items: center;
            position: relative;
          }

          .sgb-strip-v {
            left: 56px;
          }

          /* Reposition horizontal strip for mobile card height */
          .sgb-strip-h {
            top: 34px;
          }

          .sgb-bow-col {
            width: 90px;
            flex-shrink: 0;
            left: 6px;
            top: -18px;
          }

          .sgb-bow-col svg {
            width: 76px;
            height: 70px;
          }

          .sgb-content {
            padding: 16px 16px 12px 8px;
          }

          .sgb-eyebrow {
            font-size: 9px;
            letter-spacing: 0.12em;
            margin-bottom: 5px;
          }

          .sgb-headline {
            font-size: 15px;
            line-height: 1.25;
            margin-bottom: 5px;
          }

          .sgb-desc {
            font-size: 11.5px;
            line-height: 1.5;
          }

          .sgb-btn-col {
            padding: 4px 16px 18px 16px;
          }

          .sgb-btn {
            width: 100%;
            text-align: center;
            font-size: 13px;
            padding: 13px 20px;
            border-radius: 100px;
          }
        }

        /* ── VERY SMALL (max 380px) ── */
        @media (max-width: 380px) {
          .sgb-wrapper {
            padding: 12px 10px;
          }

          .sgb-bow-col {
            width: 76px;
          }

          .sgb-bow-col svg {
            width: 62px;
            height: 58px;
          }

          .sgb-strip-v {
            left: 44px;
          }

          .sgb-headline {
            font-size: 13.5px;
          }

          .sgb-desc {
            font-size: 10.5px;
          }

          .sgb-btn {
            font-size: 12px;
            padding: 12px 16px;
          }
        }
      `}</style>

      <div className="sgb-wrapper">
        <div className="sgb-card">

          {/* Cross strips */}
          <div className="sgb-strip-v" />
          <div className="sgb-strip-h" />

          {/* Bow */}
          <div className="sgb-bow-col">
            <svg width="96" height="88" viewBox="0 0 96 88" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Left bow loop */}
              <path d="M48 42 C40 34 10 18 4 24 C-2 30 24 44 48 46Z" fill="url(#ll)"/>
              <path d="M48 42 C42 36 16 24 10 28 C6 32 28 42 48 44Z" fill="#3D1500" opacity="0.4"/>

              {/* Right bow loop */}
              <path d="M48 42 C56 34 86 18 92 24 C98 30 72 44 48 46Z" fill="url(#rl)"/>
              <path d="M48 42 C54 36 80 24 86 28 C90 32 68 42 48 44Z" fill="#3D1500" opacity="0.4"/>

              {/* Left tail */}
              <path d="M46 46 C38 54 22 72 16 80 C24 76 36 60 46 50Z" fill="url(#lt)"/>
              {/* Right tail */}
              <path d="M50 46 C58 54 74 72 80 80 C72 76 60 60 50 50Z" fill="url(#rt)"/>

              {/* Center knot */}
              <ellipse cx="48" cy="44" rx="9" ry="7" fill="url(#kn)"/>
              <ellipse cx="48" cy="43" rx="5" ry="3.5" fill="#F5D878" opacity="0.6"/>

              <defs>
                <linearGradient id="ll" x1="4" y1="24" x2="48" y2="46" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B6200"/>
                  <stop offset="0.5" stopColor="#D4A020"/>
                  <stop offset="1" stopColor="#F0CC50"/>
                </linearGradient>
                <linearGradient id="rl" x1="92" y1="24" x2="48" y2="46" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B6200"/>
                  <stop offset="0.5" stopColor="#D4A020"/>
                  <stop offset="1" stopColor="#F0CC50"/>
                </linearGradient>
                <linearGradient id="lt" x1="46" y1="46" x2="16" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#C9920E"/>
                  <stop offset="1" stopColor="#6B4400"/>
                </linearGradient>
                <linearGradient id="rt" x1="50" y1="46" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#C9920E"/>
                  <stop offset="1" stopColor="#6B4400"/>
                </linearGradient>
                <linearGradient id="kn" x1="39" y1="37" x2="57" y2="51" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F5D060"/>
                  <stop offset="1" stopColor="#9B6E00"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Text */}
          <div className="sgb-content">
            <p className="sgb-eyebrow">Something Extra, Just For You</p>
            <h2 className="sgb-headline">Shop ₹4,000 & Get a Surprise Gift</h2>
            <p className="sgb-desc">
              Every Order Above ₹4,000 Includes A Free Mystery Garment A Dress, A Skirt,
              Or A Top Chosen With Care By Ivera – Dada Exports Team.
            </p>
          </div>

          {/* Button */}
          <div className="sgb-btn-col">
            <button className="sgb-btn">Shop Now</button>
          </div>

        </div>
      </div>
    </>
  );
}