'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobile, setMobile] = useState('');

  const [activeTab, setActiveTab] = useState('account');

  const [addresses, setAddresses] = useState([]);
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    mobile: '',
    altMobile: '',
  });

  useEffect(() => {
    const savedAddresses =
      JSON.parse(localStorage.getItem('addresses')) || [];

    setAddresses(savedAddresses);

    const logged =
      localStorage.getItem('accountLogin');

    if (logged === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    if (mobile === '9999999999') {
      setIsLoggedIn(true);

      localStorage.setItem(
        'accountLogin',
        'true'
      );
    } else {
      alert('Invalid Number');
    }
  };

 const handleLogout = () => {
  localStorage.removeItem('accountLogin');

  setIsLoggedIn(false);

  window.location.href = '/retail';
};

  const saveAddress = () => {
    const updated = [
      ...addresses,
      {
        ...form,
        id: Date.now(),
      },
    ];

    setAddresses(updated);

    localStorage.setItem(
      'addresses',
      JSON.stringify(updated)
    );

    alert('Address Added Successfully');

    setActiveTab('addresses');

    setForm({
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      mobile: '',
      altMobile: '',
    });
  };

  const deleteAddress = (id) => {
    const updated =
      addresses.filter(
        (item) => item.id !== id
      );

    setAddresses(updated);

    localStorage.setItem(
      'addresses',
      JSON.stringify(updated)
    );
  };

 useEffect(() => {
  const logged = localStorage.getItem('accountLogin');

  if (logged !== 'true') {
    router.replace('/retail');
  }
}, [router]);

  return (
    <div className="bg-[#FFF7F2] min-h-screen">
     <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">

        <div className="flex justify-between items-center border-b border-[#0E0E0E] pb-6">
          <h1 className="text-2xl font-medium text-[#0E0E0E]">
            My Account
          </h1>

          <button
            onClick={handleLogout}
            className="text-sm text-[#0E0E0E]"
          >
            LOG OUT →
          </button>
        </div>

        {/* ACCOUNT HOME */}
        {activeTab === 'account' && (
          <div className="mt-8 text-[#0E0E0E]">

            <div
              onClick={() =>
                setActiveTab('orders')
              }
              className="py-4 border-b border-[#0E0E0E] cursor-pointer text-[#0E0E0E]"
            >
              Order History
            </div>

            <div
              onClick={() =>
                setActiveTab('addresses')
              }
              className="py-4 border-b cursor-pointer text-[#0E0E0E]"
            >
              Account Details
            </div>

          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="mt-10 text-[#0E0E0E]">
            <button
              onClick={() =>
                setActiveTab('account')
              }
              className="text-sm mb-6 "
            >
              ← RETURN TO ACCOUNT DETAILS
            </button>

            <h2 className="text-xl ">
              Order History
            </h2>

            <p className="mt-6">
              YOU HAVEN'T PLACED ANY
              ORDERS YET.
            </p>
          </div>
        )}

        {/* ADDRESS LIST */}
        {activeTab === 'addresses' && (
          <div className="mt-10 text-[#0E0E0E]">

            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() =>
                  setActiveTab('account')
                }
              >
                ← RETURN TO ACCOUNT DETAILS
              </button>

              <button
                onClick={() =>
                  setActiveTab(
                    'add-address'
                  )
                }
                className="bg-[#281000] text-white px-6 py-2 rounded-full"
              >
                + ADD NEW ADDRESS
              </button>
            </div>

            <h2 className="mb-8 text-xl ">
              Your Addresses
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {addresses.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FFF7F2] rounded-xl border overflow-hidden"
                >
                  <div className="flex justify-between p-4">
                    <h3 className="font-semibold">
                      {item.firstName}
                    </h3>

                    <span className="bg-[#281000] text-white px-3 py-1 rounded-full text-xs">
                      Default
                    </span>
                  </div>

                  <div className="px-4 pb-4 text-sm text-[#0E0E0E]">
                    <p>{item.address1}</p>
                    <p>{item.city}</p>
                    <p>{item.state}</p>
                    <p>{item.country}</p>
                    <p>{item.mobile}</p>
                  </div>

                  <div className="grid grid-cols-2 border-t">
                    <button className="py-3 border-r">
                      EDIT
                    </button>

                    <button
                      onClick={() =>
                        deleteAddress(
                          item.id
                        )
                      }
                      className="py-3"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* ADD ADDRESS */}
        {activeTab === 'add-address' && (
          <div className="mt-10 text-[#0E0E0E]">

            <div className="flex justify-between mb-8">
              <button
                onClick={() =>
                  setActiveTab(
                    'addresses'
                  )
                }
              >
                ← RETURN TO ACCOUNT DETAILS
              </button>

              <button className="bg-[#281000] text-white px-6 py-2 rounded-full">
                + ADD NEW ADDRESS
              </button>
            </div>

            <h2 className="text-xl mb-8">
              Your Addresses
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">

              {/* FORM */}
              <div className="bg-white border rounded-2xl p-6">
                <h3 className="mb-6 font-semibold text-black">
                  Add a New Address
                </h3>

               <div className="grid md:grid-cols-2 gap-4">

  {Object.keys(form).map((key) => (
    <input
      key={key}
      value={form[key]}
      onChange={(e) =>
        setForm({
          ...form,
          [key]: e.target.value,
        })
      }
      placeholder={
        key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
      }
      className="h-12 border border-[#D8C8BC] rounded-lg px-4 text-[#0E0E0E] placeholder:text-[#0E0E0E]/30 placeholder:font-medium outline-none focus:border-[#281000]"
    />
  ))}

</div>

                <button
                  onClick={saveAddress}
                  className="mt-8 bg-[#281000] text-white px-8 py-3 rounded-full"
                >
                  + ADD NEW ADDRESS
                </button>
              </div>

              {/* MAP */}
              <div className="bg-[#FFF7F2] border rounded-2xl p-6">

                <button className="w-full bg-[#281000] text-white h-12 rounded-full mb-6">
                  Use your Current Location
                </button>

                <iframe
                  src="https://maps.google.com/maps?q=Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-[350px] rounded-xl"
                />

                <div className="mt-4">
                  <h4 className="font-semibold">
                    Jaipur, Rajasthan
                  </h4>

                  <p className="text-sm text-gray-500">
                    Rajasthan, India
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}