import React, { useState, useEffect } from "react";
import {
  ArrowUpDown,
  Calendar,
  Users,
  AlertCircle,
  Download,
  Filter,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Info,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { batchByAttendace } from "../services/allApi";

const AttendanceSheet = () => {
  const [data, setData] = useState(null);
  const [studentsWithPercentage, setStudentsWithPercentage] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateList, setDateList] = useState([]);
  const [filteredDateList, setFilteredDateList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ studentId: null, studentName: "", date: "", remark: "", status: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [viewAttendanceModal, setViewAttendanceModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const datesPerPage = 7;
  const location = useLocation();
  const { id, batch } = location.state || { id: "mock-batch-id", batch: { name: "Sample Batch" } };

  useEffect(() => {
    if (id) fetchAttendanceData(id);
  }, [id]);

  const fetchAttendanceData = async (batchId) => {
    try {
      setLoading(true);
      const response = await batchByAttendace(batchId);
      if (response.data && response.data.attendance) {
        const { batch_id, total_students, attendance } = response.data;
        const allDates = [...new Set(attendance.flatMap((student) => student.attendance.map((record) => record.date)))]
          .sort((a, b) => new Date(b) - new Date(a)); // Newest to oldest
        setDateList(allDates);
        setFilteredDateList(allDates);

        const students = attendance.map((student) => ({
          id: student.student_id,
          name: student.student_name,
          attendance: student.attendance || [],
        }));

        setData({ batch_id, total_students, students });
        setStudentsWithPercentage(calculatePercentage(students, allDates));
      } else {
        throw new Error("Invalid data received from API.");
      }
    } catch (error) {
      setError(error.message || "Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (students, dates) => {
    return students.map((student) => {
      const filteredAttendance = student.attendance.filter((record) => dates.includes(record.date));
      const presentCount = filteredAttendance.filter((record) => record.status.toLowerCase() === "present").length;
      const totalDays = filteredAttendance.length;
      const percentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(1) : "0.0";
      return {
        ...student,
        attendancePercentage: percentage,
        attendanceStatus: parseFloat(percentage) < 75 ? "poor" : parseFloat(percentage) < 90 ? "average" : "good",
      };
    });
  };

  const filterByDateRange = () => {
    if (!startDate || !endDate) {
      setFilteredDateList(dateList);
      setStudentsWithPercentage(calculatePercentage(data.students, dateList));
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      // Optionally, you could set an error state here to notify the user
      return;
    }

    const filteredDates = dateList.filter((date) => {
      const current = new Date(date);
      return current >= start && current <= end;
    });

    setFilteredDateList(filteredDates);
    setStudentsWithPercentage(calculatePercentage(data.students, filteredDates));
    setCurrentPage(0); // Reset to first page when filtering
  };

  useEffect(() => {
    if (data) filterByDateRange();
  }, [startDate, endDate, data]);

  const sortData = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredStudents = studentsWithPercentage.filter((student) =>
    student.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (sortConfig.key === "attendancePercentage") {
      return sortConfig.direction === "asc"
        ? parseFloat(a[sortConfig.key]) - parseFloat(b[sortConfig.key])
        : parseFloat(b[sortConfig.key]) - parseFloat(a[sortConfig.key]);
    }
    return sortConfig.direction === "asc"
      ? a[sortConfig.key].localeCompare(b[sortConfig.key])
      : b[sortConfig.key].localeCompare(a[sortConfig.key]);
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  const getAttendanceStatusForDate = (student, date) => {
    const record = student.attendance.find((a) => a.date === date);
    if (!record) return null;
    const status = record.status.toLowerCase();
    return {
      status,
      remark: record.remark || "",
      className:
        status === "present"
          ? "bg-green-100 text-green-800 border-green-200"
          : status === "absent"
          ? "bg-red-100 text-red-800 border-red-200"
          : "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
  };

  const toggleAttendance = (studentId, date) => {
    const student = studentsWithPercentage.find((s) => s.id === studentId);
    const record = student?.attendance.find((a) => a.date === date);
    setModalData({
      studentId,
      studentName: student.name,
      date,
      remark: record?.remark || "",
      status: record?.status.toLowerCase() === "present" ? "absent" : "present",
    });
    setShowModal(true);
  };

  const updateAttendanceStatus = (studentId, date, status, remark) => {
    setStudentsWithPercentage((prev) => {
      const newStudents = [...prev];
      const studentIndex = newStudents.findIndex((s) => s.id === studentId);
      if (studentIndex === -1) return prev;
      const student = { ...newStudents[studentIndex] };
      const attendanceIndex = student.attendance.findIndex((a) => a.date === date);
      if (attendanceIndex !== -1) {
        student.attendance[attendanceIndex] = { ...student.attendance[attendanceIndex], status, remark };
      }
      newStudents[studentIndex] = student;
      return calculatePercentage(newStudents, filteredDateList);
    });
  };

  const handleModalSubmit = () => {
    const { studentId, date, status, remark } = modalData;
    updateAttendanceStatus(studentId, date, status, remark);
    setShowModal(false);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Attendance %", ...filteredDateList.map((d) => formatDate(d))];
    const rows = sortedStudents.map((student) => [
      student.name,
      `${student.attendancePercentage}%`,
      ...filteredDateList.map((date) => getAttendanceStatusForDate(student, date)?.status || "N/A"),
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_${batch?.name || data?.batch_id || "data"}_${startDate || "all"}_to_${endDate || "all"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewStudentAttendance = (student) => {
    setSelectedStudent(student);
    setViewAttendanceModal(true);
  };

  const totalPages = Math.ceil(filteredDateList.length / datesPerPage);
  const paginatedDates = filteredDateList.slice(currentPage * datesPerPage, (currentPage + 1) * datesPerPage);

  const nextPage = () => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 0 && setCurrentPage(currentPage - 1);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md flex items-center gap-2">
          <AlertCircle size={20} />
          <span>Error: {error}</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Attendance Sheet</h1>
            <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
              <Users size={16} className="text-gray-500" />
              {batch?.name || "Batch"} ({data?.total_students || 0} students)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="From Date"
                  className="w-full sm:w-40 pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">From</label>
              </div>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="To Date"
                  className="w-full sm:w-40 pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">To</label>
              </div>
            </div>
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filter by name..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
              />
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        {data ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 max-h-[70vh] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase tracking-wide sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-left min-w-[200px] border-b border-gray-200" onClick={() => sortData("name")}>
                    <div className="flex items-center gap-2 cursor-pointer">
                      Name
                      <ArrowUpDown size={14} className={sortConfig.key === "name" ? "text-blue-600" : "text-gray-400"} />
                    </div>
                  </th>
                  <th
                    className="p-4 text-left min-w-[120px] border-b border-gray-200"
                    onClick={() => sortData("attendancePercentage")}
                  >
                    <div className="flex items-center gap-2 cursor-pointer">
                      Attendance %
                      <ArrowUpDown
                        size={14}
                        className={sortConfig.key === "attendancePercentage" ? "text-blue-600" : "text-gray-400"}
                      />
                    </div>
                  </th>
                  {selectedDate ? (
                    <th className="p-4 text-center border-b border-gray-200">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        {formatDate(selectedDate)}
                        <button
                          onClick={() => setSelectedDate(null)}
                          className="ml-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md"
                        >
                          View All
                        </button>
                      </div>
                    </th>
                  ) : (
                    <>
                      {paginatedDates.map((date) => (
                        <th key={date} className="p-4 text-center min-w-[100px] border-b border-gray-200">
                          <button onClick={() => setSelectedDate(date)} className="hover:text-blue-600 transition-colors">
                            {formatDate(date)}
                          </button>
                        </th>
                      ))}
                      <th className="p-4 text-center min-w-[80px] border-b border-gray-200">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800 min-w-[200px]">{student.name}</td>
                    <td className="p-4 min-w-[120px]">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          student.attendanceStatus === "poor"
                            ? "bg-red-100 text-red-800"
                            : student.attendanceStatus === "average"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {student.attendancePercentage}%
                      </span>
                    </td>
                    {selectedDate ? (
                      <td className="p-4 text-center">
                        {(() => {
                          const status = getAttendanceStatusForDate(student, selectedDate);
                          return status ? (
                            <div className="flex flex-col items-center gap-1">
                              <button
                                onClick={() => toggleAttendance(student.id, selectedDate)}
                                className={`px-3 py-1 rounded-md text-xs font-medium border ${status.className} hover:opacity-80 transition-opacity`}
                              >
                                {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          );
                        })()}
                      </td>
                    ) : (
                      <>
                        {paginatedDates.map((date) => {
                          const status = getAttendanceStatusForDate(student, date);
                          return (
                            <td key={date} className="p-4 text-center min-w-[100px]">
                              {status ? (
                                <button
                                  onClick={() => toggleAttendance(student.id, date)}
                                  className={`px-3 py-1 rounded-md text-xs font-medium border ${status.className} hover:opacity-80 transition-opacity`}
                                >
                                  {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                                </button>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="p-4 text-center min-w-[80px]">
                          <button
                            onClick={() => viewStudentAttendance(student)}
                            className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
                          >
                            <Info size={16} />
                            Details
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {sortedStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={selectedDate ? 3 : paginatedDates.length + 3}
                      className="p-6 text-center text-gray-500"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!selectedDate && filteredDateList.length > datesPerPage && (
              <div className="flex justify-between items-center p-4 bg-gray-50 border-t sticky bottom-0 z-10">
                <span className="text-sm text-gray-600">
                  Dates {currentPage * datesPerPage + 1} to{" "}
                  {Math.min((currentPage + 1) * datesPerPage, filteredDateList.length)} of {filteredDateList.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="p-2 rounded-md bg-white border border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= totalPages - 1}
                    className="p-2 rounded-md bg-white border border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-xl shadow-md border border-gray-100">
            <Users size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No attendance data available.</p>
          </div>
        )}

        {/* Update Attendance Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Update Attendance</h2>
                <p className="text-sm text-gray-600">
                  {modalData.studentName} - {formatDate(modalData.date)}
                </p>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModalData({ ...modalData, status: "present" })}
                      className={`flex-1 py-2 rounded-md font-medium ${
                        modalData.status === "present"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => setModalData({ ...modalData, status: "absent" })}
                      className={`flex-1 py-2 rounded-md font-medium ${
                        modalData.status === "absent"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                  <textarea
                    value={modalData.remark}
                    onChange={(e) => setModalData({ ...modalData, remark: e.target.value })}
                    placeholder="Add remarks..."
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] resize-none"
                  />
                </div>
              </div>
              <div className="p-5 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Student Attendance Details Modal */}
        {viewAttendanceModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{selectedStudent.name}'s Attendance</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Overall:{" "}
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        selectedStudent.attendanceStatus === "poor"
                          ? "bg-red-100 text-red-800"
                          : selectedStudent.attendanceStatus === "average"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedStudent.attendancePercentage}%
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setViewAttendanceModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-5 flex-grow overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDateList.map((date) => {
                    const status = getAttendanceStatusForDate(selectedStudent, date);
                    return (
                      <div
                        key={date}
                        onClick={() => {
                          setModalData({
                            studentId: selectedStudent.id,
                            studentName: selectedStudent.name,
                            date,
                            remark: status?.remark || "",
                            status: status?.status || "present",
                          });
                          setShowModal(true);
                        }}
                        className={`p-4 rounded-lg border ${
                          status ? status.className : "bg-gray-50 border-gray-200"
                        } hover:shadow-md transition-all cursor-pointer`}
                      >
                        <div className="font-medium text-gray-800">{formatDate(date)}</div>
                        {status ? (
                          <div className="mt-2">
                            <span className="font-semibold capitalize">{status.status}</span>
                            {status.remark && (
                              <p className="text-xs text-gray-600 mt-1 truncate" title={status.remark}>
                                <span className="font-medium">Remark:</span> {status.remark}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2 text-gray-500 text-xs">No data</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="p-5 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => setViewAttendanceModal(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSheet;