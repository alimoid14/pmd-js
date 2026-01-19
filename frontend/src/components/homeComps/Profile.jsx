import React, { useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import ImageCropper from "./ImageCropper";
function Profile() {
  const { user } = useAuthStore();

  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageSrc(url); // triggers cropper
  };
  return (
    <div className="flex flex-row gap-4 text-slate-900 font-bold">
      <div>
        <img
          className="w-16 h-16 rounded-full hover:cursor-pointer"
          src={
            user.avatar?.url ||
            "https://www.gamebyte.com/wp-content/uploads/2022/04/39f9aecd-steve-from-minecraft-1.jpg"
          }
          alt="pfp"
          onClick={() => fileInputRef.current.click()}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          hidden
          onChange={handleFileSelect}
        />
        {/* <ImageCropper yourImage="https://www.gamebyte.com/wp-content/uploads/2022/04/39f9aecd-steve-from-minecraft-1.jpg" /> */}
      </div>
      {imageSrc && (
        <ImageCropper imageSrc={imageSrc} onClose={() => setImageSrc(null)} />
      )}
      <div>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
    </div>
  );
}

export default Profile;
