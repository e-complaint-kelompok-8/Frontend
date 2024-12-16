import React from "react";
import ilustrasiAbout from "@assets/User/ilustrasiAbout.svg";

const AboutSection = () => {
  return (
    <section>
      <div className="container mx-auto max-w-[1440px] md:py-20 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-11">
          <div className="max-w-2xl p-5">
            <h2 className="md:text-5xl text-3xl md:text-center font-bold text-neutral-900 sm:text-4xl mb-7 mt-5">
              Tentang Kami
            </h2>
            <p className=" text-neutral-900 md:text-xl font-normal">
              Laporin adalah platform pengaduan digital yang mempermudah
              masyarakat Indonesia menyampaikan keluhan dan saran dengan cepat,
              transparan, dan aman. Kami menghadirkan layanan yang mengutamakan
              kemudahan akses, respons yang sigap, dan solusi efektif untuk
              berbagai masalah, dan memastikan privasi serta keamanan data
              pengguna tetap terjaga.
            </p>
          </div>
          <div className="mt-12 md:mt-0">
            <img
              src={ilustrasiAbout}
              alt="About Us Image"
              // className="object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
