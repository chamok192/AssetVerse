import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../../../FireBase/firebase.init";
import { updateUserProfile, getUserByEmail } from "../../../Services/api";
import { uploadImageToImgBB } from "../../../Auth/authService";
import EmployeeDashboardLayout from "./EmployeeDashboardLayout";

const EmployeeProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        profileImage: "",
        dateOfBirth: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    navigate("/login");
                    return;
                }

                const userData = JSON.parse(localStorage.getItem("userData")) || {};
                const result = await getUserByEmail(currentUser.email);

                if (result.success && result.data) {
                    setProfile(result.data);
                    setForm({
                        name: result.data.name || currentUser.displayName || "",
                        email: result.data.email || currentUser.email || "",
                        profileImage: result.data.profileImage || currentUser.photoURL || "",
                        dateOfBirth: result.data.dateOfBirth || ""
                    });
                } else {
                    setProfile(userData);
                    setForm({
                        name: userData.name || currentUser.displayName || "",
                        email: userData.email || currentUser.email || "",
                        profileImage: userData.profileImage || currentUser.photoURL || "",
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

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError("Please select a valid image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            const currentUser = auth.currentUser;
            if (!currentUser) {
                setError("User not authenticated");
                return;
            }

            let profileImageUrl = form.profileImage;
            if (imageFile) {
                const uploadRes = await uploadImageToImgBB(imageFile);
                if (uploadRes.success) {
                    profileImageUrl = uploadRes.url;
                } else {
                    setError("Failed to upload image");
                    setSaving(false);
                    return;
                }
            }

            const updatedForm = { ...form, profileImage: profileImageUrl };
            // backend 'updateUserProfile' uses token to identify user, so we don't need to pass ID
            const result = await updateUserProfile(updatedForm);
            if (result.success) {
                setProfile(updatedForm);
                setForm(updatedForm);
                setImageFile(null);
                setImagePreview("");
                setEditing(false);
                localStorage.setItem("userData", JSON.stringify(updatedForm));
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
            <EmployeeDashboardLayout title="Profile" subtitle="View and manage your profile.">
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </EmployeeDashboardLayout>
        );
    }

    return (
        <EmployeeDashboardLayout title="Profile" subtitle="View and manage your employee account information.">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl bg-base-100 p-6 shadow lg:col-span-1">
                    <div className="flex flex-col items-center gap-4">
                        <div className="avatar">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 bg-base-200">
                                <img
                                    src={imagePreview || form.profileImage || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e0e0e0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"}
                                    alt={form.name || "Profile"}
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">{form.name || "Employee"}</h2>
                            <p className="text-sm text-base-content/60">{form.email}</p>
                            <div className="mt-2">
                                <span className="badge badge-primary">Employee</span>
                            </div>
                        </div>
                    </div>

                    {profile?.affiliations?.length > 0 && (
                        <div className="mt-6 w-full">
                            <h4 className="text-sm font-bold mb-2 text-base-content/70">Affiliated Companies</h4>
                            <div className="space-y-2">
                                {profile.affiliations.map((aff) => (
                                    <div key={aff._id} className="flex items-center gap-3 p-2 rounded-lg bg-base-200 border border-base-300">
                                        <div className="avatar">
                                            <div className="w-8 h-8 rounded bg-base-300">
                                                {aff.companyLogo && <img src={aff.companyLogo} alt={aff.companyName} />}
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-bold truncate">{aff.companyName}</p>
                                            <p className="text-[10px] text-base-content/50">Joined: {new Date(aff.affiliationDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
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
                                            profileImage: profile.profileImage || "",
                                            dateOfBirth: profile.dateOfBirth || ""
                                        });
                                        setImageFile(null);
                                        setImagePreview("");
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

                        <label className="form-control md:col-span-2">
                            <div className="label">
                                <span className="label-text font-semibold">Profile Image</span>
                            </div>
                            {editing ? (
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            ) : (
                                <div className="text-sm text-base-content/60 px-4 py-3 bg-base-200 rounded-lg break-all">
                                    {form.profileImage || "No image set"}
                                </div>
                            )}
                        </label>
                    </div>
                </div>
            </div>
        </EmployeeDashboardLayout>
    );
};

export default EmployeeProfile;
