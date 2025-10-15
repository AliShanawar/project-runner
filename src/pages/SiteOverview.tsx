import { BarChart3, Users, Package, ClipboardList } from "lucide-react";

const SiteOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Site Overview</h1>
        <p className="text-gray-500 text-sm">
          Here’s a quick summary of this site’s performance and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Active Members",
            value: 24,
            icon: Users,
          },
          {
            title: "Inventory Items",
            value: 18,
            icon: Package,
          },
          {
            title: "Total Tasks",
            value: 47,
            icon: ClipboardList,
          },
          {
            title: "Performance Score",
            value: "92%",
            icon: BarChart3,
          },
        ].map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm"
          >
            <div className="p-3 bg-[#8A5BD5]/10 rounded-xl">
              <Icon className="w-5 h-5 text-[#8A5BD5]" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{title}</p>
              <h3 className="text-xl font-semibold text-gray-900">{value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activities
        </h2>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>
            • Task “Steel Rod Delivery” marked as completed by Alex Johnson.
          </li>
          <li>• 5 new drivers added to the site team.</li>
          <li>• 1,000 units of bricks added to site inventory.</li>
          <li>• Feedback received from subcontractor Ethan Carter.</li>
        </ul>
      </div>
    </div>
  );
};

export default SiteOverview;
