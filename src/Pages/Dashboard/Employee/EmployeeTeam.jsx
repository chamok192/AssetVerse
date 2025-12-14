import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../../Services/api';
import EmployeeDashboardLayout from './EmployeeDashboardLayout';

const EmployeeTeam = () => {
    const [selectedCompany, setSelectedCompany] = useState('');

    const { data: employees = [], isLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const result = await getUsers();
            return result.success ? (Array.isArray(result.data) ? result.data : []) : [];
        }
    });

    const companies = useMemo(() => {
        const uniqueCompanies = new Set(employees.map(emp => emp.company).filter(Boolean));
        return Array.from(uniqueCompanies);
    }, [employees]);

    const companiesEmployees = useMemo(() => {
        if (!selectedCompany) return [];
        return employees.filter(emp => emp.company === selectedCompany && emp.role === 'Employee');
    }, [employees, selectedCompany]);

    const getCurrentMonthBirthdays = (employees) => {
        const currentMonth = new Date().getMonth();
        return employees.filter(emp => {
            if (!emp.dateOfBirth) return false;
            const empMonth = new Date(emp.dateOfBirth).getMonth();
            return empMonth === currentMonth;
        });
    };

    const upcomingBirthdays = getCurrentMonthBirthdays(companiesEmployees);

    if (isLoading) {
        return (
            <EmployeeDashboardLayout title="My Team" subtitle="View your team members and upcoming birthdays.">
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </EmployeeDashboardLayout>
        );
    }

    return (
        <EmployeeDashboardLayout title="My Team" subtitle="View your team members and upcoming birthdays.">
            <div className="space-y-8">
                <div>
                    <label className="label">
                        <span className="label-text font-medium">Select Company</span>
                    </label>
                    <select
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        className="select select-bordered w-full sm:w-64"
                    >
                        <option value="">Choose a company</option>
                        {companies.map((company) => (
                            <option key={company} value={company}>
                                {company}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCompany && (
                    <>
                        <div>
                            <h3 className="mb-6 text-lg font-bold">Team Members</h3>
                            {companiesEmployees.length === 0 ? (
                                <div className="rounded-lg bg-base-200 p-8 text-center">
                                    <p className="text-base-content/60">No team members in this company</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {companiesEmployees.map((employee) => (
                                        <div key={employee._id} className="rounded-lg border border-base-300 bg-base-100 p-6 shadow">
                                            <div className="mb-4 flex justify-center">
                                                <img
                                                    src={employee.profileImage || employee.photo || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23e0e0e0" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="12" fill="%23999" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'}
                                                    alt={employee.name}
                                                    className="h-24 w-24 rounded-full object-cover"
                                                />
                                            </div>
                                            <h4 className="text-center text-lg font-bold">{employee.name}</h4>
                                            <p className="text-center text-sm text-base-content/60">{employee.position || 'Employee'}</p>
                                            <p className="mt-2 text-center text-sm">{employee.email}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {upcomingBirthdays.length > 0 && (
                            <div className="rounded-lg bg-blue-50 p-6">
                                <h3 className="mb-4 text-lg font-bold">Upcoming Birthdays (This Month)</h3>
                                <div className="space-y-3">
                                    {upcomingBirthdays.map((employee) => (
                                        <div key={employee._id} className="flex items-center gap-4 rounded-lg bg-white p-4">
                                            <div className="text-3xl">🎂</div>
                                            <div>
                                                <p className="font-semibold">{employee.name}</p>
                                                <p className="text-sm text-base-content/60">
                                                    {new Date(employee.dateOfBirth).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </EmployeeDashboardLayout>
    );
};

export default EmployeeTeam;
