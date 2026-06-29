// src/components/b2b/ManufacturingProcess.tsx
import React from 'react';

const ManufacturingProcess = () => {
  const steps = [
    {
      number: "01",
      title: "Fabric Selection",
      desc: "Premium rayon, silk & cotton blends handpicked from trusted certified mills"
    },
    {
      number: "02",
      title: "Pattern & Marking",
      desc: "Precise measurements, pattern-making, and marking for zero-waste cutting"
    },
    {
      number: "03",
      title: "Fabric Cutting",
      desc: "Aligned print cutting with precision tools ensuring consistent sizing"
    },
    {
      number: "04",
      title: "Expert Stitching",
      desc: "Boutique-quality sewing by 200+ skilled artisans with 38 years of expertise"
    },
    {
      number: "05",
      title: "Finishing",
      desc: "Buttons, trims, edge finishing and detailing to export-ready standards"
    },
    {
      number: "06",
      title: "Quality Check",
      desc: "Multi-point international standard inspection before every dispatch"
    },
    {
      number: "07",
      title: "Pack & Ship",
      desc: "Professional packaging with pan-India and international export logistics"
    }
  ];

  return (
   <section
  className="w-full bg-[#FFFEF9]"
>
  <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">
        {/* Header */}
        {/* Header */}
<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-20 mb-16">

  {/* Left Side */}
  <div className="flex-shrink-0">
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px w-12 bg-[#95565E]"></div>
      <span className="text-[#95565E] uppercase tracking-[2px] text-[12px] font-medium whitespace-nowrap">
        MANUFACTURING PROCESS
      </span>
    </div>

    <h2 className="text-[30px] md:text-[40px] leading-none text-[#0E0E0E] whitespace-nowrap">
      <span className="font-normal">From Fabric to </span>
      <span className="font-black">Fashion</span>
    </h2>
  </div>

  {/* Right Side Description */}
  <div className="flex-1 lg:pl-12">
    <p className="text-[#0E0E0E] text-[14px] lg:text-[16px] leading-[160%] ">
      Every Dada Exports garment passes through 7 carefully managed stages ensuring export-grade quality at every step.
    </p>
  </div>

</div>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-[#E5D9C8] last:border-b-0 group"
            >
              {/* Step Number */}
              <div className="md:col-span-2 flex items-center">
                <span className="text-[#0E0E0E] font-mono text-sm tracking-widest">
                  Step {step.number}
                </span>
              </div>

              {/* Title */}
              <div className="md:col-span-4">
                <h3 className="text-xl md:text-1xl font-semibold text-[#95565E] transition-colors group-hover:text-[#8C5F3C]">
                  {step.title}
                </h3>
              </div>

              {/* Description */}
              <div className="md:col-span-6">
                <p className="text-[#0E0E0E] leading-relaxed text-[15px] md:text-base">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManufacturingProcess;