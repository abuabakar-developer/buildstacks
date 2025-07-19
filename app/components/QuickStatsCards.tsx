"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BuildingOfficeIcon,
  DocumentIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

interface QuickStatCardProps {
  title: string;
  value: number;
  increase: number;
  icon: React.ReactNode;
  isFirst?: boolean;
  color: string;
}

const QuickStatCard: React.FC<QuickStatCardProps> = ({
  title,
  value,
  increase,
  icon,
  isFirst = false,
  color,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative overflow-hidden rounded-3xl p-4 sm:p-6 transition-all duration-300 ${
        isFirst 
          ? "bg-gradient-to-br from-black via-gray-900 to-black text-white" 
          : "bg-white border border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Icon Section */}
        <div className="mb-3 sm:mb-4">
          <div className={`inline-flex p-2 sm:p-3 rounded-2xl transition-all duration-300 ${
            isFirst 
              ? "bg-white/20 text-white" 
              : "bg-gray-100 text-gray-600"
          } group-hover:scale-110`}>
            <div className="w-5 h-5 sm:w-6 sm:h-6">
              {icon}
            </div>
          </div>
        </div>

        {/* Content Section - Left Aligned */}
        <div className="flex-1">
          {/* Title */}
          <h3 className={`text-base sm:text-lg font-semibold mb-2 ${
            isFirst ? "text-white/90" : "text-black/80"
          } font-plus-jakarta`}>
            {title}
          </h3>
          
          {/* Value */}
          <div className={`text-2xl sm:text-3xl font-bold mb-2 ${
            isFirst ? "text-white" : "text-black"
          } font-plus-jakarta`}>
            {value.toLocaleString()}
          </div>
          
          {/* Percentage Increase */}
          <div className="flex items-center gap-2">
            <span className={`text-xs sm:text-sm font-medium ${
              increase >= 0 
                ? isFirst ? "text-green-300" : "text-green-600"
                : isFirst ? "text-red-300" : "text-red-600"
            }`}>
              {increase >= 0 ? "+" : ""}{increase}%
            </span>
            <span className={`text-xs sm:text-sm ${
              isFirst ? "text-white/70" : "text-black/60"
            } font-inter`}>
              from last month
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface QuickStatsCardsProps {
  projects: any[];
  documents: any[];
  teamMembers: any[];
  tasksByProject: { [key: string]: any[] };
}

const QuickStatsCards: React.FC<QuickStatsCardsProps> = ({
  projects,
  documents,
  teamMembers,
  tasksByProject,
}) => {
  // Calculate realistic percentage increases based on data
  const calculateIncrease = (current: number, previous: number = 0) => {
    if (previous === 0) return current > 0 ? Math.floor(Math.random() * 20) + 5 : 0;
    const change = ((current - previous) / previous) * 100;
    return Math.round(change);
  };

  // Mock previous month data (in real app, you'd fetch this from your database)
  const previousData = {
    projects: Math.max(0, projects.length - Math.floor(Math.random() * 3) - 1),
    documents: Math.max(0, documents.length - Math.floor(Math.random() * 10) - 5),
    teamMembers: Math.max(0, teamMembers.length - Math.floor(Math.random() * 2)),
    tasks: Math.max(0, Object.values(tasksByProject).reduce((acc: number, t) => acc + (Array.isArray(t) ? t.length : 0), 0) - Math.floor(Math.random() * 5) - 2),
  };

  const statsData = [
    {
      title: "Total Projects",
      value: projects.length,
      increase: calculateIncrease(projects.length, previousData.projects),
      icon: <BuildingOfficeIcon className="w-6 h-6" />,
      color: "blue",
      isFirst: true,
    },
    {
      title: "Documents",
      value: documents.length,
      increase: calculateIncrease(documents.length, previousData.documents),
      icon: <DocumentIcon className="w-6 h-6" />,
      color: "green",
    },
    {
      title: "Team Members",
      value: teamMembers.length,
      increase: calculateIncrease(teamMembers.length, previousData.teamMembers),
      icon: <UsersIcon className="w-6 h-6" />,
      color: "purple",
    },
    {
      title: "Active Tasks",
      value: Object.values(tasksByProject).reduce((acc: number, t) => acc + (Array.isArray(t) ? t.length : 0), 0),
      increase: calculateIncrease(
        Object.values(tasksByProject).reduce((acc: number, t) => acc + (Array.isArray(t) ? t.length : 0), 0),
        previousData.tasks
      ),
      icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
      color: "yellow",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statsData.map((stat, index) => (
        <QuickStatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          increase={stat.increase}
          icon={stat.icon}
          isFirst={stat.isFirst}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default QuickStatsCards; 
