'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import WhyChooseDadaExports from '@/components/b2b/WhyChooseDadaExports';
export default function B2BEnquiry() {
    const [formData, setFormData] = useState({
        fullName: '',
        designation: '',
        email: '',
        whatsapp: '',
        companyName: '',
        businessType: '',
        country: '',
        city: '',
        quantity: '',
        productStyle: '',
        message: '',
    });

    const [productInfo, setProductInfo] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Get product from query params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const productSlug = params.get('product');
        const selectedColor = params.get('color');
        const selectedSize = params.get('size');

        // Mock product data (replace with real fetch if needed)
        if (productSlug) {
            setProductInfo({
                title: 'Women Olive Floral Adjustable Halter Neck Maxi Dress',
                subtitle: 'Tie-Up Drawstring Flowy A-Line Summer Dress',
                image: '/b2b/NewArrivals/1.png',
                color: selectedColor || '#95565E',
                size: selectedSize || 'Free Size',
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        console.log('Form submitted:', formData);
        // Here you can integrate with backend or email service
        setTimeout(() => {
            setSubmitted(false);
            setFormData({
                fullName: '',
                designation: '',
                email: '',
                whatsapp: '',
                companyName: '',
                businessType: '',
                country: '',
                city: '',
                quantity: '',
                productStyle: '',
                message: '',
            });
        }, 3000);
    };

    const businessTypeOptions = [
        'Boutique',
        'Retail Chain',
        'E-commerce',
        'Wholesale Distributor',
        'International Importer / Exporter',
        'Fashion Brand / Private Label',
        'Amazon / Meesho / Flipkart Seller',
        'Stylist / Personal Shopper',
    ];

    const countryOptions = [
        'India',
        'USA',
        'UAE',
        'UK',
        'Canada',
        'Australia',
        'Europe',
        'Others',
    ];

   return (
  <section className="w-full bg-[#FFFEF9] min-h-screen">
    <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">
                {/* Product Info Header */}
                {productInfo && (
                    <div className="bg-[#F9F4E1] rounded-3xl p-6 md:p-8 mb-12 md:mb-16">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
                            {/* Product Image */}
                            <div className="w-40 h-52 relative rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                                <Image
                                    src={productInfo.image}
                                    alt={productInfo.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-semibold text-[#0E0E0E] leading-tight mb-3">
                                    {productInfo.title}
                                </h1>
                                <p className="text-sm md:text-base text-[#3C2F2F] mb-4">
                                    {productInfo.subtitle}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded-full shadow-md border-2 border-white"
                                            style={{ backgroundColor: productInfo.color }}
                                        />
                                        <span className="text-sm font-medium text-[#0E0E0E]">Color Selected</span>
                                    </div>
                                    <span className="text-sm font-medium text-[#0E0E0E]">{productInfo.size}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Partner With Us Section */}
                <div className="text-center mb-12 md:mb-14">
                    <h2 className="text-3xl md:text-5xl font-medium text-[#95565E] mb-3" style={{ fontFamily: 'Mona Sans, sans-serif' }}>
                        Partner With Us
                    </h2>
                    <p className="text-lg md:text-xl font-medium text-[#0E0E0E] mb-6">
                        Start Your Wholesale Journey
                    </p>
                    <p className="max-w-4xl mx-auto text-sm md:text-base text-[#3C2F2F] leading-relaxed mb-8">
                        We work directly with boutique owners, retail chains, e-commerce sellers, and international importers across 15+ countries.
                        Tell us what you need we will respond within 24 business hours with pricing, availability, and production timelines.
                    </p>

                    {/* Benefits / Features */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                            <span className="text-[#95565E] text-lg">◆</span>
                            <span className="text-[#95565E]">Factory Direct</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#95565E] text-lg">◆</span>
                            <span className="text-[#95565E]">Low MOQ</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#95565E] text-lg">◆</span>
                            <span className="text-[#95565E]">Custom Orders Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#95565E] text-lg">◆</span>
                            <span className="text-[#95565E]">Export-Ready Documentation</span>
                        </div>
                    </div>
                </div>

                {/* Enquiry Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-12">

                    {/* Your Details Column */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-[#0E0E0E] pb-4 ">
                            Your Details
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-[#0E0E0E] mb-3">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-2xl border border-[#D4C4B8] focus:border-[#95565E] outline-none text-sm bg-white text-[#0E0E0E] placeholder-[#A89899] transition-all"
                                placeholder="Your full name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0E0E0E] mb-3">
                                Designation / Role
                            </label>
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-2xl border border-[#D4C4B8] focus:border-[#95565E] outline-none text-sm bg-white text-[#0E0E0E] placeholder-[#A89899] transition-all"
                                placeholder="e.g. Owner, Buyer, Manager"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0E0E0E] mb-3">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-2xl border border-[#D4C4B8] focus:border-[#95565E] outline-none text-sm bg-white text-[#0E0E0E] placeholder-[#A89899] transition-all"
                                placeholder="business@yourcompany.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0E0E0E] mb-3">
                                WhatsApp / Phone
                            </label>
                            <input
                                type="tel"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-2xl border border-[#D4C4B8] focus:border-[#95565E] outline-none text-sm bg-white text-[#0E0E0E] placeholder-[#A89899] transition-all"
                                placeholder="+91 or your country code"
                                required
                            />
                        </div>
                    </div>

                    {/* Your Business Column */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-[#0E0E0E] pb-4 ">
                            Your Business
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-[#0E0E0E] mb-3">
                                Company / Shop Name
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-2xl border border-[#D4C4B8] focus:border-[#95565E] outline-none text-sm bg-white text-[#0E0E0E] placeholder-[#A89899] transition-all"
                                placeholder="Your business or store name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0E0E0E] mb-3">
                                Business Type
                            </label>
                            <select
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-2xl border border-[#D4C4B8] focus:border-[#95565E] outline-none text-sm bg-white text-[#0E0E0E] transition-all appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2395565E' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 1rem center',
                                    paddingRight: '2.5rem'
                                }}
                            >
                                <option value="">Select Business Type</option>
                                {businessTypeOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0E0E0E] mb-3">
                                Country
                            </label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-2xl border border-[#D4C4B8] focus:border-[#95565E] outline-none text-sm bg-white text-[#0E0E0E] transition-all appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2395565E' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 1rem center',
                                    paddingRight: '2.5rem'
                                }}
                            >
                                <option value="">Select Your Country</option>
                                {countryOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0E0E0E] mb-3">
                                City / State
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-2xl border border-[#D4C4B8] focus:border-[#95565E] outline-none text-sm bg-white text-[#0E0E0E] placeholder-[#A89899] transition-all"
                                placeholder="e.g. Mumbai, Maharashtra"
                            />
                        </div>
                    </div>

                    {/* Your Order Requirements Column */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-[#0E0E0E] pb-4 ">
                            Your Order Requirements
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-[#0E0E0E] mb-3">
                                Estimated Quantity Required
                            </label>
                            <input
                                type="text"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-2xl border border-[#D4C4B8] focus:border-[#95565E] outline-none text-sm bg-white text-[#0E0E0E] placeholder-[#A89899] transition-all"
                                placeholder="e.g. 50 pieces per style"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0E0E0E] mb-3">
                                Specific Product / Style
                            </label>
                            <input
                                type="text"
                                name="productStyle"
                                value={formData.productStyle}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-2xl border border-[#D4C4B8] focus:border-[#95565E] outline-none text-sm bg-white text-[#0E0E0E] placeholder-[#A89899] transition-all"
                                placeholder="e.g. Zebra Print Rayon Co-ord, Kasturi Silk Tie-Top"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0E0E0E] mb-3">
                                Your Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-5 py-4 rounded-3xl border border-[#D4C4B8] focus:border-[#95565E] outline-none text-sm bg-white text-[#0E0E0E] placeholder-[#A89899] transition-all resize-none"
                                placeholder="Tell us about your requirements – products you are interested in, order quantities, delivery timeline, target market, or anything else we should know..."
                            />
                        </div>
                    </div>
                </form>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-8 md:px-10 py-4 bg-[#95565E] text-white rounded-full font-semibold hover:bg-[#7a3f47] transition-all duration-300 text-base md:text-lg"
                    >
                        {submitted ? '✓ Submitted Successfully!' : 'Submit B2B Enquiry'}
                    </button>

                    <a
                        href="https://wa.me/919876543210?text=Hi%20Dada%20Exports%2C%20I%27m%20interested%20in%20wholesale%20opportunities"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 md:px-10 py-4 bg-[#25D366] text-white rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-[#20ba5c] transition-all duration-300 text-base md:text-lg"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            className="w-6 h-6 flex-shrink-0"
                            fill="currentColor"
                        >
                            <path d="M16.04 3C8.84 3 3 8.74 3 15.82c0 2.5.73 4.93 2.1 7L3.75 29l6.4-1.67a13.15 13.15 0 005.89 1.4c7.2 0 13.04-5.74 13.04-12.82C29.08 8.74 23.24 3 16.04 3zm7.58 18.1c-.32.89-1.88 1.7-2.6 1.81-.67.1-1.52.15-2.45-.15-.57-.18-1.31-.42-2.26-.83-3.97-1.72-6.56-5.73-6.76-6-.19-.27-1.61-2.11-1.61-4.02 0-1.91.99-2.84 1.34-3.23.35-.39.76-.49 1.02-.49.25 0 .51 0 .73.01.24.01.56-.09.87.65.32.77 1.08 2.66 1.18 2.86.1.2.16.43.03.7-.13.27-.19.43-.38.66-.19.23-.4.51-.57.69-.19.19-.39.4-.17.79.22.39.98 1.61 2.1 2.61 1.45 1.29 2.67 1.69 3.05 1.88.38.19.6.16.82-.1.22-.26.95-1.1 1.2-1.48.25-.38.51-.32.86-.19.35.13 2.24 1.05 2.62 1.24.38.19.63.29.73.45.09.16.09.95-.23 1.84z" />
                        </svg>
                        <span>Enquiry On WhatsApp</span>
                    </a>
                </div>

                {/* Footer Text */}
               <p className="text-center text-xs md:text-sm text-[#95565E] font-medium mb-20">
                    We respond within 24 business hours. For urgent enquiries, reach us directly on WhatsApp.
                </p>
            </div>
            <WhyChooseDadaExports />
      
        </section>
    );
}