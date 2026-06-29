'use client';


import Image from 'next/image';
import React from 'react';

const DadaStory = () => {
    return (
        <div className="min-h-screen bg-[#FFF7F2] font-sans">
            {/* Main Container */}
           <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">

                {/* Top Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-[#281000] text-4xl font-medium tracking-tight mb-4" style={{ fontFamily: 'Mona Sans, sans-serif' }}>
                        The Story Behind Every Stitch
                    </h1>

                    <p className="text-black text-xl font-medium mb-6">
                        About Dada Exports - 38 Years of Garment Craftsmanship from Pushkar
                    </p>

                    <p
                        className="text-gray-700 max-w-5xl mx-auto text-[14px] md:text-[15px] lg:text-[16px] leading-relaxed text-center"
                        style={{ fontFamily: 'Mona Sans, sans-serif' }}
                    >
                        <span className="block">
                            Every garment tells a story. Ours begins in 1985, in a modest home in Pushkar, Rajasthan - where Shri Ramnivas Rankawat began stitching with
                        </span>

                        <span className="block mt-1">
                            a single machine and an unwavering belief that quality craftsmanship should speak for itself.
                        </span>
                    </p>
                </div>

                {/* Shop Image */}
                <div className="relative mb-16 rounded-xl overflow-hidden shadow-xl">
                    <Image
                        src="/b2b/1.png"
                        alt="Dada Exports Shop Interior"
                        width={1200}
                        height={650}
                        className="w-full h-auto object-cover"
                        priority
                    />


                </div>
                {/* Our Legacy & Story */}
                <div className="mb-24">
                    <h2
                        className="text-[#281000] text-[26px] md:text-[30px] lg:text-[34px] font-semibold mb-10 md:mb-12"
                        style={{ fontFamily: 'Mona Sans, sans-serif' }}
                    >
                        Our Legacy & Story
                    </h2>

                    <div className="relative">

                        {/* Continuous Vertical Line */}
                        <div className="hidden lg:block absolute left-[110px] top-0 bottom-0 w-px bg-[#D8C9CB]" />

                        {[
                            {
                                year: '1985',
                                title: 'THE BEGINNING',
                                desc: (
                                    <>
                                        In a small house in Pushkar, with nothing but skill, dedication, and a vision for quality, Shri Ramnivas Rankawat began tailoring garments from home.
                                        <br /><br />
                                        His work quickly earned a reputation - not through advertising, but through the quiet word-of-mouth that only genuine quality inspires.
                                        <br /><br />
                                        Neighbours, families, and eventually merchants began trusting his needle and thread.
                                    </>
                                ),
                            },
                            {
                                year: '1992',
                                title: 'THE SHOP',
                                desc: (
                                    <>
                                        By 1992, what started as a home endeavour had grown into a proper establishment.
                                        Rankawat Tailor Shop opened its doors in Pushkar where fabric selection, precise cutting, expert stitching, and meticulous finishing came together under one roof.
                                        <br /><br />
                                        Over the next three decades, the shop served hundreds of customers, refined its techniques, and built a reputation that stretched far beyond Rajasthan.
                                    </>
                                ),
                            },
                            {
                                year: '2023',
                                title: 'THE VISION',
                                desc: (
                                    <>
                                        In 2023, the next generation stepped forward. Dada Exports was born not to replace what came before, but to expand it.
                                        The vision was clear: take 38 years of garment expertise and make it accessible.
                                        <br /><br />
                                        Not just to international retailers, not just to luxury boutiques but to Indian buyers and global markets alike who deserve export-quality garments at honest, transparent prices.
                                    </>
                                ),
                            },
                            {
                                year: '2026',
                                title: 'THE PHILOSOPHY',
                                desc: (
                                    <>
                                        We don't believe that good clothing should only be available in international markets or premium brands.
                                        We believe in the inherent value of the Indian garment industry in the skilled hands of our 200+ professionals.
                                        <br /><br />
                                        At Dada Exports, every garment is a direct line from our factory to your wardrobe or your store without the middlemen, without the markups, without compromise.
                                    </>
                                ),
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 lg:grid-cols-[110px_280px_1fr] gap-5 md:gap-8 lg:gap-12 py-8 md:py-10 border-b border-[#D8C9CB]"
                            >
                                {/* Year */}
                                <div>
                                    <h3
                                        className="text-[24px] md:text-[28px] lg:text-[30px] font-medium text-[#0E0E0E]"
                                        style={{ fontFamily: 'Mona Sans, sans-serif' }}
                                    >
                                        {item.year}
                                    </h3>
                                </div>

                                {/* Title */}
                                <div className="lg:pl-6">
                                    <h4
                                        className="text-[20px] md:text-[24px] lg:text-[28px] font-semibold text-[#0E0E0E] whitespace-nowrap"
                                        style={{ fontFamily: 'Mona Sans, sans-serif' }}
                                    >
                                        {item.title}
                                    </h4>
                                </div>

                                {/* Description */}
                                <div>
                                    <p
                                        className="text-[13px] md:text-[14px] lg:text-[15px] leading-[1.9] text-[#2E2E2E]"
                                        style={{ fontFamily: 'Mona Sans, sans-serif' }}
                                    >
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quote Box */}
                <div className="bg-[#F9F4E1] rounded-2xl px-6 md:px-12 lg:px-16 py-10 md:py-14 mb-20 text-center border border-[#95565E]/10">

                    <p
                        className="max-w-5xl mx-auto text-[#281000] text-[20px] md:text-[22px] lg:text-[26px] leading-[160%] italic"
                        style={{
                            fontFamily: 'Playfair Display, serif',
                            fontWeight: 0,
                        }}
                    >
                        "The Foundation Was Laid By My Father's Hands. Dada Exports Carries
                        Forward His Legacy The Belief That Honest Work, Quality Craft, And
                        Fair Dealing Are The Only Way To Build Something That Lasts."
                    </p>

                    <p
                        className="mt-8 md:mt-10 text-[#281000] text-[17px] md:text-[20px] font-medium italic"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        Himanshu Rankawat - Founder, Dada Exports
                    </p>

                </div>

                {/* Mission Vision Values */}
                <div className="py-10 md:py-16">
                    <h2
                        className="text-[#281000] text-[28px] md:text-[34px] font-medium text-center mb-10 md:mb-16"
                        style={{ fontFamily: 'Mona Sans, sans-serif' }}
                    >
                        Our Mission, Vision & Values
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3">

                        {/* Mission */}
                        <div className="px-6 md:px-10 py-6 text-center md:border-r border-[#D8C9CB]">
                            <h3
                                className="text-[#0E0E0E] text-[20px] md:text-[26px] font-medium mb-6"
                                style={{ fontFamily: 'Mona Sans, sans-serif' }}
                            >
                                MISSION
                            </h3>

                            <p
                                className="text-[#2E2E2E] text-[13px] md:text-[15px] leading-[1.8]"
                                style={{ fontFamily: 'Mona Sans, sans-serif' }}
                            >
                                Deliver Export-grade Garments To
                                <strong> Indian Buyers </strong>
                                And
                                <strong> Global Markets </strong>
                                At Honest, Transparent Prices Making Premium Quality Accessible For All.
                            </p>
                        </div>

                        {/* Values */}
                        <div className="px-6 md:px-10 py-6 text-center md:border-r border-[#D8C9CB]">
                            <h3
                                className="text-[#0E0E0E] text-[20px] md:text-[26px] font-medium mb-6"
                                style={{ fontFamily: 'Mona Sans, sans-serif' }}
                            >
                                OUR VALUES
                            </h3>

                            <ul
                                className="space-y-2 text-[#2E2E2E] text-[13px] md:text-[15px] leading-[1.3]"
                                style={{ fontFamily: 'Mona Sans, sans-serif' }}
                            >
                                <li>• Quality Without Compromise</li>
                                <li>• Honest, Transparent Pricing</li>
                                <li>• Family Legacy And Responsibility</li>
                                <li>• Respect For Every Craftsperson</li>
                                <li>• Sustainability In Fabric & Process</li>
                                <li>• Creating Long-term Partnerships Built On Trust And Family Values</li>
                            </ul>
                        </div>

                        {/* Vision */}
                        <div className="px-6 md:px-10 py-6 text-center">
                            <h3
                                className="text-[#0E0E0E] text-[20px] md:text-[26px] font-medium mb-6"
                                style={{ fontFamily: 'Mona Sans, sans-serif' }}
                            >
                                VISION
                            </h3>

                            <p
                                className="text-[#2E2E2E] text-[13px] md:text-[15px] leading-[1.8]"
                                style={{ fontFamily: 'Mona Sans, sans-serif' }}
                            >
                                To Become India's Most Trusted Garment Manufacturer And Exporter
                                Known Globally For Craftsmanship, Integrity, And The Pushkar
                                Heritage Of Textile Excellence.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
            

        </div>
    );
};

export default DadaStory;