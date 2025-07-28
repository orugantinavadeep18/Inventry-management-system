import React from "react";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router";

const NotificationBell = ({ hasNew }) => {
  return (
    <Link to="/admin/dashboard/notifications" className="relative flex items-center hover:text-sky-400 transition-colors duration-200">
      <FaBell className="text-white text-xl" />
      {hasNew && (
        <span className="absolute -top-1 -right-1 flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
