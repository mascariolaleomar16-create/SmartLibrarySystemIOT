import React, { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#606c38]">Manage Users</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user..."
          className="border px-3 py-2 rounded-lg w-64"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="w-full text-sm">

            <thead>
              <tr className="text-left border-b">
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Total</th>
                <th>Active</th>
                <th>Overdue</th>
                <th>Fines</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className="border-b">

                  <td
                    className="py-2 cursor-pointer text-blue-700 hover:underline"
                    onClick={() => openUser(u._id)}
                  >
                    {u.username}
                  </td>

                  <td>{u.email}</td>

                  {/* STATUS */}
                  <td>
                    {u.banned ? (
                      <span className="text-red-600 font-semibold">
                        Banned
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
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
                          : ""
                      }
                    >
                      {u.stats?.overdue || 0}
                    </span>
                  </td>

                  <td>₱{u.stats?.totalFine || 0}</td>

                  <td>
                    <button
                      onClick={() => toggleBan(u._id, u.banned)}
                      className={`px-3 py-1 rounded text-white text-xs ${
                        u.banned
                          ? "bg-green-600 hover:bg-green-700"
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

      {/* =========================
          DRAWER
      ========================= */}
      {drawerOpen && userDetail && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">

          <div className="w-full md:w-[440px] bg-[#fefae0] h-full p-5 overflow-y-auto border-l-4 border-[#606c38]">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#606c38]">
                User Details
              </h2>

              <button
                onClick={() => setDrawerOpen(false)}
                className="text-[#606c38] hover:text-red-600"
              >
                ✕
              </button>
            </div>

            {/* USER INFO */}
            <div className="space-y-1 border-b pb-3">
              <p className="font-bold">{userDetail.fullName}</p>
              <p className="text-sm text-gray-600">{userDetail.email}</p>

              <p className="text-xs">
                Status:{" "}
                <span className={userDetail.banned ? "text-red-600" : "text-green-600"}>
                  {userDetail.banned ? "Banned" : "Active"}
                </span>
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">

              <Stat label="Total Borrowed" value={userDetail.stats?.totalBorrowed} />
              <Stat label="Active" value={userDetail.stats?.activeBorrowed} />
              <Stat label="Overdue" value={userDetail.stats?.overdue} />
              <Stat label="Fines" value={`₱${userDetail.stats?.totalFine}`} />

            </div>

            {/* =========================
                BORROW HISTORY (IMPROVED)
            ========================= */}
            <div className="mt-5">
              <h3 className="font-semibold mb-2 text-[#606c38]">
                Borrow History
              </h3>

              <div className="space-y-2">

                {userDetail.borrowHistory?.length === 0 && (
                  <p className="text-sm text-gray-400">No history yet</p>
                )}

                {userDetail.borrowHistory?.map((b) => {
                  const isReturned = b.returned;
                  const isOverdue = !b.returned && new Date(b.dueDate) < new Date();

                  return (
                    <div
                      key={b._id}
                      className="flex gap-3 p-2 rounded-lg border bg-white"
                    >

                      {/* BOOK THUMBNAIL */}
                      <img
                        src={b.book?.image?.url || "/default-book.jpg"}
                        className="w-12 h-16 object-cover rounded"
                        alt={b.book?.title}
                      />

                      {/* INFO */}
                      <div className="flex-1">

                        <p className="font-medium text-sm">
                          {b.book?.title}
                        </p>

                        <p className="text-xs text-gray-500">
                          Due: {new Date(b.dueDate).toLocaleDateString()}
                        </p>

                        {/* STATUS BADGE */}
                        <div className="mt-1">

                          {isReturned && (
                            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                              Returned
                            </span>
                          )}

                          {!isReturned && isOverdue && (
                            <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600">
                              Overdue
                            </span>
                          )}

                          {!isReturned && !isOverdue && (
                            <span className="text-xs px-2 py-1 rounded bg-[#fefae0] text-[#606c38]">
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

/* =========================
   STATS COMPONENT
========================= */
function Stat({ label, value }) {
  return (
    <div className="bg-white border border-[#606c38]/20 p-2 rounded-lg text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-bold text-[#606c38]">{value || 0}</p>
    </div>
  );
}