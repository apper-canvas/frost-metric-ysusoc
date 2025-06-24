import { BrowserRouter, Routes, Route, ErrorBoundary } from 'react-router-dom';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import { routeArray } from '@/config/routes';
import NotFound from '@/components/pages/NotFound';

// Error Boundary Component for Route Errors
const RouteErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">There was an error loading this page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
function App() {
  return (
    <BrowserRouter>
      <div className="App">
<RouteErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Layout />}>
                {routeArray.map((route) => (
                  <Route 
                    key={route.id} 
                    path={route.path} 
                    element={<route.component />} 
                  />
                ))}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;