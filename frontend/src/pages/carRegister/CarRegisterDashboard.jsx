import React from "react";

const CarRegisterDashboard = () => {
  return (
    <div className="space-y-4">
      <div className="text-2xl font-black text-gray-900">Dashboard</div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200/60 shadow-sm">
          <div className="text-sm text-gray-500 font-bold">Total Cars</div>
          <div className="text-3xl font-black mt-2">0</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/60 shadow-sm">
          <div className="text-sm text-gray-500 font-bold">Bookings</div>
          <div className="text-3xl font-black mt-2">0</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/60 shadow-sm">
          <div className="text-sm text-gray-500 font-bold">Earnings</div>
          <div className="text-3xl font-black mt-2">₹0</div>
        </div>
      </div>
    </div>
  );
};

export default CarRegisterDashboard;
