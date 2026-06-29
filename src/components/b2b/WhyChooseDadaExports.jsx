import React from 'react';
import Image from 'next/image';

const DadaDifferenceFeatures = () => {
    const features = [
        {
            id: 1,
            title: 'Export-Grade Fabric',
            description: 'Handpicked premium rayon, kasturi silk & cotton blends - same as our international export orders.',
            icon: '/b2b/home/15.png', // Replace with actual icon path
        },
        {
            id: 2,
            title: 'Precision Stitching',
            description: 'Boutique-quality finishing by 200+ skilled artisans inspected to international standards.',
            icon: '/b2b/home/16.png', // Replace with actual icon path
        },
        {
            id: 3,
            title: 'Honest B2B Pricing',
            description: 'Factory direct - no middlemen, no inflated markups. Real value at transparent wholesale pricing.',
            icon: '/b2b/home/17.png', // Replace with actual icon path
        },
        {
            id: 4,
            title: '38 Years of Legacy',
            description: 'Three decades of garment expertise from the Hankawat family passed through every thread.',
            icon: '/b2b/home/18.png', // Replace with actual icon path
        },
        {
            id: 5,
            title: 'Global Export Ready',
            description: 'Serving Europe, USA, Canada, Australia full export documentation and logistics support.',
            icon: '/b2b/home/19.png', // Replace with actual icon path
        },
        {
            id: 6,
            title: 'Low MOQ & Custom',
            description: 'Flexible minimum order quantities with custom design, private label & colour variant options.',
            icon: '/b2b/home/20.png', // Replace with actual icon path
        },
    ];

    return (
       <section
  className="w-full bg-[#FFFEF9]"
  style={{ fontFamily: 'Mona Sans, sans-serif' }}
>
    <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">
                <div className="mb-12 md:mb-16 lg:mb-20">

                    <div className="relative flex flex-col lg:flex-row items-center lg:items-center justify-center">

                        {/* Left Label */}
                        <div className="lg:absolute lg:left-0 flex items-center gap-3 mb-6 lg:mb-0">
                            <div className="h-px w-12 bg-[#8C5F3C]" />
                            <span className="text-[#8C5F3C] uppercase tracking-[3px] text-[11px] md:text-[12px] font-medium whitespace-nowrap">
                                THE DADA DIFFERENCE
                            </span>
                        </div>

                        {/* Center Heading */}
                        <h2 className="text-center text-[28px] md:text-[30px] lg:text-[44px] leading-none whitespace-nowrap">
                            <span className="font-medium text-[#95565E]">
                                Why Choose,
                            </span>{' '}
                            <span className="font-extrabold text-[#95565E]">
                                Dada Exports
                            </span>
                        </h2>

                    </div>
                    <div className="h-8"></div>
                    {/* Description */}
                    <p className="text-center text-[16px] font-normal leading-[160%] text-[#0E0E0E] max-w-6xl mx-auto lg:whitespace-nowrap">
                        We believe premium quality and honest pricing can coexist. Our 38-year legacy ensures every piece meets international export standards - with the care of a family business behind it.
                    </p>

                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 ">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className={`p-6 md:p-8 lg:p-10 flex flex-col items-center text-center ${index < 3
                                    ? 'border-b border-[#D4C4B8]'
                                    : ''
                                } ${(index + 1) % 3 !== 0 && index < features.length - 1
    ? 'lg:border-r lg:border-[#D4C4B8]'
    : ''
} ${index < 3 && index !== 2
                                    ? 'lg:border-r lg:border-[#D4C4B8]'
                                    : ''
                                } ${index >= 3
                                    ? 'border-t border-[#D4C4B8]'
                                    : ''
                                }`}
                        >
                            {/* Icon */}
                            <div className="mb-6 md:mb-8 h-12 md:h-14 lg:h-16 w-12 md:w-14 lg:w-16 relative flex items-center justify-center">
                                <Image
                                    src={feature.icon}
                                    alt={feature.title}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </div>

                            {/* Title */}
                            <h3 className="text-lg md:text-xl lg:text-2xl font-medium text-[#0E0E0E] mb-3 md:mb-4 leading-tight">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[14px] font-normal leading-[160%] text-[#0E0E0E]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DadaDifferenceFeatures;