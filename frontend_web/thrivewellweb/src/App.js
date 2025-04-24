import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Lazy load components
const LandingPage = lazy(() => import('./components/LandingPage'));
const Signup = lazy(() => import('./components/Signup'));
const Login = lazy(() => import('./components/Login'));
const AddEntry = lazy(() => import('./components/AddEntry'));
const ManageEntries = lazy(() => import('./components/ManageEntries'));
const ViewAllGoals = lazy(() => import('./components/ViewAllGoals'));
const EditGoal = lazy(() => import('./components/EditGoal'));
const ResourceLibrary = lazy(() => import('./components/ResourceLibrary'));
const Charts = lazy(() => import('./components/Charts'));
const CreateGoal = lazy(() => import('./components/CreateGoal'));
const UserProfile = lazy(() => import('./components/UserProfile'));

// Modern Loading Spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen w-full bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {/* Outer circle */}
        <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
        {/* Spinning inner circle */}
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
    </div>
  </div>
);

// Custom hook to use navigate outside of component
const withAuth = (Component) => {
  return (props) => {
    // Check if running in a browser context (not during SSR)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      
      // If no token, redirect to login
      if (!token) {
        return <Navigate to="/login" replace />;
      }
     
      // If token exists, render the protected component
      return <Component {...props} />;
    }

    // Default fallback if not in browser context
    return null;
  };
};

function App() {
  // Replace this with your actual Google Client ID
  const GOOGLE_CLIENT_ID = "523582901522-lopkjavvunrcv7ocr7mg6q5376gtb4g4.apps.googleusercontent.com";
  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* User Profile route */}
            <Route path="/profile" element={withAuth(UserProfile)()} />
           
            {/* Journal entry routes */}
            <Route path="/entries/add" element={withAuth(AddEntry)()} />
            <Route path="/entries/manage" element={withAuth(ManageEntries)()} />
           
            {/* Goal management routes */}
            <Route path="/goal/create" element={withAuth(CreateGoal)()} />
            <Route path="/goal/view" element={withAuth(ViewAllGoals)()} />
            <Route path="/goal/edit/:id" element={withAuth(EditGoal)()} />
           
            {/* Other routes */}
            <Route path="/resources" element={withAuth(ResourceLibrary)()} />
            <Route path="/charts" element={withAuth(Charts)()} />
           
            {/* Catch all - redirect to dashboard if authenticated, otherwise to login */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;