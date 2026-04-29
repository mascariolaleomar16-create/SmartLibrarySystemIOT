import { User } from "../models/User.js";
import { Borrow } from "../models/Borrow.js";

/* =========================
   GET ALL USERS + STATS
========================= */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const enrichedUsers = await Promise.all(
      users.map(async (user) => {

        const stats = await Borrow.aggregate([
          { $match: { user: user._id } },

          {
            $group: {
              _id: "$user",

              totalBorrowed: { $sum: 1 },

              activeBorrowed: {
                $sum: {
                  $cond: [{ $eq: ["$returned", false] }, 1, 0],
                },
              },

              overdue: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$returned", false] },
                        { $lt: ["$dueDate", new Date()] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              totalFine: { $sum: "$fine" },
            },
          },
        ]);

        return {
          ...user.toObject(),
          stats: stats[0] || {
            totalBorrowed: 0,
            activeBorrowed: 0,
            overdue: 0,
            totalFine: 0,
          },
        };
      })
    );

    res.json(enrichedUsers);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* =========================
   GET SINGLE USER DETAILS
========================= */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "borrowHistory",
        populate: {
          path: "book",
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // optional: compute stats for detail view too
    const stats = await Borrow.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: "$user",
          totalBorrowed: { $sum: 1 },
          activeBorrowed: {
            $sum: { $cond: [{ $eq: ["$returned", false] }, 1, 0] },
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$returned", false] },
                    { $lt: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalFine: { $sum: "$fine" },
        },
      },
    ]);

    res.json({
      ...user.toObject(),
      stats: stats[0] || {
        totalBorrowed: 0,
        activeBorrowed: 0,
        overdue: 0,
        totalFine: 0,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
};

/* =========================
   BAN USER
========================= */
const banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { banned: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User banned successfully",
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to ban user" });
  }
};

/* =========================
   UNBAN USER
========================= */
const unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { banned: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User unbanned successfully",
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unban user" });
  }
};

export {
  getAllUsers,
  getUserById,
  banUser,
  unbanUser,
}