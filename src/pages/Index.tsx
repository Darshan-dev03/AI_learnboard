import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";
import PricingSection from "@/components/PricingSection";
import ProgressSection from "@/components/ProgressSection";
import QuizSection from "@/components/QuizSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <CoursesSection />
    <PricingSection />
    <ProgressSection />
    <QuizSection />
    <HowItWorksSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
