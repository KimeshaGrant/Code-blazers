import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, ShieldCheck, Heart, UserCheck } from "lucide-react";

const Community = () => {
  const safetyFeatures = [
    {
      icon: ShieldCheck,
      title: "Verified Users",
      description: "All community members go through a verification process"
    },
    {
      icon: UserCheck,
      title: "Intent Screening",
      description: "Advanced filtering to ensure genuine support seekers and helpers"
    },
    {
      icon: Heart,
      title: "Zero Tolerance",
      description: "No bullying, scamming, or harassment - instant removal"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
            <Users className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Connect with Real People
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join a safe, supportive community where you can share and connect with others who understand
          </p>
        </div>

        <Card className="p-8 md:p-12 mb-12 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <h3 className="text-2xl font-bold mb-6 text-center">Our Safety Promise</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="text-center">
          <Link to="/community">
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 text-lg px-8 py-6 rounded-full"
            >
              Join Community
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Community;
