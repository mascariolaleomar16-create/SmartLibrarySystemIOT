export default function DashboardHome() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">

      {/* SYSTEM OVERVIEW */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 relative overflow-hidden">

        {/* red accent bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>

        <h3 className="font-bold text-xl mb-4 text-blue-600">
          System Overview
        </h3>

        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            RFID-based book scanning
          </li>

          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            Automatic borrowing & return tracking
          </li>

          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            Cloud-based book image storage
          </li>

          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            3-day due date policy for all borrowings
          </li>

          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            Late return penalty system in place
          </li>
        </ul>
      </div>

      {/* LIBRARY RULES */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-red-100 relative overflow-hidden">

        {/* blue accent bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>

        <h3 className="font-bold text-xl mb-4 text-red-500">
          Library Guidelines
        </h3>

        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            Return books on or before due date
          </li>

          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            Handle books with care
          </li>

          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            RFID scan is required for all transactions
          </li>

          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            Lost books must be reported immediately
          </li>
        </ul>
      </div>

    </div>
  );
}