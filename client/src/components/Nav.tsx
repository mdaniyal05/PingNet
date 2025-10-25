import { MessageSquareCode } from "lucide-react";
import { motion } from "framer-motion";
import { ModeToggle } from "./ModeToggle";

export default function Nav() {
  return (
    <nav className="flex justify-between items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex gap-2 m-2"
      >
        <MessageSquareCode className="w-8 h-8 text-primary" />
        <span className="text-[1.2rem] font-semibold">PingNet</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="m-2"
      >
        <ModeToggle />
      </motion.div>
    </nav>
  );
}
