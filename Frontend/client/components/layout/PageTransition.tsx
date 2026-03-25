import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="page-transition-shell"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.985, filter: "blur(10px)" }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.992, filter: "blur(8px)" }}
      transition={{
        duration: reduceMotion ? 0.18 : 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className="page-transition-glow"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={reduceMotion ? { opacity: 0.65 } : { opacity: 0.78, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.48, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="page-transition-content"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: reduceMotion ? 0.16 : 0.36, delay: reduceMotion ? 0 : 0.04 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}