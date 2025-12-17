import HRProfile from "../Pages/Dashboard/HR/HRProfile";
import EmployeeProfile from "../Pages/Dashboard/Employee/EmployeeProfile";

const ProfileRouter = () => {
    const role = JSON.parse(localStorage.getItem("userData") || "{}").role?.toLowerCase();
    return role === "hr" ? <HRProfile /> : <EmployeeProfile />;
};

export default ProfileRouter;
