import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmployees, removeEmployee, getUserByEmail } from "../../../Services/api";
import DashboardLayout from "./DashboardLayout";
import { toast } from 'react-toastify';
import { useAuth } from "../../../Contents/AuthContext/useAuth";

const EmployeeList = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [removingId, setRemovingId] = useState(null);
    const { user: hrProfile, load } = useAuth();

    const limit = hrProfile?.packageLimit || 5;
    const currentCount = hrProfile?.currentEmployees || 0;
    const isLimitReached = currentCount >= limit;

    const [page, setPage] = useState(1);
    const pageLimit = 10;


    const { data: queryData = { data: [], totalPages: 1 }, isLoading } = useQuery({
        queryKey: ['employees', page],
        queryFn: async () => {
            const result = await getEmployees(page, pageLimit);
            return {
                data: result.success ? result.data : [],
                totalPages: result.totalPages || 1
            };
        },
        keepPreviousData: true
    });

    const employees = queryData.data;
    const totalPages = queryData.totalPages;


    const removeEmployeeMutation = useMutation({
        mutationFn: removeEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            setRemovingId(null);
            toast.success('Employee removed from team successfully!');
        },
        onError: (error) => toast.error(error.message || 'Failed to remove employee')
    });

    const handleRemove = (employeeId) => {
        const confirmed = window.confirm("Remove this employee from the team?");
        if (!confirmed) return;
        setRemovingId(employeeId);
        removeEmployeeMutation.mutate(employeeId);
    };

    if (load) {
        return (
            <DashboardLayout title="Employees" subtitle="Loading...">
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Employees"
            subtitle={`${currentCount}/${limit} employees used.`}
        >
            {isLimitReached && (
                <div className="alert alert-warning mb-6 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <div>
                        <h3 className="font-bold">Plan Limit Reached!</h3>
                        <div className="text-xs">Your current plan limit of {limit} employees has been reached. You cannot add new members until you upgrade.</div>
                    </div>
                    <button className="btn btn-sm" onClick={() => navigate('/hr/upgrade')}>Upgrade Plan</button>
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
                                                src={employee.profileImage || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e0e0e0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"}
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

            <div className="flex justify-center mt-6">
                <div className="join">
                    <button
                        className="join-item btn"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        «
                    </button>
                    <button className="join-item btn">Page {page} of {totalPages}</button>
                    <button
                        className="join-item btn"
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        »
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmployeeList;
