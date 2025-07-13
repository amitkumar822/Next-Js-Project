"use client";
import { upload } from "@imagekit/next";
import React, { useState } from "react";

interface FileUploadProps {
    onSuccess: (res: any) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // optional validation
    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid video file");
            }
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("File size must be less than 100 MB");
        }
        return true;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file || !validateFile(file)) return;

        setUploading(true);
        setError(null);

        try {
            const autRes = await fetch("/api/auth/imagekit-auth");
            const auth = await autRes.json();

            const res = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent));
                    }
                },
            });
            console.log("Upload Res: ", res);
            
            onSuccess(res);
        } catch (error) {
            console.log("Upload failed: ", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <label className="cursor-pointer inline-block px-6 py-3 text-sm font-semibold text-white bg-purple-600 rounded-lg shadow hover:bg-purple-700 transition duration-300">
                Select {fileType === "video" ? "Video" : "Image"}
                <input
                    type="file"
                    accept={fileType === "video" ? "video/*" : "image/*"}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>

            {uploading && (
                <div className="flex items-center gap-2 text-purple-700 text-sm font-medium">
                    <svg
                        className="animate-spin h-5 w-5 text-purple-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                    Uploading...
                </div>
            )}
        </div>
    );
};

export default FileUpload;
