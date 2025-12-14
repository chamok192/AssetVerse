import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createAsset, getAssetById, updateAsset } from "../../../Services/api";
import { uploadImageToImgBB } from "../../../Auth/authService";
import DashboardLayout from "./DashboardLayout";

const AddAsset = () => {
    const navigate = useNavigate();
    const { assetId } = useParams();
    const queryClient = useQueryClient();
    const isEdit = Boolean(assetId);

    const [form, setForm] = useState({
        name: "",
        image: "",
        type: "returnable",
        quantity: 1
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [error, setError] = useState("");

    // Fetch asset data if editing
    const { data: assetData, isLoading: assetLoading } = useQuery({
        queryKey: ['asset', assetId],
        queryFn: async () => {
            const result = await getAssetById(assetId);
            if (result.success && result.data) {
                return result.data;
            } else {
                const errorMsg = result.error || "Failed to load asset";
                setError(errorMsg);
                throw new Error(errorMsg);
            }
        },
        enabled: isEdit,
        staleTime: Infinity
    });

    // Load asset data into form when data is fetched
    useEffect(() => {
        if (!assetData || !isEdit) return;
        
        const imageUrl = assetData.productImage || assetData.image || "";
        const handler = () => {
            setForm({
                name: assetData.productName || assetData.name || "",
                image: imageUrl,
                type: assetData.productType || assetData.type || "returnable",
                quantity: assetData.productQuantity ?? assetData.quantity ?? 1
            });
            setImagePreview(imageUrl);
        };
        handler();
    }, [assetData, isEdit]);

    // Mutation for creating asset
    const createMutation = useMutation({
        mutationFn: createAsset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            navigate("/hr/assets");
        },
        onError: (err) => {
            setError(err?.message || "Failed to create asset");
        }
    });

    // Mutation for updating asset
    const updateMutation = useMutation({
        mutationFn: (payload) => updateAsset(assetId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            queryClient.invalidateQueries({ queryKey: ['asset', assetId] });
            navigate("/hr/assets");
        },
        onError: (err) => {
            setError(err?.message || err?.error || "Failed to update asset");
        }
    });

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError("Please select a valid image file");
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }

            setImageFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate required fields
        if (!form.name.trim()) {
            setError("Asset name is required");
            return;
        }
        if (!form.type) {
            setError("Asset type is required");
            return;
        }
        if (form.quantity <= 0) {
            setError("Quantity must be greater than 0");
            return;
        }

        // Upload image to ImgBB if a new file is selected
        let imageUrl = form.image.trim();
        if (imageFile) {
            const uploadResult = await uploadImageToImgBB(imageFile);
            if (!uploadResult.success) {
                setError(uploadResult.error || "Failed to upload image");
                return;
            }
            imageUrl = uploadResult.url;
        }

        const payload = {
            name: form.name,
            image: imageUrl,
            type: form.type,
            quantity: Number(form.quantity) || 0
        };

        if (isEdit) {
            updateMutation.mutate(payload);
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <DashboardLayout
            title={isEdit ? "Edit Asset" : "Add New Asset"}
            subtitle="Add photos, categorize by type, and set accurate stock counts."
        >
            <div className="mx-auto max-w-3xl rounded-box bg-base-100 p-6 shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-base-content/70">Asset form</p>
                        <h2 className="text-xl font-bold">{isEdit ? "Update details" : "Create asset"}</h2>
                    </div>
                    <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>
                        Back
                    </button>
                </div>

                {(error || createMutation.error || updateMutation.error) && (
                    <div className="alert alert-error mt-4">
                        <span>{error || createMutation.error?.message || updateMutation.error?.message || "Failed to save asset"}</span>
                    </div>
                )}

                {assetLoading && isEdit && (
                    <div className="mt-6 flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                )}

                {!assetLoading && (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text font-medium">Product Name</span>
                            </div>
                            <input
                                required
                                type="text"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="MacBook Pro 16"
                                className="input input-bordered w-full"
                            />
                        </label>

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text font-medium">Product Image</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file-input file-input-bordered w-full"
                            />
                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-sm text-base-content/70 mb-3">Preview:</p>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-24 w-24 rounded-lg object-cover border border-base-300"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview("");
                                                setForm(prev => ({ ...prev, image: "" }));
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </label>

                        <div className="grid gap-6 md:grid-cols-2">
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text font-medium">Product Type</span>
                                </div>
                                <select
                                    className="select select-bordered w-full"
                                    value={form.type}
                                    onChange={(e) => handleChange("type", e.target.value)}
                                >
                                    <option value="returnable">Returnable</option>
                                    <option value="non-returnable">Non-returnable</option>
                                </select>
                            </label>

                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text font-medium">Product Quantity</span>
                                </div>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.quantity}
                                    onChange={(e) => handleChange("quantity", e.target.value)}
                                    className="input input-bordered w-full"
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full mt-8"
                            disabled={assetLoading || createMutation.isPending || updateMutation.isPending}
                        >
                            {createMutation.isPending || updateMutation.isPending
                                ? "Saving..."
                                : isEdit
                                  ? "Update Asset"
                                  : "Add Asset"}
                        </button>
                    </form>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AddAsset;
