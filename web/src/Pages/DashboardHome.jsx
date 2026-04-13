export default function DashboardHome() {
  return (
    <div className="space-y-4 p-5">

    {/* SYSTEM OVERVIEW */}
    <div className="bg-white p-5 rounded-2xl shadow">
        <h3 className="font-semibold text-lg mb-2">System Overview</h3>
        <ul className="text-sm text-gray-600 space-y-1">
        <li>• RFID-based book scanning</li>
        <li>• Automatic borrowing & return tracking</li>
        <li>• Cloud-based book image storage</li>
        <li>• 3-day due date policy for all borrowings</li>
        <li>• Late return penalty system in place</li>
        </ul>
    </div>

    {/* LIBRARY RULES */}
    <div className="bg-white p-5 rounded-2xl shadow">
        <h3 className="font-semibold text-lg mb-2">Library Guidelines</h3>
        <ul className="text-sm text-gray-600 space-y-1">
        <li>• Return books on or before due date</li>
        <li>• Handle books with care</li>
        <li>• RFID scan is required for all transactions</li>
        <li>• Lost books must be reported immediately</li>
        </ul>
    </div>

    </div>
  );
}