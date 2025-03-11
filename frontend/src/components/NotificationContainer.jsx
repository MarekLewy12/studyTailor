import React from "react";
import { AnimatePresence } from "framer-motion";
import Notification from "./Notification.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

const NotificationContainer = () => {
  const { notifications, addNotification } = useNotification();

  const removeNotification = (id) => {};

  return (
    <div className="fixed top-20 right-4 z-50">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;
