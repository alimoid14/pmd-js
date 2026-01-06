import React from "react";
import { useAuthStore } from "../../store/authStore";

function Profile() {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-row gap-4 text-slate-900 font-bold">
      <img
        className="w-16 h-16 rounded-full"
        src="https://www.gamebyte.com/wp-content/uploads/2022/04/39f9aecd-steve-from-minecraft-1.jpg"
        alt="pfp"
      />
      <div>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
    </div>
  );
}

export default Profile;
