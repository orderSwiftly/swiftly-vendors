// src/components/store-owner/edit-store-name.tsx

"use client";
import { useState, useRef } from "react";
import { editStoreName, uploadStoreImage } from "@/lib/store";
import { ImageIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StoreData {
    id: string;
    name: string;
}

interface EditStoreNameModalProps {
    store: StoreData;
    onClose: () => void;
    onSuccess: (storeId: string, newName: string) => void;
    onImageUploaded?: (storeId: string, imageUrl: string) => void; // Optional callback for image upload
}

export default function EditStoreNameModal({ store, onClose, onSuccess, onImageUploaded }: Readonly<EditStoreNameModalProps>) {
    const [name, setName] = useState(store.name);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 2.5MB = 2.5 * 1024 * 1024 bytes)
        const maxSize = 2.5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError("Image size must not exceed 2.5MB");
            return;
        }

        // Check file type
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file");
            return;
        }

        setError(null);
        setSelectedImage(file);
        setUploadedImageUrl(null); // Clear previous uploaded URL
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setUploadedImageUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleConfirm = async () => {
        const trimmedName = name.trim();
        const hasNameChange = trimmedName && trimmedName !== store.name;
        const hasImageChange = selectedImage !== null;
        
        if (!hasNameChange && !hasImageChange) return;
        
        setLoading(true);
        setError(null);

        try {
            let imageUrl = null;
            
            // Upload image first if selected
            if (hasImageChange && selectedImage) {
                setUploadingImage(true);
                const response = await uploadStoreImage(store.id, selectedImage);
                imageUrl = response.url; // Extract URL from response
                setUploadedImageUrl(imageUrl);
                setUploadingImage(false);
                
                // Call the onImageUploaded callback if provided
                if (onImageUploaded && imageUrl) {
                    onImageUploaded(store.id, imageUrl);
                }
            }

            // Update store name if changed
            if (hasNameChange) {
                await editStoreName(store.id, { new_name: trimmedName });
                onSuccess(store.id, trimmedName);
                toast.success("Store name updated successfully.");
            } else if (hasImageChange) {
                // If only image was uploaded, still trigger onSuccess to refresh
                toast.success("Store image updated successfully.");
                onSuccess(store.id, store.name);
            }
            
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update store.");
            setUploadingImage(false);
            toast.error("Failed to update store.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-800 text-center pry-ff">Edit store name</h2>
                <p className="text-xs text-gray-400 text-center mt-1 mb-6 sec-ff">
                    A store can operate across multiple locations
                </p>

                {/* Store Image Upload Section */}
                <div className="mb-4">
                    <label className="text-xs text-gray-500 mb-1 block sec-ff">Store Image</label>
                    {imagePreview ? (
                        <div className="relative">
                            <img 
                                src={imagePreview} 
                                alt="Store preview" 
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                disabled={uploadingImage}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => !uploadingImage && fileInputRef.current?.click()}
                            className={`w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-(--prof-clr) transition-colors ${
                                uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {uploadingImage ? (
                                <Loader2 size={24} className="animate-spin text-(--prof-clr)" />
                            ) : (
                                <>
                                    <ImageIcon size={24} className="text-gray-400" />
                                    <p className="text-xs text-gray-500 sec-ff">Click to upload store image</p>
                                    <p className="text-xs text-gray-400 sec-ff">Max size: 2.5MB</p>
                                </>
                            )}
                        </div>
                    )}
                    {uploadedImageUrl && (
                        <p className="text-xs text-green-600 mt-2 truncate">
                            ✓ Image uploaded successfully
                        </p>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={uploadingImage}
                    />
                </div>

                <p className="text-sm font-medium text-gray-700 mb-3 pry-ff">Store details</p>

                <label className="text-xs text-gray-500 mb-1 block sec-ff">Store name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`e.g ${store.name}`}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-gray-300 mb-1 sec-ff"
                    disabled={uploadingImage}
                />

                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

                <div className="flex gap-3 mt-5 sec-ff">
                    <button
                        onClick={onClose}
                        disabled={loading || uploadingImage}
                        className="flex-1 border border-gray-200 rounded-md py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || (!name.trim() && !selectedImage) || (name.trim() === store.name && !selectedImage) || uploadingImage}
                        className="flex-1 bg-(--prof-clr) text-(--txt-clr) rounded-md py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                        {(loading || uploadingImage) ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                {uploadingImage ? "Uploading..." : "Saving..."}
                            </>
                        ) : (
                            "Confirm"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}