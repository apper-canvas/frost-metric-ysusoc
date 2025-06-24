import { NavLink, Outlet, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "@/index.css";
import activitiesData from "@/services/mockData/activities.json";
import contactsData from "@/services/mockData/contacts.json";
import dealsData from "@/services/mockData/deals.json";
import customFieldsData from "@/services/mockData/customFields.json";
import tasksData from "@/services/mockData/tasks.json";
import { routeArray } from "@/config/routes";
import ApperIcon from "@/components/ApperIcon";
const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const visibleRoutes = routeArray.filter(route => !route.hidden);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  const logout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // In a real app, you might redirect to login or call an auth service
    console.log('User logged out');
    // You could also dispatch a logout action or call a logout API
  };
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Mobile Header */}
      <header className="lg:hidden flex-shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-violet rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-semibold text-xl text-gray-900">FlowCRM</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ApperIcon name="Menu" className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-60 bg-surface border-r border-gray-200">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-violet rounded-xl flex items-center justify-center">
                <ApperIcon name="Zap" className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">FlowCRM</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {visibleRoutes.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'text-gray-700 hover:bg-white hover:text-primary hover:shadow-sm'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-5 h-5" />
                {route.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-50"
                onClick={closeMobileMenu}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-surface border-r border-gray-200 z-50"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-violet rounded-xl flex items-center justify-center">
                        <ApperIcon name="Zap" className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-display font-bold text-xl text-gray-900">FlowCRM</span>
                    </div>
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ApperIcon name="X" className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <nav className="p-4 space-y-1">
                  {visibleRoutes.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'text-gray-700 hover:bg-white hover:text-primary hover:shadow-sm'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} className="w-5 h-5" />
                      {route.label}
</NavLink>
                  ))}
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-700 hover:bg-white hover:text-primary hover:shadow-sm mt-4 w-full"
                  >
                    <ApperIcon name="LogOut" className="w-5 h-5" />
                    Logout
                  </button>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center z-30"
        onClick={() => {
          // Quick add functionality - would open a modal in real implementation
          console.log('Quick add clicked');
        }}
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default Layout;