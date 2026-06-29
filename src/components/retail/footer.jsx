// components/Footer.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#FEE6C3] text-[#0E0E0E] pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Section - Logo + Description */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pb-10">
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="flex items-center gap-4">
              <Image
                src="/retail/footerlogo.png"
                alt="DADA EXPORTS"
                width={200}
                height={200}
                className="object-contain"
                priority
              />
             
            </div>
          </div>

          <div className="lg:w-2/3">
            <h2 className="text-[24px] font-bold mb-4 tracking-tight">DADA EXPORTS</h2>
            <p className="text-[15.5px] leading-[1.65] text-[#3F2A1E]/90">
              38+ YEARS OF THREAD &amp; TRUST • PUSHKAR, INDIA. A FAMILY-BACKED GARMENT MANUFACTURER 
              AND EXPORTER FROM PUSHKAR, RAJASTHAN - DELIVERING EXPORT-QUALITY APPAREL TO WHOLESALE 
              BUYERS, RETAILERS, AND INTERNATIONAL IMPORTERS SINCE 1992.
            </p>
          </div>
        </div>
<div className="relative left-1/2 -translate-x-1/2 w-screen border-b border-[#3F2A1E]/10"></div>
        {/* Main Footer Links */}
      <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-y-10 gap-x-10">

  {/* EXCLUSIVE TO BUSINESS PARTNERS */}
  <div>
    <h4 className="text-[16px] tracking-wider mb-5">
      EXCLUSIVE TO BUSINESS PARTNERS
    </h4>

    <div className="grid grid-cols-2 gap-x-8 text-[12px]">
      <ul className="space-y-[10px]">
        <li><Link href="#">Accessories</Link></li>
        <li><Link href="#">Bags</Link></li>
        <li><Link href="#">Purses</Link></li>
        <li><Link href="#">Toiletry Bags</Link></li>
      </ul>

      <ul className="space-y-[10px]">
        <li><Link href="#">Home & Lifestyle</Link></li>
        <li><Link href="#">Yoga Mats</Link></li>
        <li><Link href="#">Sofa Covers</Link></li>
      </ul>
    </div>
  </div>

  {/* Dresses */}
  <div>
    <ul className="space-y-[10px] text-[12px]">
      <li className="font-medium text-black mb-2">Dresses</li>
      <li><Link href="#">Maxi Dress</Link></li>
      <li><Link href="#">Midi Dress</Link></li>
      <li><Link href="#">Short Dress</Link></li>
    </ul>
  </div>

  {/* Tops */}
  <div>
    <ul className="space-y-[10px] text-[12px]">
      <li className="font-medium text-black mb-2">Tops</li>
      <li><Link href="#">Crop Tops</Link></li>
      <li><Link href="#">Shirts</Link></li>
      <li><Link href="#">T-Shirts</Link></li>
    </ul>
  </div>

  {/* Bottom Wear */}
  <div>
    <ul className="space-y-[10px] text-[12px]">
      <li className="font-medium text-black mb-2">Bottom Wear</li>
      <li><Link href="#">Pants</Link></li>
      <li><Link href="#">Skirts</Link></li>
      <li><Link href="#">Shorts</Link></li>
    </ul>
  </div>

  {/* Company + Contact */}
  <div className="flex flex-col sm:flex-row gap-10 lg:gap-16">

    <div>
      <ul className="space-y-[10px] text-[12px]">
        <li className="font-medium text-black mb-2">Company</li>
        <li><Link href="#">About Us</Link></li>
        <li><Link href="#">Our Legacy & story</Link></li>
        <br></br>
        <li><Link href="#">Why Choose</Link></li>

        <li><Link href="#">Process</Link></li>
        <li><Link href="#">Wholesale Enquiry</Link></li>
        <li><Link href="#">Privacy Policy</Link></li>
      </ul>
    </div>

    <div>
      <ul className="space-y-[10px] text-[12px]">
        <li className="font-medium text-black mb-2">Contact</li>
        <li>Pushkar, Rajasthan, India</li>
        <li>+91 8209934610</li>
        <li>
          <a
            href="mailto:dada.exports@gmail.com"
            className="hover:underline"
          >
            dada.exports@gmail.com
          </a>
        </li>
      </ul>
    </div>

  </div>

</div>
<div className="mt-6 relative left-1/2 -translate-x-1/2 w-screen border-b border-[#3F2A1E]/10"></div>
        {/* Bottom Bar */}
        <div className="pt-0 mt-4 flex flex-col md:flex-row items-center justify-between gap-6 text-[14px]">
            
          <div className="text-center md:text-left">
            © 2025 Dada Exports, Pushkar. All Rights Reserved. Est. 2023 • Family Craft Since 1992.
          </div>
          
          <div className="flex items-center gap-5">
            <span className="font-medium">Follow us</span>
            
            <Link href="#" target="_blank" className="hover:scale-110 transition-transform">
              <Image
                src="/instagram-logo-vector-illustrati 2-2.png"
                alt="Instagram"
                width={32}
                height={32}
                className="object-contain"
              />
            </Link>
            
            <Link href="#" target="_blank" className="hover:scale-110 transition-transform">
              <Image
                src="/g21.png"
                alt="Facebook"
                width={32}
                height={32}
                className="object-contain"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}