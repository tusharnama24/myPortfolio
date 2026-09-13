"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FaCloudUploadAlt, FaTrash, FaSpinner } from "react-icons/fa";

export default function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
}) {
  const inputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to upload image"
        );
      }

      onChange(data.image.url);
    } catch (error) {
      console.error("Image upload error:", error);

      setError(
        error.message || "Failed to upload image"
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
    setError("");
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>

      {/* Preview */}
      {value && (
        <div className="relative overflow-hidden rounded-xl border border-[#374151] bg-[#0f172a]">
          <div className="relative h-56 w-full">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-red-500/90 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTrash size={13} />
            Remove
          </button>
        </div>
      )}

      {/* Upload Button */}
      {!value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#374151] bg-[#0f172a] px-6 py-10 text-center transition hover:border-violet-500 hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <>
              <FaSpinner
                size={28}
                className="animate-spin text-violet-400"
              />

              <p className="mt-3 text-sm font-medium text-gray-300">
                Uploading image...
              </p>
            </>
          ) : (
            <>
              <FaCloudUploadAlt
                size={32}
                className="text-[#16f2b3]"
              />

              <p className="mt-3 text-sm font-medium text-white">
                Click to upload an image
              </p>

              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, JPEG, WEBP · Maximum 5 MB
              </p>
            </>
          )}
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error */}
      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Uploaded URL */}
      {value && (
        <p className="break-all text-xs text-gray-500">
          Cloudinary URL: {value}
        </p>
      )}
    </div>
  );
}