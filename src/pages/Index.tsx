import Hero from "@/components/Hero";
import AISupport from "@/components/AISupport";
import Community from "@/components/Community";
import ProgramSignup from "@/components/ProgramSignup";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <AISupport />
      <Community />
      <ProgramSignup />
      <Footer />
    </div>
  );
};

export default Index;
