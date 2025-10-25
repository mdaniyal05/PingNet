import Feature from "@/components/Feature";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Nav />
      <Hero />
      <Feature />
      <Footer />
    </div>
  );
}
