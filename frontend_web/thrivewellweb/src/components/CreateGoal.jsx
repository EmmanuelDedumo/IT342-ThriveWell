import React, { useState } from "react";
import axios from "axios";
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const CreateGoal = () => {
  const [formData, setFormData] = useState({
    goalName: "",
    description: "",
    targetDate: "",
    progress: "Not Started",
    category: "Personal",
    priority: "Medium"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { goalName, description, targetDate, progress, category, priority } = formData;

  // Options for dropdowns
  const progressOptions = [
    { value: "Not Started", percentage: 0 },
    { value: "In Progress", percentage: 50 },
    { value: "Completed", percentage: 100 }
  ];

  const categoryOptions = [
    { value: "Personal" },
    { value: "Health" },
    { value: "Career" },
    { value: "Education" },
    { value: "Financial" }
  ];

  const priorityOptions = [
    { value: "Low", color: "text-gray-700" },
    { value: "Medium", color: "text-blue-700" },
    { value: "High", color: "text-red-700" }
  ];

  // Calculate days remaining until target date
  const getDaysRemaining = () => {
    if (!targetDate) return null;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!goalName || !description || !targetDate) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/goal",
        {
          ...formData
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess("Goal created successfully!");
      setFormData({
        goalName: "",
        description: "",
        targetDate: "",
        progress: "Not Started",
        category: "Personal",
        priority: "Medium"
      });
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error creating goal", err);
      setError(err.response?.data?.message || "Failed to create goal.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedProgressOption = progressOptions.find(option => option.value === progress);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userName={localStorage.getItem("userName")} />
        
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Goal Setting</h1>
            <p className="text-gray-600 mb-8">Define your objectives and track your progress towards personal success</p>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-blue-50">
                <h2 className="text-xl font-semibold text-gray-800">Create a New Goal</h2>
                <p className="text-sm text-gray-600 mt-1">Set clear, achievable goals with measurable outcomes</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Goal Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    type="text"
                    name="goalName"
                    value={goalName}
                    onChange={handleChange}
                    placeholder="What do you want to achieve?"
                    required
                  />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none"
                      >
                        {categoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.value}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        name="priority"
                        value={priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none"
                      >
                        {priorityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.value}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                    rows="4"
                    name="description"
                    placeholder="Describe your goal in detail"
                    value={description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Date and Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Target Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      type="date"
                      name="targetDate"
                      value={targetDate}
                      onChange={handleChange}
                      required
                    />
                    {daysRemaining !== null && (
                      <p className={`mt-2 text-sm ${daysRemaining < 0 ? 'text-red-500' : daysRemaining < 7 ? 'text-orange-500' : 'text-green-600'}`}>
                        {daysRemaining < 0 
                          ? `Overdue by ${Math.abs(daysRemaining)} days` 
                          : daysRemaining === 0 
                            ? 'Due today!' 
                            : daysRemaining === 1 
                              ? 'Due tomorrow' 
                              : `${daysRemaining} days remaining`}
                      </p>
                    )}
                  </div>

                  {/* Progress Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Progress Status
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      name="progress"
                      value={progress}
                      onChange={handleChange}
                    >
                      {progressOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </select>
                    
                    {/* Progress Visualization */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                          style={{width: `${selectedProgressOption?.percentage || 0}%`}}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              
              {/* Submit Section */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Fields marked with <span className="text-red-500">*</span> are required
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Create Goal
                </button>
              </div>
            </div>
            
            {/* Feedback Messages */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{success}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGoal;