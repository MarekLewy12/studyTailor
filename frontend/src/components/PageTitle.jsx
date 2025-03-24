import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const PageTitle = ({ title, showUsername = true }) => {
  const { username } = useContext(AuthContext);

  const displayTitle =
    showUsername && username ? (
      <>
        {title}, <span className="text-blue-500">{username}</span>
      </>
    ) : (
      title
    );

  return (
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-3xl md:text-4xl lg:text-6xl font-bold text-center text-gray-800 dark:text-blue-300 mb-6 mt-4 px-2"
    >
      {displayTitle}
    </motion.h1>
  );
};

export default PageTitle;
