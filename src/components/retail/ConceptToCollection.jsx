// src/components/b2b/ConceptToCollection.tsx
'use client';
import Image from 'next/image';
import React from 'react';

const ConceptToCollection = () => {
  const videos = [
    { src: "/b2b/home/vid1.mp4", overlay: "hi, i'm monika, founder of iveara." },
    { src: "/b2b/home/vid2.mp4", overlay: null },
    { src: "/b2b/home/vid3.mp4", overlay: '"STOP SCROLLING 🌸 This floral shirt is EVERYTHING"' },
    { src: "/b2b/home/vid4.mp4", overlay: "more to come. ✨" },
    { src: "/b2b/home/vid5.mp4", overlay: null },
  ];

  return (
   <section
  className="w-full bg-[#FFF7F2]"
>
  <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-35">    {/* Header */}
      <div className="mb-12 md:mb-16 lg:mb-20">

  {/* Top Row */}
  <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-6">

    {/* Left */}
    <div className="flex items-center justify-center lg:justify-start gap-3">
      <div className="h-px w-12 bg-[#281000]" />
      <span className="text-[#281000] uppercase tracking-[3px] text-[11px] md:text-[12px] font-medium whitespace-nowrap">
        FOLLOW OUR JOURNEY
      </span>
    </div>

    {/* Center */}
    <div className="flex justify-center">
      <h2 className="text-center text-[28px] md:text-[34px] lg:text-[44px] leading-none lg:whitespace-nowrap">
        <span className="font-medium text-[#281000]">
          From Concept to
        </span>{' '}
        <span className="font-extrabold text-[#281000]">
          Collection
        </span>
      </h2>
    </div>

    {/* Right */}
    <div className="flex justify-center lg:justify-end">
      <a
        href="https://instagram.com/dada_exports"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 group"
      >
        <Image
          src="/instagram-logo-vector-illustrati 2-2.png"
          alt="Instagram"
          width={32}
          height={32}
          className="w-8 h-8"
        />

        <div className="text-left">
          <p className="text-sm text-[#281000] group-hover:underline">
            Follow Us on
          </p>
          <p className="font-semibold text-black">
            @dada_exports
          </p>
        </div>
      </a>
    </div>

  </div>

  {/* Description */}
  <div className="mt-8">
  <p className="text-center text-[14px] md:text-[15px] lg:text-[16px] font-normal leading-[160%] text-[#0E0E0E] mx-auto whitespace-normal lg:whitespace-nowrap">
    New Collections, Behind-the-scenes, And Styling Inspiration
  </p>
</div>

</div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {videos.map((video, index) => (
            <div 
              key={index}
              className="group relative aspect-[4/5] bg-black rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <video
                src={video.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
                <div className="w-12 h-12 rounded-full border-2 border-white/80 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[14px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                </div>
              </div>

              {/* Text Overlay */}
              {video.overlay && (
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 text-black text-sm md:text-base font-medium px-5 py-3.5 rounded-2xl shadow">
                    {video.overlay}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConceptToCollection;