import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import userApi from "../utils/userApi";

export default function ResetPassword() {
  const [sp] = useSearchParams();
  const nav = useNavigate();

  const token = sp.get("token") || "";

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const canSubmit = useMemo(() => token && password.length >= 6, [token, password]);

  const submit = async () => {
    try {
      setMsg("");
      const res = await userApi.post("/auth/reset-password", { token, password });
      setMsg(res.data?.message || "Password updated ✅");

      setTimeout(() => nav("/login"), 900);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Error");
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl border mt-8">
        <h1 className="text-2xl font-black">Reset Password</h1>
        <p className="text-sm text-red-600 mt-2">Token missing or invalid link.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl border mt-8">
      <h1 className="text-2xl font-black">Reset Password</h1>

      <input
        className="w-full mt-4 border rounded-xl px-3 py-2"
        placeholder="New password (min 6 chars)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={!canSubmit}
        className="w-full mt-3 bg-black text-white rounded-xl py-2 font-semibold disabled:opacity-50"
      >
        Update Password
      </button>

      {msg && <div className="mt-3 text-sm text-gray-700">{msg}</div>}
    </div>
  );
}
