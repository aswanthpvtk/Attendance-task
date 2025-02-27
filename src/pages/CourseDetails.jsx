import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { QrCode, Calendar, Clock, MapPin, School, Users, CreditCard, Building, DollarSign,IndianRupee } from "lucide-react";
import Header from "../components/Header";

const CourseDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [batchData, setBatchData] = useState(null);

  useEffect(() => {
    if (location.state?.batch) {
      setBatchData(location.state.batch);
    } else if (id) {
      const fetchBatchById = async () => {
        try {
          // Placeholder for API call: const data = await getBatchById(id);
          // setBatchData(data);
          console.log("Would fetch batch with ID:", id);
        } catch (error) {
          console.error("Error fetching batch data:", error);
        }
      };

      fetchBatchById();
    }
  }, [id, location.state]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!batchData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-lg font-medium text-gray-500">Loading course details...</div>
      </div>
    );
  }

  return (
    <>
     
      <div className="p-6">
        <div className="mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-24 p-6 bg-gradient-to-r from-green-50 to-blue-50">
            <h2 className="text-2xl font-bold text-gray-800">{batchData.name}</h2>
            <p className="text-sm text-gray-600">
              Course ID: {batchData.id || batchData._id}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Main Course Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                <Calendar className="text-blue-500 mr-3 mt-1" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                  <p className="text-lg font-semibold text-gray-700">{batchData.duration || "N/A"}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                <Users className="text-blue-500 mr-3 mt-1" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Capacity</h3>
                  <p className="text-lg font-semibold text-gray-700">
                    Offline: {batchData.offlineCapacity || 0} / Online: {batchData.onlineCapacity || 0}
                  </p>
                  <p className="text-sm text-gray-500">
                    Filled: {batchData.filledOfflineSeats || 0} offline, {batchData.filledOnlineSeats || 0} online
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                <Clock className="text-blue-500 mr-3 mt-1" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Schedule</h3>
                  <p className="text-lg font-semibold text-gray-700">{batchData.time || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Dates and Fees Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                <Calendar className="text-blue-500 mr-3 mt-1" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Course Period</h3>
                  <p className="text-lg font-semibold text-gray-700">
                    {formatDate(batchData.startDate)} - {formatDate(batchData.endDate)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex items-start">
              <IndianRupee className="text-blue-500 mr-3 mt-1" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Fees Structure</h3>
                  <p className="text-lg font-semibold text-gray-700">
                    Course Fee: ₹{batchData.courseFees?.toLocaleString() || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Admission Fee: ₹{batchData.admissionFees?.toLocaleString() || "N/A"} | 
                    EMI Available: ₹{batchData.emiFees?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-start">
              <MapPin className="text-blue-500 mr-3 mt-1" size={20} />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <p className="text-gray-700">
                    <span className="font-medium">Center:</span> {batchData.batchLocation?.label || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Building:</span> {batchData.batchBuilding?.label || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Classroom:</span> {batchData.batchClassroom?.label || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Modes */}
            {batchData.courseMode && batchData.courseMode.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Course Modes</h3>
                <div className="flex flex-wrap gap-2">
                  {batchData.courseMode.map((mode, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {mode.label || mode.value || "Mode " + (index + 1)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trainers */}
            {batchData.trainers && batchData.trainers.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Trainers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {batchData.trainers.map((trainer, index) => (
                    <div key={index} className="flex items-center p-2 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                        <School size={18} />
                      </div>
                      <div>
                        <p className="font-medium">{trainer.name || "Trainer " + (index + 1)}</p>
                        {trainer.email && <p className="text-sm text-gray-500">{trainer.email}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-between gap-4 pt-4 border-t border-gray-200">
              <button
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                onClick={() => navigate("/qr", { state: { name: batchData.name, id: batchData._id || batchData.id } })}
              >
                <QrCode size={20} />
                <span className="font-medium">Attendance QR Code</span>
              </button>
              
              <button
                className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition-colors"
                onClick={() => navigate("/batches/details/attendance", { state: { name: batchData.name, id: batchData._id || batchData.id } })}
              >
                <Users size={20} />
                <span className="font-medium">View Attendance Records</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;