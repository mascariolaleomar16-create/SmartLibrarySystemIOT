import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5;
  const userId = user._id;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/notifications/user/${userId}`
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAsUnread = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/unread/${id}`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: false } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as unread", err);
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = notifications.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <div className="bg-white p-5 rounded-2xl shadow border-t-4 border-blue-600">
      <h2 className="text-lg font-semibold mb-1 text-blue-700">
        Notifications
      </h2>
      <p className="text-red-600 font-medium mb-4">
        View your notifications and alerts
      </p>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Message</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((notif) => (
                <tr
                  key={notif._id}
                  onClick={() => markAsRead(notif._id)}
                  className={`border-t cursor-pointer transition ${
                    notif.isRead
                      ? "bg-white"
                      : "bg-red-50"
                  }`}
                >
                  <td className="p-2 font-medium text-blue-800">
                    {notif.title}
                  </td>
                  <td className="p-2 text-gray-700">
                    {notif.message}
                  </td>
                  <td className="p-2 text-red-600 font-semibold">
                    {notif.type}
                  </td>

                  <td
                    className="p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {notif.isRead ? (
                      <button
                        onClick={() =>
                          markAsUnread(notif._id)
                        }
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Mark Unread
                      </button>
                    ) : (
                      <span className="text-blue-600 font-medium text-sm">
                        Unread
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(p - 1, 1))
              }
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(p + 1, totalPages)
                )
              }
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}