import React from "react";
import {
  CircleUserRound,
  Edit,
  Infinity,
  Settings,
  MessagesSquare,
  CheckCircle,
} from "lucide-react";
// import ilustrasiProcedure from "../../assets/ilustrasiProcedure.svg";

const ProcedureSection = () => {
  return (
    <div className="flex flex-col items-center justify-center  mx-auto max-w-[1440px] py-8 md:px-14">
      <h1 className="md:text-5xl text-4xl font-bold lg:mb-20 mb-10">
        Prosedur Lapor
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-14 gap-8 items-start mb-10 px-4">
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="text-orange-700 flex items-center">
            <CircleUserRound className="w-16 h-16 stroke-1" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">1. Daftar atau Masuk</h2>
            <p className="text-gray-600 text-base font-normal">
              Mulai perjalanan Anda dengan mendaftar atau masuk ke akun. Proses
              ini cepat dan mudah, memastikan keamanan data Anda.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="text-pink-500 flex items-center ">
            <Edit className="w-16 h-16 stroke-1" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">2. Tulis Pengaduan</h2>
            <p className="text-gray-600 text-base font-normal">
              Jelaskan keluhan atau saran Anda dengan detail di kolom yang
              tersedia. Anda juga dapat menyertakan bukti pendukung seperti
              foto.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="text-red-500 flex items-center ">
            <Infinity className="w-16 h-16 stroke-1" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">3. Proses Verifikasi</h2>
            <p className="text-gray-600 text-base font-normal">
              Tim kami akan memeriksa kelengkapan dan validitas laporan Anda
              untuk memastikan data dapat diproses lebih lanjut.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-4">
          <div className="text-yellow-600 flex items-center">
            <Settings className="w-16 h-16 stroke-1" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">4. Proses Tindak Lanjut</h2>
            <p className="text-gray-600 text-base font-normal">
              Pengaduan Anda akan diteruskan ke pihak terkait untuk segera
              ditindaklanjuti sesuai dengan kebijakan dan prosedur.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex gap-4">
          <div className="text-blue-500 flex items-center">
            <MessagesSquare className="w-16 h-16 stroke-1" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">5. Tanggapan</h2>
            <p className="text-gray-600 text-base font-normal">
              Dapatkan tanggapan langsung mengenai perkembangan pengaduan Anda.
              Kami memastikan komunikasi yang jelas dan transparan.
            </p>
          </div>
        </div>

        {/* Step 6 */}
        <div className="flex gap-4">
          <div className="text-green-500 flex items-center">
            <CheckCircle className="w-16 h-16 stroke-1" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">6. Selesai</h2>
            <p className="text-gray-600 text-base font-normal">
              Pengaduan Anda berhasil ditangani hingga tuntas. Kami juga
              mengundang Anda memberikan feedback untuk membantu kami terus
              meningkatkan layanan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcedureSection;
