import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CarFront,
  PlusCircle,
  ClipboardList,
  User2,
  LogOut,
  MapPin,
} from "lucide-react";
import { useCarRegisterAuth } from "./CarRegisterAuthContext";

const base =
  "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all";
const active = "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow";
const idle = "text-gray-700 hover:bg-cyan-50 hover:text-cyan-700";

const CarRegisterSidebar = () => {
  const { logout } = useCarRegisterAuth();

  const items = [
    { name: "Dashboard", to: "/car-register/dashboard", icon: LayoutDashboard },
    { name: "My Cars", to: "/car-register/cars", icon: CarFront },
    { name: "Add Car", to: "/car-register/cars/add", icon: PlusCircle },
    { name: "Bookings", to: "/car-register/bookings", icon: ClipboardList },
    { name: "Tours", to: "/car-register/tours", icon: MapPin },
    { name: "Profile", to: "/car-register/profile", icon: User2 },
  ];

  return (
    <aside className="w-72 h-full bg-white/80 backdrop-blur-xl border-r border-gray-200/60 p-5">
      <div className="mb-6">
        <div className="text-xl font-black text-gray-900">Car Register Panel</div>
        <div className="text-xs text-gray-500 tracking-widest mt-1">
          MANAGE CARS & BOOKINGS
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <NavLink
              key={it.name}
              to={it.to}
              className={({ isActive }) => `${base} ${isActive ? active : idle}`}
              end={it.to === "/car-register/dashboard"}
            >
              <Icon className="h-5 w-5" />
              <span>{it.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 pt-6 border-t border-gray-200/60">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-cyan-400 hover:text-cyan-700 font-bold transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default CarRegisterSidebar;
