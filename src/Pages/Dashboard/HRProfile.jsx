import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../../FireBase/firebase.init";
import { updateUser, getUserByEmail } from "../../Services/api";
import DashboardLayout from "./DashboardLayout";

const HRProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
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
                        companyName: result.data.companyName || userData.companyName || "",
                        companyLogo: result.data.companyLogo || userData.companyLogo || "",
                        profileImage: result.data.profileImage || currentUser.photoURL || "",
                        packageLimit: result.data.packageLimit || userData.packageLimit || 0,
                        currentEmployees: result.data.currentEmployees || userData.currentEmployees || 0,
                        subscription: result.data.subscription || userData.subscription || "basic",
                        dateOfBirth: result.data.dateOfBirth || userData.dateOfBirth || ""
                    });
                } else {
                    setProfile(userData);
                    setForm({
                        name: userData.name || currentUser.displayName || "",
                        email: userData.email || currentUser.email || "",
                        companyName: userData.companyName || "",
                        companyLogo: userData.companyLogo || "",
                        profileImage: userData.profileImage || currentUser.photoURL || "",
                        packageLimit: userData.packageLimit || 0,
                        currentEmployees: userData.currentEmployees || 0,
                        subscription: userData.subscription || "basic",
                        dateOfBirth: userData.dateOfBirth || ""
                    });
                }
                setError("");
            } catch (err) {
                setError("Failed to load profile");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
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

            const result = await updateUser(currentUser.uid, form);
            if (result.success) {
                setProfile(form);
                setEditing(false);
                localStorage.setItem("userData", JSON.stringify(form));
            } else {
                setError(result.error || "Failed to save profile");
            }
        } catch (err) {
            setError("Error saving profile");
            console.error(err);
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
                                    src={form.profileImage || "https://via.placeholder.com/200"}
                                    alt={form.name || "Profile"}
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">{form.name || "User"}</h2>
                            <p className="text-sm text-base-content/60">{form.email}</p>
                            <div className="mt-2">
                                <span className="badge badge-primary capitalize">{form.subscription}</span>
                            </div>
                        </div>
                    </div>

                    {form.companyLogo && (
                        <div className="mt-6 flex justify-center">
                            <div className="avatar">
                                <div className="w-20 rounded-lg border-2 border-base-300 bg-base-200">
                                    <img src={form.companyLogo} alt={form.companyName || "Company"} />
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
                                            subscription: profile.subscription || "basic",
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
                                <span className="label-text font-semibold">Profile Image URL</span>
                            </div>
                            <input
                                type="url"
                                className="input input-bordered"
                                value={form.profileImage}
                                onChange={(e) => handleChange("profileImage", e.target.value)}
                                disabled={!editing}
                                placeholder="https://i.ibb.co/..."
                            />
                        </label>

                        <label className="form-control md:col-span-2">
                            <div className="label">
                                <span className="label-text font-semibold">Company Logo URL</span>
                            </div>
                            <input
                                type="url"
                                className="input input-bordered"
                                value={form.companyLogo}
                                onChange={(e) => handleChange("companyLogo", e.target.value)}
                                disabled={!editing}
                                placeholder="https://i.ibb.co/..."
                            />
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
                        <span className="badge badge-success">{form.subscription}</span>
                    </p>
                    <p className="mt-1 text-xs text-base-content/60">active plan</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HRProfile;
