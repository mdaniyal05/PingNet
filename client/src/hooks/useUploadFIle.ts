import axios from "axios";
import { useState } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

type uploadFile = File | null;

export default function useUploadFile(file: uploadFile) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "http://localhost:8080/api/v1/user/upload-avatar",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;

            setUploadProgress(progress);
          },
        }
      );

      setStatus("success");
      setUploadProgress(100);
    } catch {
      setStatus("error");
      setUploadProgress(0);
    }
  };

  return { handleFileUpload, status, uploadProgress };
}
