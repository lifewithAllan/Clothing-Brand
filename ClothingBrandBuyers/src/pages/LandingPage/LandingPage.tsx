import React from 'react';
import LandingNavbar from '../../components/nav/LandingNavbar';
import LoginModal from '../../components/modals/LoginModal';
import SignupModal from '../../components/modals/SignupModal';
import ForgotPasswordModal from '../../components/modals/ForgotPasswordModal';
import HeroSection from './LandingPageComponents/HeroSection';
import Features from './LandingPageComponents/Features';
import Sponsors from './LandingPageComponents/Sponsors';
import Footer from './LandingPageComponents/Footer';

const LandingPage: React.FC = () => {

  return (
    <>
      <LandingNavbar />
      <HeroSection />
      <Features />
      <Sponsors />
      <Footer />

      {/* Modals */}
      <LoginModal />
      <SignupModal />
      <ForgotPasswordModal />
    </>
  );
};

export default LandingPage;
