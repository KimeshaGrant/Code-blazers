import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15 animate-[pulse_8s_ease-in-out_infinite]"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      <div className="container relative z-10 px-4 py-20 mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 gradient-text">
          Your Journey to Wellness Starts Here
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
          We understand what you're going through
        </p>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          Mental health challenges can feel isolating, but you don't have to face them alone. 
          We're here to support you every step of the way.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Link to="/ai-support">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow transition-all duration-300 hover:scale-105 text-lg px-8 py-6 rounded-full"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Talk to AI Support
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 text-lg px-8 py-6 rounded-full hover:bg-secondary transition-all duration-300"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
