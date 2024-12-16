import React from "react";

const TestimonialSection = () => {
  const testimonials = [
    {
      rating: 5,
      text: "Aplikasi ini memiliki desain antarmuka yang sederhana dan mudah dipahami, bahkan oleh pengguna awam. Navigasi yang jelas membuat proses pengaduan menjadi cepat dan efisien.",
      author: "Alvita Chen",
    },
    {
      rating: 5,
      text: "Formulir pengaduan disusun dengan baik, memungkinkan pengguna memasukkan informasi secara rinci, seperti jenis keluhan, lokasi kejadian, dan dokumen pendukung.",
      author: "Alvita Chen",
    },
    {
      rating: 5,
      text: "Salah satu fitur unggulan adalah kemampuan untuk melacak status laporan secara real-time. Saya dapat mengetahui apakah laporan mereka sedang diproses, diterima, atau telah selesai.",
      author: "Alvita Chen",
    },
  ];

  return (
    <div className="pt-5 pb-12 lg:px-40 bg-white  mx-auto max-w-[1440px]">
      <h1 className=" text-center md:text-5xl text-3xl font-bold mb-20">
        Testimonial
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-auto place-items-center">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="w-[358px] h-[415px] bg-white rounded-[20px] shadow-inner shadow-[rgba(0,0,0,0.25)] p-10 flex flex-col "
          >
            {/* Rating */}
            <div className="flex mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-2xl">
                  ★
                </span>
              ))}
            </div>
            {/* Text */}
            <p className="text-gray-700 text-base mb-6">{testimonial.text}</p>
            {/* Author */}
            <div className="mt-auto flex items-center gap-4">
              <img
                src="https://via.placeholder.com/50"
                alt={testimonial.author}
                className="w-16 h-16 rounded-full"
              />
              <p className="text-gray-800 font-normal justify-end text-xl">
                {testimonial.author}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
