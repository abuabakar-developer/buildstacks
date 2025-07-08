import React from "react";
import {
  CloudArrowUpIcon,
  FolderIcon,
  DocumentIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface ActivityItemProps {
  text: string;
}

interface ApprovalItemProps {
  text: string;
}

interface ProjectCardProps {
  name: string;
  docs: number;
  progress: string;
}

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Projects"
          value="12"
          icon={<FolderIcon className="h-8 w-8 text-blue-500" />}
        />
        <StatCard
          title="Total Documents"
          value="580"
          icon={<DocumentIcon className="h-8 w-8 text-green-500" />}
        />
        <StatCard
          title="Pending Approvals"
          value="5"
          icon={<ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />}
        />
        <StatCard
          title="Storage Used"
          value="2.4 GB / 10 GB"
          icon={<CloudArrowUpIcon className="h-8 w-8 text-purple-500" />}
        />
      </div>

      {/* Quick Upload */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Upload</h2>
        <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600">Drag & drop your files here</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Upload Documents
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            <ActivityItem text="Ali uploaded Drawing_A102.pdf in Green Tower Project" />
            <ActivityItem text="Fatima commented on Contract_Doc.pdf" />
            <ActivityItem text="Usman approved Electrical Layout.pdf" />
            <ActivityItem text="New Project Mall Plaza created" />
          </ul>
        </div>

        {/* Recent Documents */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-gray-500 uppercase text-xs border-b">
                <tr>
                  <th className="p-3 text-left">File Name</th>
                  <th className="p-3 text-left">Project</th>
                  <th className="p-3 text-left">Uploaded By</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  {
                    name: "Drawing_A102.pdf",
                    project: "Green Tower",
                    user: "Ali",
                    date: "2025-06-25",
                  },
                  {
                    name: "Contract.pdf",
                    project: "Mall Plaza",
                    user: "Fatima",
                    date: "2025-06-20",
                  },
                ].map((doc, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3">{doc.name}</td>
                    <td className="p-3">{doc.project}</td>
                    <td className="p-3">{doc.user}</td>
                    <td className="p-3">{doc.date}</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
        <ul className="space-y-3">
          <ApprovalItem
            text="Electrical Layout.pdf awaiting approval from Engineer Fatima"
          />
          <ApprovalItem
            text="Contract_2025.pdf awaiting approval from Project Manager"
          />
        </ul>
      </div>

      {/* Active Projects */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard
            name="Green Tower"
            docs={128}
            progress="80%"
          />
          <ProjectCard
            name="Mall Plaza"
            docs={55}
            progress="60%"
          />
        </div>
      </div>

      {/* Storage Usage */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Storage Usage</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: "24%" }}
          ></div>
        </div>
        <p className="mt-2 text-gray-600 text-sm">
          You've used 2.4 GB of your 10 GB plan
        </p>
      </div>

      {/* Notifications Example */}
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <BellIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Your storage usage is reaching its limit. Consider upgrading your
              plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
      <div>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({ text }: ActivityItemProps) {
  return (
    <li className="text-gray-700 flex items-start">
      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-1" />
      {text}
    </li>
  );
}

function ApprovalItem({ text }: ApprovalItemProps) {
  return (
    <li className="text-gray-700 flex items-start">
      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2 mt-1" />
      {text}
    </li>
  );
}

function ProjectCard({ name, docs, progress }: ProjectCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 text-sm mb-2">{docs} documents</p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: progress }}
        ></div>
      </div>
      <p className="mt-1 text-xs text-gray-500">{progress} complete</p>
    </div>
  );
}
