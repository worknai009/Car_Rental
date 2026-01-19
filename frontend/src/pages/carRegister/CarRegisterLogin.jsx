import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useCarRegisterAuth } from "../../components/carRegister/CarRegisterAuthContext";

const CarRegisterLogin = () => {
  const navigate = useNavigate();
  const { login, loading } = useCarRegisterAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const onChange = (e) => {
    setErr("");
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const onSubmit = async (e) => {
  e.preventDefault();
  setErr("");

  try {
    await login(form); // context handles everything

    navigate("/car-register/dashboard", { replace: true });
  } catch (error) {
    setErr(
      error?.response?.data?.message ||
      error?.message ||
      "Login failed"
    );
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-3xl shadow-2xl p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center shadow-lg">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">
              Car Register Login
            </div>
            <div className="text-sm text-gray-500">
              Access your panel
            </div>
          </div>
        </div>

        {err && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              required
              className="mt-1 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">
              Password
            </label>
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              type="password"
              required
              className="mt-1 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-black shadow-xl hover:shadow-2xl transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-5 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            className="font-bold text-cyan-700 hover:underline"
            to="/car-register/register"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarRegisterLogin;
