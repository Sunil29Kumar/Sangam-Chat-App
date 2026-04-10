import Hero from "../components/landing/Hero";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import Features from "../components/landing/Features";


const LandingPage = () => {
  return (
    <div className="antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;