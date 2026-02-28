"use client";
import { motion } from "framer-motion";

const dotVariants = {
  initial: { y: 0, opacity: 0.4 },
  animate: { y: [0, -5, 0], opacity: [0.4, 1, 0.4] },
};

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-start"
    >
      <div className="bg-panel-light rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1 border border-white/[0.04]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
            className="w-[7px] h-[7px] rounded-full bg-muted-light"
          />
        ))}
      </div>
    </motion.div>
  );
}
