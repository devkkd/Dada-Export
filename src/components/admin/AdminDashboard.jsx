'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';

const STATS_CONFIG = [
  { key: 'b2bProducts',    label: 'B2B Products',    color: 'text-rose-700',   ring: 'ring-rose-200'   },
  { key: 'newInquiries',   label: 'New Inquiries',   color: 'text-amber-700',  ring: 'ring-amber-200'  },
  { key: 'retailProducts', label: 'Retail Products', color: 'text-blue-700',   ring: 'ring-blue-200'   },
  { key: 'retailOrders',   label: 'Retail Orders',   color: 'text-green-700',  ring: 'ring-green-200'  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    b2bProducts: null,
    newInquiries: null,
    retailProducts: null,
    retailOrders: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard-stats');
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminShell title="Dashboard">

      {/* Welcome */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Welcome back 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Here's an overview of your Dada Exports platform.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8 sm:mb-10">
        {STATS_CONFIG.map((stat) => (
          <div key={stat.label} className={`bg-white rounded-2xl p-4 sm:p-6 ring-1 ${stat.ring} shadow-sm`}>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</p>
            <p className={`text-2xl sm:text-3xl font-bold mt-2 ${stat.color}`}>
              {loading ? '...' : (stats[stat.key] !== null ? stats[stat.key] : '—')}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base font-semibold text-[#1a1a1a] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {[
            { label: 'Manage Categories',  href: '/admin/categories',         color: 'bg-violet-600' },
            { label: 'Add B2B Product',    href: '/admin/b2b/products/new',    color: 'bg-rose-600'   },
            { label: 'Add Retail Product', href: '/admin/retail/products/new', color: 'bg-blue-600'   },
            { label: 'View Inquiries',     href: '/admin/b2b/inquiries',       color: 'bg-amber-600'  },
            { label: 'View Orders',        href: '/admin/retail/orders',       color: 'bg-green-600'  },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`${action.color} text-white text-sm font-semibold rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between group hover:opacity-90 transition-opacity shadow-sm`}
            >
              {action.label}
              <svg className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Categories */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 ring-1 ring-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1a1a1a]">Categories</h3>
            <span className="text-xs bg-violet-50 text-violet-700 font-medium px-2.5 py-1 rounded-full">Shared</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex justify-between items-center">
              <span>All Categories</span>
              <Link href="/admin/categories" className="text-[#95565E] font-medium hover:underline">Manage →</Link>
            </li>
            <li className="flex justify-between items-center">
              <span>Add New</span>
              <Link href="/admin/categories" className="text-[#95565E] font-medium hover:underline">Create →</Link>
            </li>
          </ul>
        </div>

        {/* B2B */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 ring-1 ring-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1a1a1a]">B2B — Wholesale</h3>
            <span className="text-xs bg-rose-50 text-rose-700 font-medium px-2.5 py-1 rounded-full">B2B</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex justify-between items-center">
              <span>Manage Products</span>
              <Link href="/admin/b2b/products" className="text-[#95565E] font-medium hover:underline">View →</Link>
            </li>
            <li className="flex justify-between items-center">
              <span>Bulk Inquiries</span>
              <Link href="/admin/b2b/inquiries" className="text-[#95565E] font-medium hover:underline">View →</Link>
            </li>
          </ul>
        </div>

        {/* Retail */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 ring-1 ring-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1a1a1a]">Retail — E-commerce</h3>
            <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-full">Retail</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex justify-between items-center">
              <span>Manage Products</span>
              <Link href="/admin/retail/products" className="text-[#95565E] font-medium hover:underline">View →</Link>
            </li>
            <li className="flex justify-between items-center">
              <span>Customer Orders</span>
              <Link href="/admin/retail/orders" className="text-[#95565E] font-medium hover:underline">View →</Link>
            </li>
          </ul>
        </div>

      </div>
    </AdminShell>
  );
}
