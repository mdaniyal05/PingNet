import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="mt-20 mb-5 text-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Badge variant="secondary" className="mb-2">
          Ready to join PingNet?
        </Badge>
        <h2 className="text-3xl font-semibold">Start messaging today</h2>
        <Button size="lg" className="mt-4">
          Sign Up Free
        </Button>
      </motion.div>
      <p className="text-sm text-muted-foreground mt-8">
        © {new Date().getFullYear()} PingNet — All rights reserved.
      </p>
    </footer>
  );
}
