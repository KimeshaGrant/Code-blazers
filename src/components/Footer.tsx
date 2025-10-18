import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border/50 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold">MindSupport</span>
          </div>
          <p className="text-muted-foreground mb-6">
            Supporting mental health, one conversation at a time
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Crisis Resources</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            If you're in crisis, please call 988 (Suicide & Crisis Lifeline)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
