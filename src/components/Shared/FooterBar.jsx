import React from "react";
("use client");

import { Footer } from "flowbite-react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

const FooterBar = () => {
  return (
    <>
      <div className=" sm:max-w-full md:max-w-full lg:max-w-full">
        <Footer className="bg-primary">
          <div className="w-full mx-auto max-w-[1440px]">
            <div className="grid w-full grid-cols-2 gap-8 md:px-24 md:pt-14 px-6 py-8 md:grid-cols-4">
              <div>
                {/* <Footer.Title title="Company" className="text-white" /> */}
                <Footer.LinkGroup col>
                  <Footer.Link href="#" className="text-white">
                    Laporin Headquarters <br />
                    Jl. Raya Harmoni No. 123, <br />
                    Jakarta Pusat, Indonesia <br /> Khusus Ibukota Jakarta 12120
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title
                  title="HUBUNGI KAMU"
                  className="text-white text-xl"
                />
                <Footer.LinkGroup col>
                  <Footer.Link href="#" className="text-white p-0">
                    laporin_id
                  </Footer.Link>
                  <Footer.Link href="#" className="text-white">
                    laporin_id
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="EXPLORE" className="text-white text-xl" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#" className="text-white">
                    Tengtang Kami
                  </Footer.Link>
                  <Footer.Link href="#" className="text-white">
                    Prosedur Lapor
                  </Footer.Link>
                  <Footer.Link href="#" className="text-white">
                    Testimonial
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title
                  title="COPYRIGHT"
                  className="text-white text-xl"
                />
                <Footer.LinkGroup col>
                  <Footer.Link href="#" className="text-white">
                    © 2024 Laporin Company, All Rights Reserved.
                  </Footer.Link>
                  {/* <Footer.Link href="#" className="text-white">
                    Android
                  </Footer.Link>
                  <Footer.Link href="#" className="text-white">
                    Windows
                  </Footer.Link>
                  <Footer.Link href="#" className="text-white">
                    MacOS
                  </Footer.Link> */}
                </Footer.LinkGroup>
              </div>
            </div>
          </div>
        </Footer>
      </div>
    </>
  );
};

export default FooterBar;
