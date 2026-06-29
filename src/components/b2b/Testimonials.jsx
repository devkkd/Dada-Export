// src/components/b2b/Testimonials.tsx
'use client';
import React from 'react';
import Image from 'next/image';

const Testimonials = () => {
const reviews = [
  {
    stars: "★★★★★",
    text: "The fabric quality is exceptional – my boutique customers immediately notice the difference. Dada Exports delivers exactly what they promise: export quality at honest prices.",
    name: "Priya Ramchandani",
    title: "Boutique Owner, Mumbai"
  },
  {
    stars: "★★★★★",
    text: "We've been sourcing dresses and co-ord sets from Dada Exports for over a year. The consistency in stitching, finishing, and packaging has been outstanding.",
    name: "Anjali Mehta",
    title: "Fashion Retailer, Jaipur"
  },
  {
    stars: "★★★★★",
    text: "Their private label support helped us launch our own collection smoothly. Communication was professional and delivery timelines were always maintained.",
    name: "Rahul Khanna",
    title: "Brand Founder, Delhi"
  },
  {
    stars: "★★★★★",
    text: "The designs are modern while maintaining authentic Indian craftsmanship. Our customers love the fabric quality and attention to detail.",
    name: "Sophie Williams",
    title: "Boutique Owner, Australia"
  },
  {
    stars: "★★★★★",
    text: "From sampling to bulk production, the entire process was transparent and efficient. The team understands export requirements perfectly.",
    name: "David Thompson",
    title: "Import Partner, Canada"
  },
  {
    stars: "★★★★★",
    text: "Low MOQ options allowed us to test new collections without risk. The quality exceeded expectations and reorder demand was immediate.",
    name: "Neha Agarwal",
    title: "Online Fashion Seller, Bangalore"
  },
  {
    stars: "★★★★★",
    text: "Excellent craftsmanship and premium fabrics. Every shipment arrives exactly as approved in the samples, which gives us confidence in every order.",
    name: "Mark Richardson",
    title: "Wholesale Buyer, USA"
  }
];

  return (
    <section className="w-full bg-[#FFFEF9] overflow-hidden pt-12 pb-20">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24">

        {/* Header */}
        <div className="flex flex-col items-left text-left mb-12 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#95565E]"></div>
            <span className="text-[#95565E] uppercase tracking-widest text-sm font-medium">
              WHAT PARTNERS SAY
            </span>
            <div className="h-px w-12 bg-[#95565E]"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-medium text-[#95565E] mb-8">
            Trusted by Partners{' '}
            <span className="font-bold text-[#95565E]">Worldwide</span>
          </h2>
        </div>

        {/* Auto Scrolling Cards */}
        <div className="relative w-screen">
          <div className="overflow-hidden py-4 group">
            <div className="flex gap-4 sm:gap-5 md:gap-6 animate-marquee group-hover:[animation-play-state:paused]">
              {[...reviews, ...reviews].map((review, index) => (
                <div
                  key={index}
                  className="
                    bg-[#FFFEF9] border border-[#E5D9C8] rounded-[16px]
                    flex-shrink-0 flex flex-col justify-between
                    transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
                    w-[220px] h-[240px] p-4
                    sm:w-[270px] sm:h-[260px] sm:p-5
                    md:w-[340px] md:h-[280px] md:p-6
                    lg:w-[400px] lg:h-[300px] lg:p-7
                    xl:w-[430px] xl:h-[300px] xl:p-8
                  "
                >
                  {/* Stars */}
                  <div className="text-[#95565E] tracking-[2px] sm:tracking-[3px] text-[11px] sm:text-[12px] md:text-sm mb-2 sm:mb-3 md:mb-6 shrink-0">
                    {review.stars}
                  </div>

                  {/* Review text */}
                  <p className="
                    text-[#0E0E0E] flex-1 overflow-hidden
                    text-[11px] leading-[1.45]
                    sm:text-[12px] sm:leading-[1.5]
                    md:text-[13px] md:leading-[1.55]
                    lg:text-[15px] lg:leading-[1.6]
                    xl:text-[16px]
                    line-clamp-4 sm:line-clamp-4 md:line-clamp-4 lg:line-clamp-5
                  ">
                    {review.text}
                  </p>

                  {/* Author */}
                  <div className="mt-2 sm:mt-3 md:mt-4 shrink-0">
                    <div className="text-[#0E0E0E] text-base sm:text-lg md:text-xl mb-1 sm:mb-2">-</div>
                    <p className="font-bold text-[#0E0E0E] text-[11px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px]">
                      {review.name}
                    </p>
                    <p className="font-bold text-[#0E0E0E] text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] mt-0.5">
                      {review.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;