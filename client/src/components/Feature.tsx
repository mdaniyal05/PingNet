import { MessageSquare, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Messages delivered instantly with real-time synchronization",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Simple & Clean",
    description: "Easy-to-use interface designed for effortless communication",
  },
];

export default function Feature() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose PingNet?
          </h2>
          <p className="text-xl text-muted-foreground">
            Built with the features you need for modern communication
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary transition-all hover:shadow-lg"
            >
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
