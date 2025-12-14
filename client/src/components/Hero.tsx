import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20">
      <motion.h1
        className="text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        PingNet
      </motion.h1>
      <motion.p
        className="text-lg text-muted-foreground max-w-xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Connect instantly with your friends and communities. Real-time
        messaging, redefined.{" "}
        {"(Still in Development and Will be Completed Soon)"}
      </motion.p>
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link to="/auth/login">
          <Button size="lg" className="cursor-pointer">
            Get Started
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
