// components/retail/LoginModel.jsx
'use client';

import React, { useState, useEffect } from 'react';

export default function LoginModel({ isOpen, onClose }) {
  const [phone, setPhone] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const CORRECT_NUMBER = '9999999999';

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  // Auto login jab correct number type ho
  useEffect(() => {
    if (phone === CORRECT_NUMBER) {
      handleAutoLogin();
    }
  }, [phone]);

  const handleAutoLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      localStorage.setItem('isLoggedIn', 'true');
      onClose();
      setTimeout(() => {
        window.location.href = '/retail/account';
      }, 400);
    }, 800);
  };

  const handleManualLogin = () => {
    if (phone === CORRECT_NUMBER) {
      handleAutoLogin();
    } else {
      alert("Please enter 9999999999");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    onClose();
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-[380px] overflow-hidden shadow-2xl relative">
        
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-3xl text-gray-400 hover:text-black z-10"
        >
          ×
        </button>

        <div className="p-10 text-center">
          <h2 
            className="text-4xl font-medium mb-10 tracking-tight" 
            style={{ fontFamily: 'Mona Sans, sans-serif' }}
          >
            ivara
          </h2>

          {isLoggedIn ? (
            <div className="py-8">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">✓</span>
              </div>
              <p className="text-xl font-medium text-green-600 mb-2">Login Successful</p>
              <p className="text-gray-600 mb-8">Welcome back!</p>
              
              <button
                onClick={handleLogout}
                className="w-full border border-red-500 text-red-600 py-4 rounded-2xl font-medium hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center border-2 border-gray-200 rounded-2xl overflow-hidden focus-within:border-[#281000]">
                  <div className="bg-[#281000] text-white px-5 py-4 font-medium">+91</div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    className="flex-1 px-5 py-4 outline-none text-lg font-medium bg-transparent"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">Try: <strong>9999999999</strong></p>
              </div>

              <button
                onClick={handleManualLogin}
                disabled={isLoggingIn || phone.length < 10}
                className="w-full bg-[#281000] hover:bg-black text-white py-4 rounded-2xl font-medium text-lg transition-all disabled:opacity-50"
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </button>

              <p className="text-xs text-gray-500 mt-6">
                By continuing, you are agreeing to our T&amp;C and Privacy Policy
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}