import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import Features from "../components/landing/Features";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FAQ from "../components/landing/FAQ";
import FinalCTA from "../components/landing/FinalCTA";
import About from "../components/landing/About";


const LandingPage = () => {

  const navigate = useNavigate()

  const {isAuth,checkAuthentication} = useAuth();
   
  useEffect(() => {
    checkAuthentication();
     if (isAuth) {
      navigate("/dashboard");
    }
  }, [checkAuthentication, isAuth, navigate]);

 
  return (
    <div className="antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main>
        <About />
        <Features />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;