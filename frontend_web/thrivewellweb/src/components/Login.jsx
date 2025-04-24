import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for any messages passed from other components (like signup)
  useEffect(() => {
    if (location.state?.message) {
      setError(null); // Clear any existing errors
    }
  }, [location.state]);

  // Create axios instance with better error handling
  const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000, // 5 second timeout
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(
        "/auth/login",
        { email, password }
      );
      
      // Successfully logged in
      if (response.data && response.data.token) {
        // Store the token securely
        localStorage.setItem("token", response.data.token);
        
        // Store token expiration time if available
        if (response.data.expiresIn) {
          const expiresAt = new Date().getTime() + response.data.expiresIn * 1000;
          localStorage.setItem("tokenExpiration", expiresAt);
        }
        
        // Redirect to dashboard
        navigate("/entries/add");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Error during login:", err);
      
      // Handle connection errors with retry logic
      if (err.code === 'ECONNABORTED' || !err.response) {
        // Connection timeout or server not responding
        if (connectionAttempts < 2) {
          setConnectionAttempts(prev => prev + 1);
          setError("Connection issue. Retrying...");
          
          // Wait 1 second before retrying
          setTimeout(() => {
            handleSubmit(e);
          }, 1000);
          return;
        } else {
          setError("Cannot connect to server. Please check if the backend is running.");
        }
      } 
      // Handle different types of error responses
      else if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid email or password. Please try again.");
        } else if (err.response.status === 403) {
          setError("You don't have permission to access this resource.");
        } else {
          setError(`Login failed: ${err.response.data || 'Please try again later.'}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login success
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Decode the credential to get user info
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Send Google token to backend for verification and JWT generation
      const response = await api.post("/auth/google-login", {
        token: credentialResponse.credential,
        email: decoded.email,
        fullName: decoded.name
      });
      
      if (response.data && response.data.token) {
        // Store the token securely
        localStorage.setItem("token", response.data.token);
        
        // Store token expiration time if available
        if (response.data.expiresIn) {
          const expiresAt = new Date().getTime() + response.data.expiresIn * 1000;
          localStorage.setItem("tokenExpiration", expiresAt);
        }
        
        // Redirect to dashboard
        navigate("/entries/add");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Error during Google login:", err);
      setError("Google login failed. Please try again or use email/password.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login error
  const handleGoogleLoginError = () => {
    setError("Google sign-in was canceled or failed. Please try again.");
  };

  // Function to create an authorization header for subsequent requests
  const createAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-2 text-gray-600">Please enter your details to sign in</p>
          </div>

          {/* Show success message from redirects */}
          {location.state?.message && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-600">{location.state.message}</p>
            </div>
          )}

          {/* Show error messages */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  placeholder="johndoe@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <div className="px-4 text-sm text-gray-500">or continue with</div>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Sign-In Button */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                useOneTap
                theme="outline"
                shape="rectangular"
                text="continue_with"
                width="320"
              />
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-semibold text-blue-600 hover:text-blue-800">
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Right side - Image without gray overlay */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(/assets/Login.jpg)' }}>
        <div className="h-full w-full flex items-center justify-center">
        </div>
      </div>
    </div>
  );
};

export default Login;