import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function Feature() {
  return (
    <section className="px-6 py-20 bg-muted/40">
      <div className="max-w-5xl mx-auto grid md:grid-cols-1 gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="text-center">
            <CardHeader>
              <MessageSquare className="w-10 h-10 mx-auto mb-4 text-primary" />
              <CardTitle>Real-Time Messaging</CardTitle>
            </CardHeader>
            <CardContent>
              Stay connected with instant message delivery and typing
              indicators.
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        ></motion.div>
      </div>
    </section>
  );
}
