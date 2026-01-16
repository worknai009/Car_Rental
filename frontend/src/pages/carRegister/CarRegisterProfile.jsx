import React from "react";
import { useCarRegisterAuth } from "../../components/carRegister/CarRegisterAuthContext";

const CarRegisterProfile = () => {
  const { user } = useCarRegisterAuth();

  return (
    <div className="space-y-4">
      <div className="text-2xl font-black text-gray-900">Profile</div>
      <pre className="p-6 rounded-2xl bg-white border border-gray-200/60 shadow-sm overflow-auto">
{JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
};
export default CarRegisterProfile;
