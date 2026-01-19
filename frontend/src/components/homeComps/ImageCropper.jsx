// components/profile/ImageCropper.jsx
import Cropper from "react-easy-crop";
import { useState } from "react";
import { getCroppedImage } from "../../utils/cropImage";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import { useAuthStore } from "../../store/authStore";

export default function ImageCropper({ imageSrc, onClose }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const { saveAvatar } = useAuthStore();

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleSave = async () => {
    // get cropped blob
    const blob = await getCroppedImage(imageSrc, croppedAreaPixels);

    //  upload to cloudinary
    const uploadResult = await uploadToCloudinary(blob);

    // save to backend
    await saveAvatar({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    alert("Avatar saved!");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md w-[400px] h-[400px] relative">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
        <div className="relative flex flex-row justify-between">
          <button
            onClick={handleSave}
            className="py-2 px-4 bg-cyan-100 hover:bg-cyan-700 hover:text-white rounded-md hover:rounded-full cursor-pointer"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-red-100 hover:bg-red-600 hover:text-white rounded-md hover:rounded-full cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
