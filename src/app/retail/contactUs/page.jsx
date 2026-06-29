'use client';

import Image from 'next/image';
import React from 'react';

const ContactPage = () => {
  return (
   <section className="w-full bg-[#FFF7F2]">
<div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-[#281000] text-4xl font-medium tracking-tight mb-4" 
            style={{ fontFamily: 'Mona Sans, sans-serif' }}
          >
            Let&apos;s Work Together
          </h1>
          
          <p className="text-[#0E0E0E] text-xl font-medium mb-4">
            Contact Dada Exports – B2B Enquiries, Wholesale &amp; Retail | Pushkar, India
          </p>
          
          <p className="text-[#0E0E0E] max-w-4xl mx-auto text-[16px] leading-relaxed">
            Whether you&apos;re a wholesale buyer looking to source export-quality garments, or a retail customer with a question about an order we&apos;re here. 
            Our team responds within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Side - Contact Info */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h3 className="text-black  text-3sm tracking-widest font-medium mb-2">Address</h3>
              <p className="text-[#0E0E0E] text-lg">
                Pushkar, Rajasthan, India<br />
                Manufacturing hub since 1985
              </p>
            </div>

            <div>
              <h3 className="text-[#0E0E0E]  text-3sm tracking-widest font-medium  mb-2">Phone / WhatsApp</h3>
              <p className="text-[#0E0E0E] text-lg">+91 XXXXX XXXXX</p>
              <p className="text-[#0E0E0E] text-lg mt-1">Mon - Sat • 10am - 7pm IST</p>
            </div>

            <div>
              <h3 className="text-[#0E0E0E]  text-3sm tracking-widest font-medium  mb-2">Email</h3>
              <p className="text-[#0E0E0E] text-lg">info@dadaexports.com</p>
              <p className="text-[#0E0E0E] text-lg mt-1">Response within 24 hours</p>
            </div>

            <div>
              <h3 className="text-[#0E0E0E]  text-3sm tracking-widest font-medium mb-2">Business Hours</h3>
              <p className="text-[#0E0E0E] text-3sm">
                Monday - Saturday : 10:00am - 7:00pm IST<br />
                Closed Sundays &amp; public holidays
              </p>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#F9F4E1] rounded-3xl p-10 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                We&apos;d Love to Hear From You
              </h2>
              <p className="text-[#0E0E0E] mb-8">Every Conversation Starts Here</p>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#0E0E0E] mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                     className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#281000] outline-none bg-white placeholder:text-[#281000]/40"
                    />
                  </div>
               <div>
  <label
    className="block text-[15px] md:text-[16px] text-[#0E0E0E] mb-3 font-medium"
    style={{ fontFamily: 'Mona Sans, sans-serif' }}
  >
    Business Type
  </label>

  <div className="relative">
    <select
      defaultValue=""
      className="w-full h-[64px] px-6 pr-14 rounded-[24px] border border-[#BFAFB2] bg-white text-[#0E0E0E] text-[16px] outline-none appearance-none focus:border-[#95565E]"
      style={{ fontFamily: 'Mona Sans, sans-serif' }}
    >
      <option value="" disabled>
        Select Business Type
      </option>
      <option>Wholesale Buyer</option>
      <option>Retailer</option>
      <option>Boutique</option>
      <option>Exporter</option>
    </select>

    {/* Custom Arrow */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-black pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 9l6 6 6-6"
      />
    </svg>
  </div>
</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#0E0E0E] mb-2">Designation / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Owner, Buyer, Manager"
                      className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#281000] outline-none bg-white placeholder:text-[#281000]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#0E0E0E] mb-2">City / State</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, Maharashtra"
                       className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#281000] outline-none bg-white placeholder:text-[#281000]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#0E0E0E] mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                     className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#281000] outline-none bg-white placeholder:text-[#281000]/40"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#0E0E0E] mb-2">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 or your country code"
                     className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#281000] outline-none bg-white placeholder:text-[#281000]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#0E0E0E] mb-2 ">Your Message</label>
                    <textarea
                      rows={4}
                      placeholder="Write your message here – the more detail you share, the better we can help."
                      className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#281000] outline-none bg-white resize-y  placeholder:text-[#281000]/40"
                    />
                  </div>
                </div>

             <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 pt-4">
  
  <button
    type="submit"
    className="bg-[#281000] hover:bg-[#281000] text-white h-[52px] px-8 md:px-10 rounded-full font-medium text-sm flex items-center justify-center transition-all duration-300 shrink-0"
  >
    Send Message →
  </button>

  <p
    className="text-[14px] leading-[1.8] text-[#281000]  lg:text-left max-w-[420px]"
    style={{ fontFamily: 'Mona Sans, sans-serif' }}
  >
    We respond within 24 hours on working days. For urgent queries,
    reach us directly on WhatsApp.
  </p>

</div>

                
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
      {/* Location Section */}
<div className="mt-24 md:mt-32">
  <div className="grid lg:grid-cols-12 gap-12 items-start">

    {/* Left Content */}
  <div className="lg:col-span-5 pt-2">
      <h2
        className="text-[24px] md:text-[28px] font-semibold text-[#0E0E0E] mb-6"
        style={{ fontFamily: 'Mona Sans, sans-serif' }}
      >
        Find Us Pushkar, Rajasthan, India
      </h2>

      <p
        className="text-[14px] md:text-[16px] leading-[1.8] text-[#2E2E2E] max-w-[520px]"
        style={{ fontFamily: 'Mona Sans, sans-serif' }}
      >
        Our Manufacturing Facility Is Located In Pushkar,
        Rajasthan The Heart Of India's Textile Heritage.
      </p>
    </div>

    {/* Right Map */}
    <div className="lg:col-span-7 rounded-3xl overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3555.123456789!2d74.555!3d26.49!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396be5c5e5c5e5c5%3A0x1234567890abcdef!2sPushkar%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1720000000000"
        className="w-full h-[300px] md:h-[380px] lg:h-[420px]"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>

  </div>
</div>
      </div>
       </section>
  );
};

export default ContactPage;