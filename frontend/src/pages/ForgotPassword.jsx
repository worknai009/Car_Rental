import { useState } from "react";
import userApi from "../utils/userApi"; // or axios baseURL

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    try {
      setMsg("");
      const res = await userApi.post("/auth/forgot-password", { email });
      setMsg(res.data?.message || "Check your email");
    } catch (e) {
      setMsg(e?.response?.data?.message || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 pt-5 mt-5 bg-white rounded-2xl border">
      <h1 className="text-2xl font-black mt-5">Forgot Password</h1>
      <p className="text-sm text-gray-500 mt-1">Enter your email to get reset link.</p>

      <input
        className="w-full mt-4 border rounded-xl px-3 py-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={submit}
        className="w-full mt-3 bg-black text-white rounded-xl py-2 font-semibold"
      >
        Send Reset Link
      </button>

      {msg && <div className="mt-3 text-sm text-gray-700">{msg}</div>}
    </div>
  );
}
