export default function DashboardCard({
  title,
  value,
  color,
  icon,
}) {
  return (
    <div className="group rounded-2xl border border-[#1f2937] bg-[#111827] p-6 transition-all duration-300 hover:border-violet-500/50 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">
            {title}
          </p>

          <h2 className="mt-2 text-4xl font-bold text-white">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}