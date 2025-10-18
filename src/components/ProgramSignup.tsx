import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, Calendar, Users, Award } from "lucide-react";

const ProgramSignup = () => {
  const benefits = [
    "Personalized mental health support plan",
    "Weekly group sessions with trained professionals",
    "Access to exclusive resources and workshops",
    "24/7 crisis support hotline",
    "Progress tracking and milestone celebrations",
    "Connect with a supportive community"
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Mental Health Program
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take the next step in your mental health journey with our comprehensive support program
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-6">What's Included</h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="p-8 bg-gradient-card border-border/50 shadow-medium">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold mb-2">Start Your Journey</h3>
              <p className="text-muted-foreground">Join thousands who've found support</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">Flexible Schedule</p>
                  <p className="text-sm text-muted-foreground">Choose times that work for you</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">Small Groups</p>
                  <p className="text-sm text-muted-foreground">8-10 participants per session</p>
                </div>
              </div>
            </div>

            <Link to="/program-signup" className="block">
              <Button 
                size="lg"
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-glow text-lg py-6 rounded-full"
              >
                Sign Up Now
              </Button>
            </Link>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              Free consultation • No commitment required
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProgramSignup;
