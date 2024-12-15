import React, { useState, useEffect } from "react";
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
import DashboardService from "@services/DashboardService";

// Register Chart.js plugins and components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MetricCard = ({ title, value }) => (
  <div className="bg-white p-3 md:p-4 rounded-lg shadow hover:shadow-md transition-shadow">
    <h3 className="text-xs md:text-sm lg:text-base font-medium text-gray-500">
      {title}
    </h3>
    <p className="text-lg md:text-xl lg:text-2xl font-bold mt-1">{value}</p>
  </div>
);

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "proses":
      return "bg-yellow-100 text-yellow-800";
    case "selesai":
      return "bg-green-100 text-green-800";
    case "batal":
      return "bg-red-100 text-red-800";
    case "tanggapi":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const RecentComplaint = ({ complaints }) => {
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  return (
    <div className="bg-white p-3 md:p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <h2 className="text-base md:text-lg lg:text-xl font-semibold mb-3 md:mb-4">
        Recent Complaint
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="text-left text-[10px] md:text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
              <th className="pb-2 px-2">No Complaint</th>
              <th className="pb-2 px-2">Date Created</th>
              <th className="pb-2 px-2">Client</th>
              <th className="pb-2 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentComplaints.map((complaint, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-2 px-2 text-xs md:text-sm">
                  {complaint.complaint_number}
                </td>
                <td className="py-2 px-2 text-xs md:text-sm">
                  {new Date(complaint.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="py-2 px-2 text-xs md:text-sm">
                  {complaint.user.name}
                </td>
                <td className="py-2 px-2">
                  <span
                    className={`px-2 inline-flex text-[10px] md:text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

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
        backgroundColor: ["#4caf50", "#f44336", "#ff9800", "#2196f3"],
        borderColor: ["#4caf50", "#f44336", "#ff9800", "#2196f3"],
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
      x: { beginAtZero: true, ticks: { color: "#000" } },
      y: { beginAtZero: true, ticks: { stepSize: 1, color: "#000" } },
    },
    animation: { duration: 1000, easing: "easeInOutQuart" },
  };

  return (
    <div style={{ position: "relative", height: "400px", width: "100%" }}>
      <Bar data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
};

const DashboardContent = () => {
  const [complaints, setComplaints] = useState([]);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const complaintsData = await DashboardService.getComplaints(
          "ALL",
          "ALL"
        );
        setComplaints(complaintsData.data.complaints);

        const newsData = await DashboardService.getAllNews();
        setNews(newsData.news);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const completedComplaints = complaints.filter(
    (complaint) => complaint.status.toLowerCase() === "selesai"
  ).length;
  const canceledComplaints = complaints.filter(
    (complaint) => complaint.status.toLowerCase() === "batal"
  ).length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto py-4 md:py-6 px-3 md:px-4 lg:px-8 space-y-4 md:space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <MetricCard title="Total Complaint" value={complaints.length} />
          <MetricCard title="Complaint Selesai" value={completedComplaints} />
          <MetricCard title="Complaint Batal" value={canceledComplaints} />
          <MetricCard title="Total News" value={news.length} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-base md:text-lg lg:text-xl font-semibold mb-3 md:mb-4">
              Complaint Grafik
            </h2>
            <ComplaintChart complaints={complaints} />
          </div>

          <RecentComplaint complaints={complaints} />
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
