import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { updateUserProfile, getUserByEmail } from "../../../Services/api";
import { uploadImageToImgBB } from "../../../Auth/authService";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../../../Contents/AuthContext/useAuth";

const HRProfile = () => {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profileImagePreview, setProfileImagePreview] = useState("");
    const [companyLogoPreview, setCompanyLogoPreview] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        companyName: "",
        companyLogo: "",
        profileImage: "",
        packageLimit: 0,
        currentEmployees: 0,
        subscription: "",
        dateOfBirth: ""
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                if (!authUser?.email) {
                    navigate("/login");
                    return;
                }

                const userData = JSON.parse(localStorage.getItem("userData")) || {};
                const result = await getUserByEmail(authUser.email);

                if (result.success && result.data) {
                    setProfile(result.data);
                    setForm({
                        name: result.data.name || authUser.name || "",
                        email: result.data.email || authUser.email || "",
                        companyName: result.data.companyName || userData.companyName || "",
                        companyLogo: result.data.companyLogo || userData.companyLogo || "",
                        profileImage: result.data.profileImage || authUser.profileImage || "",
                        packageLimit: result.data.packageLimit || userData.packageLimit || 0,
                        currentEmployees: result.data.currentEmployees || userData.currentEmployees || 0,
                        subscription: result.data.subscription || userData.subscription || null,
                        dateOfBirth: result.data.dateOfBirth || userData.dateOfBirth || ""
                    });
                } else {
                    setProfile(userData);
                    setForm({
                        name: userData.name || authUser.name || "",
                        email: userData.email || authUser.email || "",
                        companyName: userData.companyName || "",
                        companyLogo: userData.companyLogo || "",
                        profileImage: userData.profileImage || authUser.profileImage || "",
                        packageLimit: userData.packageLimit || 0,
                        currentEmployees: userData.currentEmployees || 0,
                        subscription: userData.subscription || null,
                        dateOfBirth: userData.dateOfBirth || ""
                    });
                }
                setError("");
            } catch {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setError("");
            
            const preview = URL.createObjectURL(file);
            setProfileImagePreview(preview);
            
            const uploadResult = await uploadImageToImgBB(file);
            if (uploadResult.success) {
                handleChange("profileImage", uploadResult.url);
            } else {
                setError(uploadResult.error || "Failed to upload profile image");
            }
        } catch {
            setError("Error uploading profile image");
        } finally {
            setUploading(false);
        }
    };

    const handleCompanyLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setError("");
            
            const preview = URL.createObjectURL(file);
            setCompanyLogoPreview(preview);
            
            const uploadResult = await uploadImageToImgBB(file);
            if (uploadResult.success) {
                handleChange("companyLogo", uploadResult.url);
            } else {
                setError(uploadResult.error || "Failed to upload company logo");
            }
        } catch {
            setError("Error uploading company logo");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            
            const result = await updateUserProfile(form);
            if (result.success) {
                setProfile(form);
                setEditing(false);
                localStorage.setItem("userData", JSON.stringify(form));
            } else {
                setError(result.error || "Failed to save profile");
            }
        } catch {
            setError("Error saving profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Profile" subtitle="View and manage your profile.">
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Profile" subtitle="View and manage your HR account information.">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl bg-base-100 p-6 shadow lg:col-span-1">
                    <div className="flex flex-col items-center gap-4">
                        <div className="avatar">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 bg-base-200">
                                <img
                                    src={form.profileImage || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e0e0e0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"}
                                    alt={form.name || "Profile"}
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">{form.name || "User"}</h2>
                            <p className="text-sm text-base-content/60">{form.email}</p>
                            <div className="mt-2">
                                <span className="badge badge-primary capitalize">{form.subscription || "Free"}</span>
                            </div>
                        </div>
                    </div>

                    {form.companyLogo && (
                        <div className="mt-6 flex justify-center">
                            <div className="avatar">
                                <div className="w-32 rounded-lg border-2 border-base-300 bg-base-200">
                                    <img src={form.companyLogo} alt={form.companyName || "Company"} className="w-full h-full object-cover" onError={() => setForm(p => ({ ...p, companyLogo: '' }))} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="rounded-2xl bg-base-100 p-6 shadow lg:col-span-2">
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold">Account Information</h3>
                        {!editing && (
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => setEditing(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                        {editing && (
                            <div className="space-x-2">
                                <button
                                    className="btn btn-sm"
                                    onClick={() => {
                                        setEditing(false);
                                        setForm({
                                            name: profile.name || "",
                                            email: profile.email || "",
                                            companyName: profile.companyName || "",
                                            companyLogo: profile.companyLogo || "",
                                            profileImage: profile.profileImage || "",
                                            packageLimit: profile.packageLimit || 0,
                                            currentEmployees: profile.currentEmployees || 0,
                                            subscription: profile.subscription || null,
                                            dateOfBirth: profile.dateOfBirth || ""
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold">Full Name</span>
                            </div>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                disabled={!editing}
                            />
                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold">Email</span>
                            </div>
                            <input
                                type="email"
                                className="input input-bordered"
                                value={form.email}
                                disabled
                            />
                            <div className="label">
                                <span className="label-text-alt text-base-content/60">Cannot be changed</span>
                            </div>
                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold">Date of Birth</span>
                            </div>
                            <input
                                type="date"
                                className="input input-bordered"
                                value={form.dateOfBirth}
                                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                                disabled={!editing}
                            />
                        </label>

                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold">Company Name</span>
                            </div>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={form.companyName}
                                onChange={(e) => handleChange("companyName", e.target.value)}
                                disabled={!editing}
                            />
                        </label>

                        <label className="form-control md:col-span-2">
                            <div className="label">
                                <span className="label-text font-semibold">Profile Image</span>
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfileImageUpload}
                                    disabled={!editing || uploading}
                                    className="file-input file-input-bordered file-input-primary w-full"
                                />
                                {(profileImagePreview || form.profileImage) && (
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={profileImagePreview || form.profileImage} 
                                            alt="Profile Preview" 
                                            className="h-20 w-20 rounded-lg object-cover border border-base-300"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => {
                                                handleChange("profileImage", "");
                                                setProfileImagePreview("");
                                            }}
                                            disabled={!editing}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </label>

                        <label className="form-control md:col-span-2">
                            <div className="label">
                                <span className="label-text font-semibold">Company Logo</span>
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCompanyLogoUpload}
                                    disabled={!editing || uploading}
                                    className="file-input file-input-bordered file-input-primary w-full"
                                />
                                {(companyLogoPreview || form.companyLogo) && (
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={companyLogoPreview || form.companyLogo} 
                                            alt="Logo Preview" 
                                            className="h-20 w-20 rounded-lg object-cover border border-base-300"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => {
                                                handleChange("companyLogo", "");
                                                setCompanyLogoPreview("");
                                            }}
                                            disabled={!editing}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border-l-4 border-primary bg-base-100 p-6 shadow">
                    <p className="text-sm text-base-content/70">Package Limit</p>
                    <p className="text-3xl font-bold text-primary">{form.packageLimit}</p>
                    <p className="mt-1 text-xs text-base-content/60">maximum employees</p>
                </div>

                <div className="rounded-2xl border-l-4 border-info bg-base-100 p-6 shadow">
                    <p className="text-sm text-base-content/70">Current Employees</p>
                    <p className="text-3xl font-bold text-info">{form.currentEmployees}</p>
                    <p className="mt-1 text-xs text-base-content/60">active members</p>
                </div>

                <div className="rounded-2xl border-l-4 border-success bg-base-100 p-6 shadow">
                    <p className="text-sm text-base-content/70">Subscription</p>
                    <p className="mt-2 capitalize">
                        <span className="badge badge-success">{form.subscription || "Free"}</span>
                    </p>
                    <p className="mt-1 text-xs text-base-content/60">{form.subscription ? "active plan" : "upgrade to manage more"}</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HRProfile;
