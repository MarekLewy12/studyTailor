import React from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";

const Notification = ({ notification, onClose }) => {
  const icons = {
    success: <FaCheckCircle className="text-lg" />,
    info: <FaInfoCircle className="text-lg" />,
    warning: <FaExclamationTriangle className="text-lg" />,
    error: <FaTimesCircle className="text-lg" />,
  };

  const bgColors = {
    success: "bg-green-100 dark:bg-green-800/30 border-l-4 border-green-500",
    info: "bg-blue-100 dark:bg-blue-800/30 border-l-4 border-blue-500",
    warning: "bg-yellow-100 dark:bg-yellow-800/30 border-l-4 border-yellow-500",
    error: "bg-red-100 dark:bg-red-800/30 border-l-4 border-red-500",
  };

  const textColors = {
    success: "text-green-700 dark:text-green-300",
    info: "text-blue-700 dark:text-blue-300",
    warning: "text-yellow-700 dark:text-yellow-300",
    error: "text-red-700 dark:text-red-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      transition={{ duration: 0.4 }}
      className={`${bgColors[notification.type]} ${textColors[notification.type]} p-3 rounded-md shadow-md max-w-md mb-3`}
    >
      <div className="flex items-center">
        <div className="mr-3">{icons[notification.type]}</div>

        <p>{notification.message}</p>
      </div>
    </motion.div>
  );
};

export default Notification;
