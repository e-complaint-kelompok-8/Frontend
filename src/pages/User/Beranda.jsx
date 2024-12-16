import React, { useEffect } from "react";
import FormSection from "@components/User/Beranda/FormSection";
import NewsSection from "@components/User/Beranda/NewsSection";
import ComplaintHistoryCarousel from "@components/User/Beranda/ComplaintHistoryCarousel";
import { useComplaintStore } from "@stores/useComplaintStore";
import { fetchUserComplaints } from "@services/complaintService"; // Pastikan import fetchUserComplaints
import LapiChatbot from "../../components/User/Chatbot/LapiChatBot";
import HeaderUser from "@components/Shared/HeaderUser";
import FooterUser from "@components/Shared/FooterUser";

const Beranda = () => {
  const complaints = useComplaintStore((state) => state.complaints); // Ambil data dari store
  const setComplaints = useComplaintStore((state) => state.setComplaints); // Ambil fungsi untuk setComplaints

  // Fetch data keluhan dan simpan ke store saat pertama kali komponen dimuat
  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const fetchedComplaints = await fetchUserComplaints(); // Ambil data dari API
        setComplaints(fetchedComplaints); // Update data ke store
      } catch (error) {
        console.error("Error fetching complaints:", error); // Debugging error
      }
    };

    // Hanya fetch data jika complaints masih kosong
    if (complaints.length === 0) {
      loadComplaints();
    }
  }, [complaints, setComplaints]);

  console.log("Complaints in Beranda:", complaints); // Debugging untuk melihat data

  return (
    <>
      {/* <div className="min-h-screen bg-gray-50 flex flex-col"> */}
      {/* <HeaderUser /> */}
      <div className="flex justify-center">
        <main className="flex-col w-full max-w-[1440px] md:px-12 py-8 px-8">
          <FormSection />
          {/* Render ComplaintHistoryCarousel hanya jika ada data */}
          {complaints.length > 0 ? (
            <ComplaintHistoryCarousel />
          ) : (
            <p>Loading complaints...</p>
          )}
          <NewsSection />
          <LapiChatbot />
        </main>
      </div>
      <FooterUser />
      {/* </div> */}
    </>
  );
};

export default Beranda;
