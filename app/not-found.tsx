"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  DocumentIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Page Not Found
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-6">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Link
              href="/dashboard"
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                <HomeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Dashboard</h4>
              <p className="text-sm text-gray-600">Main overview</p>
            </Link>

            <Link
              href="/dashboard?tab=projects"
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Projects</h4>
              <p className="text-sm text-gray-600">Manage projects</p>
            </Link>

            <Link
              href="/dashboard?tab=documents"
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-300"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-200 transition-colors">
                <DocumentIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Documents</h4>
              <p className="text-sm text-gray-600">View files</p>
            </Link>

            <Link
              href="/dashboard?tab=team"
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Team</h4>
              <p className="text-sm text-gray-600">Team members</p>
            </Link>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Go Back
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <HomeIcon className="h-5 w-5" />
            Go Home
          </Link>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 max-w-2xl mx-auto"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            If you believe this is an error or need assistance, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/book-demo"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              Book Demo
            </Link>
            <a
              href="mailto:support@buildstack.com"
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">BuildStack</span>
          </div>
          <p className="text-gray-500 text-sm">
            Construction Management Platform
          </p>
        </motion.div>
      </div>
    </div>
  );
} 