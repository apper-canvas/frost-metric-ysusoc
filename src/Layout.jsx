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
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-soft">
      {/* Mobile Header */}
      <header className="lg:hidden flex-shrink-0 h-18 bg-white/80 backdrop-blur-md shadow-soft flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-violet rounded-xl flex items-center justify-center shadow-primary">
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-neutral-800">FlowCRM</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-xl transition-all duration-200"
        >
          <ApperIcon name="Menu" className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white/60 backdrop-blur-md shadow-soft-md">
          {/* Logo */}
          <div className="p-8">
<div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-violet rounded-2xl flex items-center justify-center shadow-primary">
                <ApperIcon name="Zap" className="w-7 h-7 text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-neutral-800">FlowCRM</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 pb-6 space-y-2 overflow-y-auto">
            {visibleRoutes.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-violet text-white shadow-primary-lg transform scale-[1.02]'
                      : 'text-neutral-600 hover:bg-white/80 hover:text-primary-600 hover:shadow-soft hover:transform hover:scale-[1.01]'
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
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={closeMobileMenu}
              />
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white/90 backdrop-blur-lg shadow-soft-xl z-50"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-gradient-violet rounded-2xl flex items-center justify-center shadow-primary">
                        <ApperIcon name="Zap" className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-display font-bold text-xl text-neutral-800">FlowCRM</span>
                    </div>
                    <button
                      onClick={closeMobileMenu}
                      className="p-2.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 rounded-xl transition-all duration-200"
                    >
                      <ApperIcon name="X" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
<nav className="px-6 pb-6 space-y-3">
                  {visibleRoutes.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-violet text-white shadow-primary-lg'
                            : 'text-neutral-600 hover:bg-surface-100 hover:text-primary-600 hover:shadow-soft'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} className="w-5 h-5" />
                      {route.label}
                    </NavLink>
                  ))}
                  <div className="pt-4 mt-6 border-t border-neutral-100">
                    <button
                      onClick={logout}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 text-neutral-600 hover:bg-error-50 hover:text-error-600 hover:shadow-soft w-full"
                    >
                      <ApperIcon name="LogOut" className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

{/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50/30 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-accent text-white rounded-2xl shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 flex items-center justify-center z-30"
        onClick={() => {
          // Quick add functionality - would open a modal in real implementation
          console.log('Quick add clicked');
        }}
      >
        <ApperIcon name="Plus" className="w-7 h-7" />
      </motion.button>
    </div>
  );
};

export default Layout;