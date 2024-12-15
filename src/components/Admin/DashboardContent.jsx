import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Briefcase,
  Check,
  X,
  Newspaper,
  Loader2,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";

// Register Chart.js plugins and components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8 space-y-6">
        {/* Metrics Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-md animate-pulse transform hover:scale-105 transition-all duration-300"
            >
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>

        {/* Charts and Recent Complaints Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Skeleton */}
          <div className="bg-white p-4 rounded-xl shadow-md animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-[350px] bg-gray-100 rounded"></div>
          </div>

          {/* Recent Complaints Skeleton */}
          <div className="bg-white p-4 rounded-xl shadow-md animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex justify-between">
                  <div className="space-y-2 w-full">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// Metric Card Component with Advanced Styling
const MetricCard = ({ title, value, Icon }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-16 h-16 text-indigo-500 mr-4 mt-2" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {/* <Icon className="w-5 h-5 text-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity" /> */}
        </div>

        <div className="flex items-center justify-center">
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case "proses":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "selesai":
        return "bg-green-100 text-green-800 border-green-200";
      case "batal":
        return "bg-red-100 text-red-800 border-red-200";
      case "tanggapi":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`
      px-3 py-1 inline-flex items-center 
      text-xs font-medium rounded-full 
      border transition-all duration-300
      ${getStatusStyle()}
    `}
    >
      {status}
    </span>
  );
};

// Recent Complaints Component
const RecentComplaint = ({ complaints }) => {
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Briefcase className="mr-2 w-5 h-5 text-indigo-500" />
          Recent Complaints
        </h2>
        <AlertCircle className="w-5 h-5 text-gray-400 hover:text-indigo-500 cursor-pointer" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b">
              <th className="pb-2 text-left">No Complaint</th>
              <th className="pb-2 text-left">Date</th>
              <th className="pb-2 text-left">Client</th>
              <th className="pb-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentComplaints.map((complaint, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors border-b last:border-b-0"
              >
                <td className="py-3 text-sm text-gray-700 px-4 md:px-2">
                  {complaint.complaint_number}
                </td>
                <td className="py-3 text-sm text-gray-500 px-4 md:px-2">
                  {new Date(complaint.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="py-3 text-sm text-gray-700 px-4 md:px-2">
                  {complaint.user.name}
                </td>
                <td className="py-3 px-4 md:px-2">
                  <StatusBadge status={complaint.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Complaint Chart Component
const ComplaintChart = ({ complaints }) => {
  const completedCount = complaints.filter(
    (c) => c.status.toLowerCase() === "selesai"
  ).length;
  const canceledCount = complaints.filter(
    (c) => c.status.toLowerCase() === "batal"
  ).length;
  const pendingCount = complaints.filter(
    (c) => c.status.toLowerCase() === "proses"
  ).length;
  const respondedCount = complaints.filter(
    (c) => c.status.toLowerCase() === "tanggapi"
  ).length;

  const data = {
    labels: ["Selesai", "Batal", "Proses", "Tanggapi"],
    datasets: [
      {
        data: [completedCount, canceledCount, pendingCount, respondedCount],
        backgroundColor: [
          "rgba(76, 175, 80, 0.7)",
          "rgba(244, 67, 54, 0.7)",
          "rgba(255, 152, 0, 0.7)",
          "rgba(33, 150, 243, 0.7)",
        ],
        borderColor: [
          "rgba(76, 175, 80, 1)",
          "rgba(244, 67, 54, 1)",
          "rgba(255, 152, 0, 1)",
          "rgba(33, 150, 243, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "#000",
        anchor: "end",
        align: "top",
        formatter: (value) => value,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: "#000" },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: "#000" },
        grid: { color: "rgba(0,0,0,0.1)" },
      },
    },
    animation: { duration: 1000, easing: "easeInOutQuart" },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Clock className="mr-2 w-5 h-5 text-indigo-500" />
          Complaint Status
        </h2>
        <TrendingUp className="w-5 h-5 text-gray-400 hover:text-indigo-500 cursor-pointer" />
      </div>
      <div style={{ position: "relative", height: "350px", width: "100%" }}>
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};

// Main Dashboard Content Component
const DashboardContent = ({ complaints, news, isLoading }) => {
  const completedComplaints = complaints.filter(
    (complaint) => complaint.status.toLowerCase() === "selesai"
  ).length;
  const canceledComplaints = complaints.filter(
    (complaint) => complaint.status.toLowerCase() === "batal"
  ).length;

  // Mock trend data (you would calculate this dynamically in a real app)

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Complaint"
            value={complaints.length}
            Icon={Briefcase}
          />
          <MetricCard
            title="Complaint Selesai"
            value={completedComplaints}
            Icon={Check}
          />
          <MetricCard
            title="Complaint Batal"
            value={canceledComplaints}
            Icon={X}
          />
          <MetricCard title="Total News" value={news.length} Icon={Newspaper} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComplaintChart complaints={complaints} />
          <RecentComplaint complaints={complaints} />
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
