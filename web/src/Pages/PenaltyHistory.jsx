import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function PenaltyHistory() {
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
    <div className="space-y-5">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-red-500 p-4 rounded-xl shadow text-white">
        <h2 className="text-xl font-bold">Penalty History</h2>
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto border-l-4 border-blue-600">

        {loading ? (
          <p className="text-blue-600">Loading...</p>
        ) : (
          <table className="w-full text-sm">

            <thead>
              <tr className="text-left border-b bg-blue-50">
                <th>User</th>
                <th>Book</th>
                <th>Overdue Days</th>
                <th>Fine</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b hover:bg-blue-50/40">

                  <td className="py-2 font-medium text-blue-700">
                    {log.user?.username}
                  </td>

                  <td>{log.borrow?.book?.title}</td>

                  <td>
                    <span className="text-red-500 font-semibold">
                      {log.overdueDays}
                    </span>
                  </td>

                  <td className="text-blue-700 font-semibold">
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
    </div>
  );
}