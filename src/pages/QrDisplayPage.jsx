import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import Header from "../components/Header";

function QrDisplayPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, id } = location.state || {}; // Get batch data

  console.log(name, id);

  const [qrData, setQrData] = useState({});
  const [progress, setProgress] = useState(100); // Start at 100%

  const generateQrData = () => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 10 * 1000); // QR expires in 10 seconds

    const data = {
      batchId: id,
      startTime,
      endTime,
    };

    console.log("QR Data:", data);
    setQrData(data);
    setProgress(100); // Reset progress
  };

  useEffect(() => {
    generateQrData(); // Generate initial QR data

    const qrInterval = setInterval(() => {
      generateQrData(); // Refresh QR every 10 seconds
    }, 10000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 10 : 0)); // Reduce progress bar every second
    }, 1000);

    return () => {
      clearInterval(qrInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const goToHome = () => {
    navigate('/');
  };

  // Get progress color based on remaining time
  const getProgressColor = () => {
    if (progress > 70) return "bg-green-500";
    if (progress > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <Header/>
      <div className=" bg-gray-50 ">
        {/* Back to Home Button */}
        <button 
          onClick={goToHome} 
          className="fixed left-8  flex items-center bg-white rounded-lg px-4 py-2 shadow-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
        
        {/* QR Code Container */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-16">
          {/* Batch Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
            <h2 className="text-2xl font-bold">{name || "Attendance QR"}</h2>
            
          </div>

          {/* QR Code Display */}
          <div className="p-6 flex flex-col items-center">
            <div className="bg-white p-6 rounded-lg shadow-inner border border-gray-200">
              <QRCodeCanvas
                value={qrData && Object.keys(qrData).length > 0 ? JSON.stringify(qrData) : "Generating..."}
                size={580}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={true}
              />
            </div>
            
            {/* Timer and Progress */}
            <div className="mt-6 w-full max-w-md">
              {/* Timer Display */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Refreshes automatically</span>
                <span className="text-lg font-bold text-gray-700">{Math.ceil(progress / 10)}s remaining</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${getProgressColor()}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Instructions */}
              <p className="mt-4 text-center text-gray-600">
                Scan the QR code with your device to mark your attendance
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default QrDisplayPage;