import { motion } from "framer-motion";
const HoverEffect = ({ children }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {children}
  </motion.div>
);

export default HoverEffect;
