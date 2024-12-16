import React from "react";
import NavigationBar from "@components/Shared/NavigationBar";
import HeroSection from "@components/User/Landing/HeroSection";
import AboutSection from "@components/User/Landing/AboutSection";
import BenefitSection from "@components/User/Landing/BenefitSection";
import ProcedureSection from "@components/User/Landing/ProcedureSection";
import TestimonialSection from "@components/User/Landing/TestimonialSection";
import FooterBar from "@components/Shared/FooterBar";

const LandingPage = () => {
  return (
    <>
      <NavigationBar />
      <HeroSection />
      <AboutSection />
      <BenefitSection />
      <ProcedureSection />
      <TestimonialSection />
      <FooterBar />
    </>
  );
};

export default LandingPage;
