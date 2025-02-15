import { useState } from "react";
import useShowToast from "./useShowToast";
import imageCompression from "browser-image-compression";

const usePreviewImg = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const showToast = useShowToast();

  // const maxFileSizeInBytes = 2 * 1024 * 1024
  const compressionOptions = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      // if(file.size > maxFileSizeInBytes){
      //     showToast("Error", "File size must be less than 2MB", "error")
      //     setSelectedFile(null)
      //     return
      // }

      try {
        // Compress Image
        const compressedFile = await imageCompression(file, compressionOptions);

        // Convert compressed image to base64 for previewing
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFile(reader.result);
        };

        reader.readAsDataURL(compressedFile);
        console.log("Compression successful");
      } catch {
        showToast("Error", "Image compression failed", "error");
        console.error("Compression error:", error);
      }
    } else {
      showToast("Error", "Please select an image file", "error");
      setSelectedFile(null);
    }
  };
  return { selectedFile, handleImageChange, setSelectedFile };
};
export default usePreviewImg;
