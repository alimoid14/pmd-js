// utils/cloudinaryUpload.js
import { useAuthStore } from "../store/authStore";
export async function uploadToCloudinary(blob) {
  const { getCloudinarySignature } = useAuthStore.getState();
  // get signature
  const sigRes = await getCloudinarySignature();
  const { signature, timestamp, publicId } = sigRes;

  // upload
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("public_id", publicId);
  formData.append("overwrite", "true");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );

  return res.json();
}
