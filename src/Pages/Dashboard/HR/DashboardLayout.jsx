import { NavLink, useNavigate } from "react-router";
import { logoutUser } from "../../../Auth/authService";

const sidebarLinks = [
    { label: "Dashboard", to: "/hr/assets", exact: true },
    { label: "Add Asset", to: "/hr/assets/new" },
    { label: "Requests", to: "/hr/requests" },
    { label: "Employees", to: "/hr/employees" },
    { label: "Upgrade", to: "/hr/upgrade" },
    { label: "Profile", to: "/profile" }
];

const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
        isActive ? "bg-primary text-primary-content shadow" : "hover:bg-base-200"
    }`;

const DashboardLayout = ({ title, subtitle, children }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    return (
        <section className="min-h-screen bg-base-200">
            <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                    <aside className="rounded-2xl bg-base-100 p-4 shadow lg:sticky lg:top-6 lg:h-fit">
                        <div className="mb-4">
                            <p className="text-xs uppercase text-base-content/60">Dashboard</p>
                            <p className="text-lg font-bold">Control Center</p>
                        </div>
                        <nav className="space-y-1">
                            {sidebarLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={Boolean(link.exact)}
                                    className={linkClass}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>
                        <button
                            type="button"
                            className="btn btn-outline btn-sm mt-4 w-full"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </aside>

                    <div className="space-y-6">
                        {(title || subtitle) && (
                            <header className="rounded-2xl bg-base-100 p-5 shadow">
                                {title && <h1 className="text-3xl font-bold">{title}</h1>}
                                {subtitle && <p className="text-sm text-base-content/70 mt-1">{subtitle}</p>}
                            </header>
                        )}
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardLayout;
