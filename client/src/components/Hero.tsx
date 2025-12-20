import { Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";

export default function PingNetLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary rounded-full text-primary-foreground text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Free forever
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Connect Instantly,
            <br />
            Anywhere in the World
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience seamless messaging with PingNet. Fast, simple, and
            designed for the way you communicate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={"https://github.com/mdaniyal05/pingnet"} target="_blank">
              <Button size="lg" className="text-lg px-8 cursor-pointer">
                Github
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-chart-1" />
              Free forever
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-chart-1" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-chart-1" />
              Web-based
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start messaging with PingNet today. It's free forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 cursor-pointer"
              onClick={() => navigate("auth/register")}
            >
              Sign Up Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 cursor-pointer"
              onClick={() => navigate("auth/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
