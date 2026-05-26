import React, { useEffect, useState } from "react";
import axios from "axios";
import PenaltyHistorySection from "../Components/PenaltyHistorySection.jsx";

const API_URL = process.env.REACT_APP_API_URL;

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(users);
      return;
    }

    const q = search.toLowerCase();

    const result = users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q)
    );

    setFiltered(result);
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openUser = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/users/${id}`);
      setUserDetail(res.data);
      setDrawerOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBan = async (id, banned) => {
    try {
      await axios.patch(
        `${API_URL}/users/${id}/${banned ? "unban" : "ban"}`
      );

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const clearFine = async (id) => {
    try {
      await axios.patch(`${API_URL}/users/${id}/clear-fine`);

      await fetchUsers();

      const updated = await axios.get(`${API_URL}/users/${id}`);
      setUserDetail(updated.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-red-500 p-4 rounded-xl shadow flex justify-between items-center text-white">
        <h2 className="text-xl font-bold">Manage Users</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user..."
          className="border px-3 py-2 rounded-lg w-64 text-black focus:ring-2 focus:ring-red-400 outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto border-l-4 border-blue-600">

        {loading ? (
          <p className="text-blue-600">Loading users...</p>
        ) : (
          <table className="w-full text-sm">

            <thead>
              <tr className="text-left border-b bg-blue-50">
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Book Borrowed</th>
                <th>Active</th>
                <th>Overdue</th>
                <th>Current Fine</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className="border-b hover:bg-blue-50/40">

                  <td
                    className="py-2 cursor-pointer text-blue-700 hover:text-red-600 hover:underline"
                    onClick={() => openUser(u._id)}
                  >
                    {u.username}
                  </td>

                  <td>{u.email}</td>

                  <td>
                    {u.banned ? (
                      <span className="text-red-600 font-semibold">
                        Banned
                      </span>
                    ) : (
                      <span className="text-blue-600 font-semibold">
                        Active
                      </span>
                    )}
                  </td>

                  <td>{u.stats?.totalBorrowed || 0}</td>

                  <td>{u.stats?.activeBorrowed || 0}</td>

                  <td>
                    <span
                      className={
                        u.stats?.overdue > 0
                          ? "text-red-500 font-semibold"
                          : "text-blue-600"
                      }
                    >
                      {u.stats?.overdue || 0}
                    </span>
                  </td>

                  <td className="text-red-600 font-semibold">
                    ₱{u.fineAmount || 0}
                  </td>

                  <td>
                    <button
                      onClick={() => toggleBan(u._id, u.banned)}
                      className={`px-3 py-1 rounded text-white text-xs ${
                        u.banned
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {u.banned ? "Unban" : "Ban"}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

      {/* PENALTY HISTORY (optional global view) */}
      <PenaltyHistorySection />

      {/* DRAWER */}
      {drawerOpen && userDetail && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">

          <div className="w-full md:w-[440px] bg-gradient-to-b from-blue-50 via-white to-red-50 h-full p-5 overflow-y-auto border-l-4 border-blue-600">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-blue-700">
                User Details
              </h2>

              <button
                onClick={() => setDrawerOpen(false)}
                className="text-blue-700 hover:text-red-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 border-b pb-3">
              <p className="font-bold">{userDetail.fullName}</p>
              <p className="text-sm text-gray-600">
                {userDetail.email}
              </p>

              <p className="text-xs">
                Status:{" "}
                <span
                  className={
                    userDetail.banned
                      ? "text-red-600"
                      : "text-blue-600"
                  }
                >
                  {userDetail.banned ? "Banned" : "Active"}
                </span>
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">

              <Stat
                label="Total Borrowed"
                value={userDetail.stats?.totalBorrowed}
              />

              <Stat
                label="Active"
                value={userDetail.stats?.activeBorrowed}
              />

              <Stat
                label="Overdue"
                value={userDetail.stats?.overdue}
              />

              <Stat
                label="Accumulated Fines"
                value={`₱${userDetail.stats?.totalFine || 0}`}
              />

            </div>

            {/* CLEAR FINE */}
            <div className="mt-4">
              <button
                onClick={() => clearFine(userDetail._id)}
                disabled={userDetail.fineAmount <= 0}
                className={`w-full py-2 rounded-lg text-white font-medium transition ${
                  userDetail.fineAmount > 0
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Clear Penalty / Mark as Paid
              </button>
            </div>

            {/* BORROW HISTORY */}
            <div className="mt-5">
              <h3 className="font-semibold mb-2 text-blue-700">
                Borrow History
              </h3>

              <div className="space-y-2">

                {userDetail.borrowHistory?.length === 0 && (
                  <p className="text-sm text-gray-400">
                    No history yet
                  </p>
                )}

                {userDetail.borrowHistory?.map((b) => {
                  const isReturned = b.returned;
                  const isOverdue =
                    !b.returned &&
                    new Date(b.dueDate) < new Date();

                  return (
                    <div
                      key={b._id}
                      className="flex gap-3 p-2 rounded-lg border bg-white hover:border-red-300"
                    >

                      <img
                        src={
                          b.book?.image?.url ||
                          "/default-book.jpg"
                        }
                        className="w-12 h-16 object-cover rounded"
                        alt={b.book?.title}
                      />

                      <div className="flex-1">

                        <p className="font-medium text-sm">
                          {b.book?.title}
                        </p>

                        <p className="text-xs text-gray-500">
                          Due:{" "}
                          {new Date(
                            b.dueDate
                          ).toLocaleDateString()}
                        </p>

                        <div className="mt-1">

                          {isReturned && (
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                              Returned
                            </span>
                          )}

                          {!isReturned && isOverdue && (
                            <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600">
                              Overdue
                            </span>
                          )}

                          {!isReturned && !isOverdue && (
                            <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                              Currently with user
                            </span>
                          )}

                        </div>

                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white border border-blue-200 p-2 rounded-lg text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-bold text-blue-700">{value || 0}</p>
    </div>
  );
}