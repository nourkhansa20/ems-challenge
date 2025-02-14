/**
 * FileUpload is a reusable component for handling file uploads with drag-and-drop functionality.
 * It supports features like:
 * - Drag-and-drop file upload.
 * - Image preview for uploaded files.
 * - Customizable labels, placeholders, and error messages.
 * - Required field validation.
 * - Click-to-upload functionality.
 * - Display of file names or custom placeholders.
 */

import { useState } from "react";

interface FileUploadProps {
    label: string;
    error: string;
    name: string;
    placeholder: string;
    className: string;
    file?: File | null;
    setFile?: (file: File) => void;
    required?: boolean;
    showFile?: boolean;
}

export default function FileUpload({
    label,
    name,
    file,
    setFile,
    error,
    required,
    className,
    placeholder,
    showFile = false,
}: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setFile(file);
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleDivClick = () => {
        document.getElementById(name)?.click();
    };

    return (
        <div>
            <label htmlFor={name} className="field-label">
                {label}
            </label>
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`border-[2px] overflow-hidden border-gray-400 border-dashed p-[20px] text-center cursor-pointer rounded-2xl ${className}`}
                onClick={handleDivClick} // Add onClick handler
            >
                {/* Show the image preview if available */}
                {showFile && (preview || file) ? (
                    <img
                        src={preview ? preview : file}
                        alt="Preview"
                        className="max-w-full max-h-48 mx-auto"
                    />
                ) : (
                    /* Show the file name or placeholder */
                    file?.name
                        ? file.name
                        : file
                            ? file.split("/").pop() // Use `/` for URL paths
                            : placeholder || `Drag and drop a ${label.toLowerCase()} or click to upload`
                )}
            </div>
            {
                error &&
                <div className="text-xs text-red-400 ">{error}</div>
            }
            <input
                type="file"
                name={name}
                id={name}
                onChange={handleFileChange}
                className="hidden"
                required={required}
            />
            {/* Display a validation message if the field is required and no file is selected */}
            {required && !file && (
                <div style={{ color: "red", marginTop: "5px" }}>
                    This field is required.
                </div>
            )}
        </div>
    );
}