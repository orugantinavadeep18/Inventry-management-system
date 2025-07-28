import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("pos-token");
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const unread = res.data.notifications.filter((n) => n.read === false);
        setNotifications(unread);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("pos-token");
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications(); // refresh
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">🔔 Unread Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No unread notifications.</p>
      ) : (
        notifications.map((note) => (
          <div
            key={note._id}
            className="flex items-center justify-between p-3 bg-gray-100 mb-2 rounded-lg"
          >
            <div>
              <div>{note.message}</div>
              <div className="text-xs text-gray-500">
                {new Date(note.createdAt).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => markAsRead(note._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Mark as read
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
