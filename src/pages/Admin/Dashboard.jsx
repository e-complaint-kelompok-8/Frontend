import React, { useState, useEffect } from "react";
import Sidebar from "@components/Admin/Sidebar";
import Header from "@components/Admin/Header";
import BottomNavigation from "@components/Admin/BottomNavigation";
import DashboardContent from "@components/Admin/DashboardContent";
import DashboardService from "@services/DashboardService";

const Dashboard = () => {
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

  return (
    <div className="flex h-screen bg-gray-100 pb-16 md:pb-16 lg:pb-0">
      <Sidebar
        className="hidden lg:block w-64 fixed h-full"
        isLoading={isLoading}
      />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header isLoading={isLoading} />
        <DashboardContent
          complaints={complaints}
          news={news}
          isLoading={isLoading}
        />
        <BottomNavigation isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
