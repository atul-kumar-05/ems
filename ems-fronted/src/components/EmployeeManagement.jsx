import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Edit3, Trash2, User, Mail, Phone, DollarSign, Building, X, Check, LogOut, Eye, EyeOff
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080'; // Update with your backend URL

const EmployeeManagement = () => {
    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // Login form state
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [loginError, setLoginError] = useState('');

    // Employee state
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        salary: '',
        role: '',
        department: ''
    });
    const [formError, setFormError] = useState('');

    const departments = [
        'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'
    ];
    const roles = [
        'Software Engineer', 'Senior Software Engineer', 'Product Manager', 'UX Designer',
        'Marketing Manager', 'Sales Representative', 'HR Manager', 'Financial Analyst'
    ];

    // API utility functions
    const apiCall = async (endpoint, options = {}) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && token !== 'null' && token !== 'undefined' && { 'Authorization': `Bearer ${token}` })
            },
            ...options
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            if (response.status === 401) {
                handleLogout();
                throw new Error('Unauthorized');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    };

    // Authentication functions
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const text = await response.text();
            let data = {};
            try {
                data = JSON.parse(text);
            } catch {
                setLoginError('Invalid response from server.');
                setLoading(false);
                return;
            }

            if (response.ok && data.jwtToken) {
                setToken(data.jwtToken);
                localStorage.setItem('token', data.jwtToken);
                setIsAuthenticated(true);
            } else {
                setLoginError(data.message || 'Login failed');
            }
        } catch (error) {
            setLoginError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setEmployees([]);
    };

    // Employee CRUD functions
    const fetchEmployees = async () => {
        try {
            const data = await apiCall('/employees/');
            setEmployees(data);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    };

    const createEmployee = async (employeeData) => {
        try {
            const data = await apiCall('/employees/', {
                method: 'POST',
                body: JSON.stringify(employeeData)
            });
            setEmployees([...employees, data]);
            return data;
        } catch (error) {
            throw new Error(error.message || 'Failed to create employee');
        }
    };

    const updateEmployee = async (id, employeeData) => {
        try {
            const data = await apiCall(`/employees/${id}`, {
                method: 'PUT',
                body: JSON.stringify(employeeData)
            });
            setEmployees(employees.map(emp => emp.id === id ? data : emp));
            return data;
        } catch (error) {
            throw new Error(error.message || 'Failed to update employee');
        }
    };

    const deleteEmployee = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) {
            return;
        }

        try {
            await apiCall(`/employees/${id}`, {
                method: 'DELETE'
            });
            setEmployees(employees.filter(emp => emp.id !== id));
        } catch (error) {
            alert('Failed to delete employee: ' + error.message);
        }
    };

    // Form handling
    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            salary: '',
            role: '',
            department: ''
        });
        setEditingEmployee(null);
        setFormError('');
    };

    const openModal = (employee = null) => {
        if (employee) {
            setFormData({
                firstName: employee.firstName,
                lastName: employee.lastName,
                phone: employee.phone,
                email: employee.email,
                salary: employee.salary.toString(),
                role: employee.role,
                department: employee.department
            });
            setEditingEmployee(employee);
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setLoading(true);

        try {
            const employeeData = {
                ...formData,
                salary: parseFloat(formData.salary)
            };

            if (editingEmployee) {
                await updateEmployee(editingEmployee.id, employeeData);
            } else {
                await createEmployee(employeeData);
            }

            closeModal();
        } catch (error) {
            setFormError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Check for existing token on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken && savedToken !== 'null' && savedToken !== 'undefined') {
            setToken(savedToken);
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, []);

    // Fetch employees when authenticated
    useEffect(() => {
        if (isAuthenticated && token) {
            fetchEmployees();
        }
        // eslint-disable-next-line
    }, [isAuthenticated, token]);

    // Filter employees based on search
    const filteredEmployees = employees.filter(employee =>
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatSalary = (salary) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(salary);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
                <span className="text-white text-xl font-bold">Loading...</span>
            </div>
        );
    }

    // Login screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                    <div className="text-center mb-8">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your employee management account</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                required
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {loginError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Main dashboard
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
                            <p className="text-gray-600">Manage your team members and their information</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full sm:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={() => openModal()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add Employee
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Employees</p>
                                <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Departments</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {new Set(employees.map(emp => emp.department)).size}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Building className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Avg Salary</p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {employees.length > 0 ? formatSalary(employees.reduce((acc, emp) => acc + emp.salary, 0) / employees.length) : '$0'}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <DollarSign className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Roles</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {new Set(employees.map(emp => emp.role)).size}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <Check className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employee Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Employee</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Department</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Salary</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {employee.firstName} {employee.lastName}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {employee.email}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                {employee.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{employee.role}</td>
                                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {employee.department}
                      </span>
                                    </td>
                                    <td className="py-4 px-6 font-semibold text-gray-900">{formatSalary(employee.salary)}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openModal(employee)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Edit Employee"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteEmployee(employee.id)}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                title="Delete Employee"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredEmployees.length === 0 && (
                        <div className="text-center py-12">
                            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
                            <p className="text-gray-600">
                                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first employee'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Employee Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                                    </h2>
                                    <button
                                        onClick={closeModal}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter first name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter last name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter email address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Salary *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.salary}
                                            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter salary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Role *
                                        </label>
                                        <select
                                            required
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select Role</option>
                                            {roles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Department *
                                        </label>
                                        <select
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {formError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                        {formError}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                                    >
                                        {loading ? 'Processing...' : (editingEmployee ? 'Update Employee' : 'Add Employee')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeManagement;