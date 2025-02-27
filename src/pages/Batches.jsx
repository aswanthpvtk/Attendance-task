import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DNA } from "react-loader-spinner";
import { Users, Calendar, ChevronRight, Search, X, Clock, MapPin } from "lucide-react";
import { getBatches } from "../services/allApi";

const Batches = () => {
    const [batches, setBatches] = useState([]);
    const [filteredBatches, setFilteredBatches] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) throw new Error("User not authenticated!");

                const response = await getBatches(token);
                if (response.error) {
                    setError(response.message);
                } else {
                    setBatches(response.data);
                    setFilteredBatches(response.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setTimeout(() => setLoading(false), 2000);
            }
        };

        fetchBatches();
    }, []);

    useEffect(() => {
        setFilteredBatches(
            batches.filter(batch => batch.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, batches]);

    const formatDate = (isoDate) => {
        if (!isoDate) return "N/A";
        return new Date(isoDate).toLocaleDateString("en-GB");
    };

    const formatTime = (timeString) => {
        if (!timeString) return "N/A";
        
        if (timeString.includes(":")) return timeString;
        
        try {
            const [hours, minutes] = timeString.split(":");
            return `${hours}:${minutes || "00"}`;
        } catch (error) {
            return timeString;
        }
    };

    const getBatchStatus = (startDate, endDate, currentStatus) => {
        const today = new Date();
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && start > today) {
            return "Upcoming";
        }
        
        if (start && start <= today && (!end || end >= today)) {
            return "Active";
        }
        
        if (end && end < today) {
            return "Completed";
        }

        return currentStatus || "Upcoming";
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-100 text-green-700 border-green-200";
            case "upcoming":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "completed":
                return "bg-gray-100 text-gray-700 border-gray-200";
            case "cancelled":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getLocationName = (batchLocation) => {
        return batchLocation?.label || "N/A";
    };

    const handleBatchClick = (batch) => {
        navigate(`/batches/details`, { state: { batch, batchName: batch.name } });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <DNA visible={true} height="80" width="80" ariaLabel="dna-loading" />
                <p className="mt-4 text-gray-500 font-medium">Loading batches...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-md p-8 bg-white rounded-xl shadow-md text-center">
                <div className="text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Error Loading Batches</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Batches</h2>
                        {/* <p className="text-gray-500 mt-1">Manage and view all your training batches</p> */}
                    </div>
                    
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400" size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search batches..."
                            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setSearchTerm("")}
                            >
                                <X className="text-gray-400 hover:text-gray-600" size={16} />
                            </button>
                        )}
                    </div>
                </div>
                
                {filteredBatches.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                            <Search className="text-gray-400" size={20} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No batches found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {searchTerm 
                                ? `No batches matching "${searchTerm}". Try using different keywords or clear the search.` 
                                : "There are no batches available. Check back later or create a new batch."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredBatches.map((batch) => {
                            const batchStatus = getBatchStatus(batch.startDate, batch.endDate, batch.status);
                            const studentCount = (batch.filledOfflineSeats || 0) + (batch.filledOnlineSeats || 0);
                        
                            return (
                                <div
                                    key={batch.id}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 flex flex-col cursor-pointer group"
                                    onClick={() => handleBatchClick(batch)}
                                >
                                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between border-b border-gray-200">
                                        <h3 className="text-base font-bold text-gray-800 truncate">
                                            {batch.name}
                                        </h3>
                                        <div className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusColor(batchStatus)}`}>
                                            {batchStatus}
                                        </div>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-blue-500 shrink-0" />
                                            <div className="truncate">
                                                <div className="text-xs text-gray-500">Students</div>
                                                <div className="text-sm font-medium text-gray-800">{studentCount || "0"}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-blue-500 shrink-0" />
                                            <div className="truncate">
                                                <div className="text-xs text-gray-500">Start Date</div>
                                                <div className="text-sm font-medium text-gray-800">{formatDate(batch.startDate)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-blue-500 shrink-0" />
                                            <div className="truncate">
                                                <div className="text-xs text-gray-500">Time</div>
                                                <div className="text-sm font-medium text-gray-800">{formatTime(batch.time)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-blue-500 shrink-0" />
                                            <div className="truncate">
                                                <div className="text-xs text-gray-500">Location</div>
                                                <div className="text-sm font-medium text-gray-800">{getLocationName(batch.batchLocation)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex justify-end items-center group-hover:bg-blue-50 transition-colors">
                                        <span className="text-xs font-medium text-blue-600 mr-1">View details</span>
                                        <ChevronRight size={14} className="text-blue-600" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Batches;