"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import FileUpload from "../components/FileUpload";

export default function VideoUploadPage() {
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUploadSuccess = (res: any) => {
    setVideoURL(res.url);
    setIsUploaded(true);
    setUploadProgress(100);
    toast.success("Video uploaded successfully!");
  };

  const handleSubmit = async () => {
    if (!videoURL) return toast.error("No video uploaded");

    setSubmitting(true);

    try {
      const res = await fetch("/api/videos/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: videoURL }),
      });

      if (!res.ok) throw new Error("Failed to save video");

      toast.success("Video saved to database!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save to database");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-100 to-blue-200 px-4">
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl p-10 text-black w-full max-w-2xl space-y-8 border border-purple-100">
        <h2 className="text-3xl font-bold text-center text-purple-700">Upload Your Video</h2>

        <div className="space-y-4">
          <FileUpload
            fileType="video"
            onSuccess={handleUploadSuccess}
            onProgress={(percent) => {
              setUploadProgress(percent);
              setIsUploading(percent < 100);
            }}
          />

          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
              <p className="text-xs text-center mt-1 text-purple-700 font-medium">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {isUploaded && videoURL && (
            <div className="relative mt-4">
              <video
                src={videoURL}
                controls
                className="w-full rounded-xl shadow-md border border-purple-200"
              />
              <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                Preview
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isUploaded || submitting}
          className={`w-full py-3 px-6 rounded-xl text-white font-semibold transition duration-200 shadow-md ${
            !isUploaded || submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {submitting ? "Saving..." : "Submit Video"}
        </button>
      </div>
    </div>
  );
}


