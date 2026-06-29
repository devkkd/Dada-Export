// src/components/b2b/ManufacturingProcess.tsx
import Image from 'next/image';
import React from 'react';

const ManufacturingProcess = () => {
const steps = [
  {
    number: '01',
    title: 'Fabric Selection',
    subtitle: 'Quality Begins Before The First Cut.',
    desc: 'We source only from trusted, certified mills selecting fabrics that meet our internal quality benchmarks for drape, breathability, colour fastness, and durability...',
  },
  {
    number: '02',
    title: 'Measurements & Pattern Marking',
    subtitle: 'Precision Is The Foundation Of A Great Fit.',
    desc: 'Our experienced pattern-makers draft and mark cutting guides for every style...',
  },
  {
    number: '03',
    title: 'Fabric Cutting',
    subtitle: 'Clean Edges. Aligned Prints. Zero Compromise.',
    desc: 'Using precision cutting tools, our skilled cutters follow the marked patterns...',
  },
  {
    number: '04',
    title: 'Expert Stitching',
    subtitle: 'Where craft becomes clothing.',
    desc: 'For 200+ skilled stitching professionals bring years of refined technique...',
  },
  {
    number: '05',
    title: 'Finishing',
    subtitle: 'Details That Separate Good From Exceptional.',
    desc: 'Finishing encompasses buttons, trims, edge stitching, lining and final attachment...',
  },
  {
    number: '06',
    title: 'Quality Check',
    subtitle: 'Every Garment Reviewed. No Exceptions.',
    desc: 'Before any garment leaves our floor, it passes through a multi-point quality inspection...',
  },
  {
    number: '07',
    title: 'Pack & Ship',
    subtitle: 'From Our Hands To Yours.',
    desc: 'Approved garments are professionally packed, folded, tagged and packed...',
  },
];

const capabilities = [
  'Full-cycle Garment Manufacturing From Fabric To Finished Product',
  '200+ Skilled Stitching And Finishing Professionals',
  'Print Alignment Expertise For Complex Patterns And Motifs',
  'Elastic, Smocking, And Bobbin Waistband Specialisation',
  'Adjustable Halter, Wrap, And Tie-up Construction',
  'Private Label And Custom Branding Capability',
  'Multi-size Grading From XS Through 6XL, As Per Customer Requirements',
];

  return (
  <section className="w-full bg-[#FFF7F2]">
  <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">      {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-[#281000] leading-tight">
            Crafted in 7 Steps, Built to Last a Lifetime
          </h2>
          <p className="text-black mt-3 text-lg">Our Manufacturing Process - 7-Step Garment Production</p>
          <p className="max-w-3xl mx-auto mt-6 text-gray-700 text-[15px] md:text-base leading-relaxed">
            Every Dada Exports garment begins its life as a carefully selected bolt of fabric and ends as a finished piece that meets international export standards.
          </p>
        </div>

        {/* Factory Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16">
          <Image 
            src="/b2b/process.png" 
            alt="Manufacturing Process" 
            width={1200} 
            height={600} 
            className="w-full h-auto object-cover" 
            priority
          />
         
        </div>

      <div className="mb-20">
  <h3
    className="text-[26px] md:text-[30px] font-semibold text-[#0E0E0E] mb-12"
    style={{ fontFamily: 'Mona Sans, sans-serif' }}
  >
    7-Step Detailed Descriptions
  </h3>

  <div>
    {steps.map((step, index) => (
      <div
        key={index}
        className="grid grid-cols-1 lg:grid-cols-[90px_320px_1fr] gap-6 lg:gap-10 py-8 border-b border-[#D8CCCC]"
      >
        {/* Step Number */}
        <div>
          <p
            className="text-[12px] text-[#4A4A4A]"
            style={{ fontFamily: 'Mona Sans, sans-serif' }}
          >
            Step {step.number}
          </p>
        </div>

        {/* Title + Subtitle */}
        <div>
          <h4
            className="text-[18px] md:text-[20px] font-semibold text-[#281000] mb-2"
            style={{ fontFamily: 'Mona Sans, sans-serif' }}
          >
            {step.title}
          </h4>

          <p
            className="text-[13px] md:text-[14px] text-[#555555]"
            style={{ fontFamily: 'Mona Sans, sans-serif' }}
          >
            {step.subtitle}
          </p>
        </div>

        {/* Description */}
        <div>
          <p
            className="text-[13px] md:text-[14px] leading-[1.8] text-[#444444]"
            style={{ fontFamily: 'Mona Sans, sans-serif' }}
          >
            {step.desc}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

       <div className="text-center mt-20">
  <h3
    className="text-[26px] md:text-[30px] font-medium text-[#281000] mb-12"
    style={{ fontFamily: 'Mona Sans, sans-serif' }}
  >
    In-House Capabilities
  </h3>

  {/* Row 1 */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    {capabilities.slice(0, 4).map((cap, index) => (
      <div
        key={index}
        className={`${
  index % 2 === 0 ? 'bg-[#F9F4E1]' : 'bg-white'
} px-6 py-5 flex items-center justify-center min-h-[90px]`}
      >
        <p
          className="text-[13px] md:text-[14px] text-[#3C2F2F] leading-relaxed text-center"
          style={{ fontFamily: 'Mona Sans, sans-serif' }}
        >
          {cap}
        </p>
      </div>
    ))}
  </div>

 {/* Row 2 */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:w-[75%] mx-auto">
  {capabilities.slice(4, 7).map((cap, index) => (
    <div
      key={index}
      className={`${
        index % 2 === 0 ? 'bg-[#F9F4E1]' : 'bg-white'
      } px-6 py-5 flex items-center justify-center min-h-[90px]`}
    >
      <p
        className="text-[13px] md:text-[14px] text-[#3C2F2F] leading-relaxed text-center"
        style={{ fontFamily: 'Mona Sans, sans-serif' }}
      >
        {cap}
      </p>
    </div>
  ))}
</div>
</div>
      </div>
    </section>
  );
};

export default ManufacturingProcess;