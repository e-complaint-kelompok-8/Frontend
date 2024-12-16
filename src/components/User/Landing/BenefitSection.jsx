import React from "react";
import { FilePen, TimerReset, SquareCheckBig } from "lucide-react";
import ilustrasi1 from "@assets/User/ilustrasi2.svg";

const BenefitSection = () => {
  return (
    <>
      <div className="flex flex-col mx-auto max-w-[1440px] md:flex-row items-center justify-center gap-8 md:px-16 py-12">
        {/* Bagian Kiri - Gambar */}
        <div className=" md:w-1/2 flex">
          <img
            src={ilustrasi1} // Ganti dengan path gambar yang sesuai
            alt="Laporan Mudah"
            className="md:max-w-97 md:max-h-98"
          />
        </div>

        {/* Bagian Kanan - Konten */}
        <div className="w-full md:w-1/2 px-4">
          <div className="space-y-10">
            {/* Cepat, Tuntas */}
            <div className="flex gap-4 md:w-3/4 md:ml-auto">
              <div className="text-blue-300 flex items-center">
                <TimerReset className=" h-20 w-20 stroke-1" />{" "}
              </div>
              <div className="md:w-3/5">
                <h3 className="text-2xl font-bold mb-2">Cepat, Tuntas</h3>
                <p className="text-gray-600 text-base font-normal">
                  Laporin dirancang dengan antarmuka sederhana dan proses yang
                  efisien.
                </p>
              </div>
            </div>

            {/* Lapor Mudah */}
            <div className="flex gap-4 md:w-3/5 ">
              <div className="text-blue-300 flex items-center">
                <FilePen className=" h-20 w-20 stroke-1" /> {/* Ikon contoh */}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Lapor Mudah</h3>
                <p className="text-gray-600 text-base font-normal">
                  Lapor Mudah untuk membantu meningkatkan kualitas layanan
                  dengan memberikan pelaporan yang mudah.
                </p>
              </div>
            </div>

            {/* Solusi Tepat */}
            <div className="flex gap-4 md:w-3/4 md:ml-auto">
              <div className="text-blue-300 flex items-center">
                <SquareCheckBig className=" h-20 w-20 stroke-1" />{" "}
                {/* Ikon contoh */}
              </div>
              <div className="md:w-3/5">
                <h3 className="text-2xl font-bold mb-2">Solusi Tepat</h3>
                <p className="text-gray-600 text-base font-normal">
                  Laporin hadir untuk membantu meningkatkan kualitas layanan
                  dengan memberikan solusi pengaduan yang efektif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BenefitSection;
