import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmployees, removeEmployee } from "../../Services/api";
import DashboardLayout from "./DashboardLayout";

const EmployeeList = () => {
    const queryClient = useQueryClient();
    const [removingId, setRemovingId] = useState(null);

    const hrProfile = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("userData")) || {};
        } catch {
            return {};
        }
    }, []);

    const limit = hrProfile.packageLimit || hrProfile.package || hrProfile.planLimit || 0;

    // Fetch employees using TanStack Query
    const { data: employees = [], isLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const result = await getEmployees();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        }
    });

    // Mutation for removing an employee
    const removeEmployeeMutation = useMutation({
        mutationFn: removeEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            setRemovingId(null);
        }
    });

    const handleRemove = (employeeId) => {
        const confirmed = window.confirm("Remove this employee from the team?");
        if (!confirmed) return;
        setRemovingId(employeeId);
        removeEmployeeMutation.mutate(employeeId);
    };

    return (
        <DashboardLayout
            title="Employees"
            subtitle={`${employees.length}/${limit || employees.length || 0} employees used.`}
        >
            {removeEmployeeMutation.error && (
                <div className="alert alert-error shadow">
                    <span>{removeEmployeeMutation.error?.message || "Failed to remove employee"}</span>
                </div>
            )}

            <div className="overflow-x-auto rounded-box bg-base-100 shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Photo</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Join Date</th>
                            <th>Assets Count</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={6} className="py-6 text-center">
                                    <span className="loading loading-spinner"></span>
                                </td>
                            </tr>
                        )}

                        {!isLoading && employees.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-6 text-center text-base-content/70">
                                    No employees found.
                                </td>
                            </tr>
                        )}

                        {!isLoading && employees.map((employee) => (
                            <tr key={employee._id} className="hover">
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle h-12 w-12 bg-base-200">
                                            <img
                                                src={employee.photo || employee.avatar || "https://via.placeholder.com/100"}
                                                alt={employee.name || "Employee"}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="font-semibold">{employee.name || "Unknown"}</td>
                                <td>{employee.email || "-"}</td>
                                <td>{employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : "-"}</td>
                                <td>{employee.assetsCount ?? employee.assets?.length ?? 0}</td>
                                <td className="text-right">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline btn-error"
                                        onClick={() => handleRemove(employee._id)}
                                        disabled={removingId === employee._id || removeEmployeeMutation.isPending}
                                    >
                                        {removingId === employee._id || removeEmployeeMutation.isPending ? "Removing..." : "Remove from Team"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default EmployeeList;
