import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { login } from "../services/allApi";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logo.jpeg";

function Login({ onLogin }) {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await login(formData);

            if (response?.error) {
                toast.error(response.message || "Login failed!", { position: "top-right" });
            } else {
                const userDetails = response.data;
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("access_token", userDetails.access_token);
                localStorage.setItem("email", userDetails.user.email);
                localStorage.setItem("username", userDetails.user.username);

                toast.success("Login successful!", { position: "top-right" });

                if (onLogin) {
                    onLogin();
                } else {
                    console.error("onLogin function is not defined");
                }

                navigate("/");
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error("An error occurred. Please try again.", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <div className='flex justify-center'>
                        <img className='me-1' src={logo} style={{ height: "50px", width: '50px' }} alt="Luminar Technolab Logo" />
                        <span className="bg-gradient-to-r mt-1 from-purple-700 to-blue-600 bg-clip-text text-transparent" style={{ fontSize: '25px',fontWeight:'600' }}>
                            Luminar Technolab

                        </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                        bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Login;
