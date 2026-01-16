import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import CarRegisterSidebar from "./CarRegisterSidebar";

const CarRegisterLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Mobile topbar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="font-black text-gray-900">Car Register Panel</div>
          <button
            onClick={() => setOpen(true)}
            className="w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block h-screen sticky top-0">
          <CarRegisterSidebar />
        </div>

        {/* Mobile sidebar */}
        {open && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <div className="fixed top-0 left-0 h-screen w-72 z-50 lg:hidden">
              <CarRegisterSidebar />
            </div>
          </>
        )}

        {/* Content */}
        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CarRegisterLayout;
