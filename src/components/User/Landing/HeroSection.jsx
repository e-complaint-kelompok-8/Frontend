import React from "react";
import bgHero from "@assets/User/bg-hero.jpg";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative bg-white text-white">
        {/* Background Image */}
        <div className="absolute inset-0 flex justify-center items-center">
          <img
            src={bgHero}
            alt="Background"
            className="max-h-screen max-w-full bg-no-repeat bg-cover bg-center"
          />
          <div className="absolute w-full h-screen inset-0 bg-black opacity-50"></div>
        </div>

        {/* Overlay Content */}
        <div className="relative w-full h-screen z-10 flex flex-col items-end justify-end">
          <div className=" max-w-3xl max-h-96 bg-white pl-6 md:pl-14 py-6 md:py-10 pr-6 md:pr-24 rounded-ss-md">
            <h1 className="text-2xl text-black font-bold md:text-5xl">
              Berani Lapor! Tingkatkan Kualitas Layanan Publik Bersama
            </h1>
            <p className="mt-4 md:text-lg font-normal text-gray-600">
              Sampaikan pengalaman dan masukan Anda untuk menciptakan layanan
              publik yang lebih cepat, aman, dan memuaskan. Mari bersama
              wujudkan perubahan!
            </p>
            <button
              onClick={() => navigate(`/user/dashboard`)}
              className="mt-2 px-6 py-1 bg-primary hover:bg-blue-700 text-white rounded-lg text-lg font-medium"
            >
              LAPOR
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
