import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bot, Heart, Clock, Shield, MessageCircle } from "lucide-react";

const AISupport = () => {
  const features = [
    {
      icon: Heart,
      title: "Compassionate Listening",
      description: "Our AI is trained to provide empathetic, non-judgmental support"
    },
    {
      icon: Clock,
      title: "Available 24/7",
      description: "Get support whenever you need it, day or night"
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your conversations are completely confidential and encrypted"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            AI-Powered Support
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start a conversation with our compassionate AI companion, designed to listen and support you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 bg-card border-border/50 hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/ai-support">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-medium text-lg px-8 py-6 rounded-full"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Conversation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AISupport;
