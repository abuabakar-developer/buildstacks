import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ReferenceDot,
} from "recharts";

// Mock project timeline data (replace with real data as needed)
const data = [
  { date: "2024-06-01", progress: 5, milestone: false },
  { date: "2024-06-05", progress: 18, milestone: true },
  { date: "2024-06-10", progress: 32, milestone: false },
  { date: "2024-06-15", progress: 48, milestone: false },
  { date: "2024-06-20", progress: 60, milestone: true },
  { date: "2024-06-25", progress: 75, milestone: false },
  { date: "2024-06-30", progress: 100, milestone: true },
];

const gradientId = "progress-gradient";

const ProjectTimelineGraph: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 font-plus-jakarta">Project Timeline</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          {/* Gradient for area fill */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {/* Subtle grid */}
          <CartesianGrid strokeDasharray="3 6" stroke="#e5e7eb" />
          {/* X and Y axes */}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#64748b", fontFamily: "Plus Jakarta Sans, sans-serif" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "#64748b", fontFamily: "Plus Jakarta Sans, sans-serif" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          {/* Area for progress fill */}
          <Area
            type="monotone"
            dataKey="progress"
            stroke={"none"}
            fill={`url(#${gradientId})`}
            isAnimationActive={true}
          />
          {/* Main progress line */}
          <Line
            type="monotone"
            dataKey="progress"
            stroke="#6366f1"
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
          />
          {/* Milestone markers */}
          {data.map(
            (entry, idx) =>
              entry.milestone && (
                <ReferenceDot
                  key={idx}
                  x={entry.date}
                  y={entry.progress}
                  r={7}
                  fill="#f59e42"
                  stroke="#fff"
                  strokeWidth={2}
                  // Removed isFront, not supported in recharts@2.x
                  // Add style for zIndex if needed
                  style={{ zIndex: 10 }}
                />
              )
          )}
          {/* Tooltip for details */}
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              fontFamily: "Plus Jakarta Sans, sans-serif",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            labelStyle={{ color: "#6366f1", fontWeight: 600 }}
            itemStyle={{ color: "#0f172a" }}
            formatter={(value: any, name: string) =>
              name === "progress" ? [`${value}%`, "Progress"] : value
            }
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-end mt-2 text-xs text-slate-400 font-plus-jakarta">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-[#f59e42] mr-1"></span>
          Milestone
        </span>
      </div>
    </div>
  );
};

export default ProjectTimelineGraph; 
