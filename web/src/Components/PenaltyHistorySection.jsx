import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export default function PenaltyHistorySection() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/penalties`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow overflow-x-auto border-l-4 border-red-500">

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-blue-700">
          Penalty History
        </h3>
      </div>

      {loading ? (
        <p className="text-blue-600">Loading penalties...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">No penalty history found.</p>
      ) : (
        <table className="w-full text-sm">

          <thead>
            <tr className="text-left border-b bg-red-50">
              <th className="py-2">User</th>
              <th>Book</th>
              <th>Overdue Days</th>
              <th>Fine</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log._id}
                className="border-b hover:bg-red-50/40"
              >

                <td className="py-2 font-medium text-blue-700">
                  {log.user?.username}
                </td>

                <td>{log.borrow?.book?.title}</td>

                <td>
                  <span className="text-red-500 font-semibold">
                    {log.overdueDays}
                  </span>
                </td>

                <td className="font-semibold text-red-600">
                  ₱{log.fineApplied}
                </td>

                <td className="text-gray-600">
                  {new Date(log.createdAt).toLocaleDateString()}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
}