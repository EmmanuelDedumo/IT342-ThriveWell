import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const ViewAllGoals = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("targetDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  const categoryOptions = [
    { value: "All" },
    { value: "Personal" },
    { value: "Health" },
    { value: "Career" },
    { value: "Education" },
    { value: "Financial" }
  ];

  const progressOptions = [
    { value: "All", color: "bg-gray-100 text-gray-800" },
    { value: "Not Started", color: "bg-gray-100 text-gray-800" },
    { value: "In Progress", color: "bg-blue-100 text-blue-800" },
    { value: "Completed", color: "bg-green-100 text-green-800" }
  ];

  const priorityColors = {
    "Low": "bg-gray-100 text-gray-700",
    "Medium": "bg-blue-100 text-blue-700",
    "High": "bg-red-100 text-red-700"
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/goal", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setGoals(response.data);
    } catch (err) {
      console.error("Error fetching goals", err);
      setError("Failed to load goals.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await axios.delete(`http://localhost:8080/api/goal/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        // Refresh the goals list
        fetchGoals();
        setSuccess("Goal deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("Error deleting goal", err);
        setError("Failed to delete goal.");
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const handleEditGoal = (id) => {
    // Navigate to edit page
    navigate(`/goal/edit/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const calculateDaysRemaining = (targetDate) => {
    if (!targetDate) return null;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter and sort goals
  const filteredAndSortedGoals = goals
    .filter(goal => {
      const statusMatch = filterStatus === "All" || goal.progress === filterStatus;
      const categoryMatch = filterCategory === "All" || goal.category === filterCategory;
      return statusMatch && categoryMatch;
    })
    .sort((a, b) => {
      if (sortBy === "targetDate") {
        // Handle null dates
        if (!a.targetDate) return sortOrder === "asc" ? 1 : -1;
        if (!b.targetDate) return sortOrder === "asc" ? -1 : 1;
        
        const dateA = new Date(a.targetDate);
        const dateB = new Date(b.targetDate);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "priority") {
        const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
        const priorityA = priorityOrder[a.priority] || 0;
        const priorityB = priorityOrder[b.priority] || 0;
        return sortOrder === "asc" ? priorityA - priorityB : priorityB - priorityA;
      } else if (sortBy === "progress") {
        const progressOrder = { "Not Started": 1, "In Progress": 2, "Completed": 3 };
        const progressA = progressOrder[a.progress] || 0;
        const progressB = progressOrder[b.progress] || 0;
        return sortOrder === "asc" ? progressA - progressB : progressB - progressA;
      }
      return 0;
    });

  // Calculate completion percentages
  const getTotalGoals = () => goals.length;
  const getCompletedGoals = () => goals.filter(goal => goal.progress === "Completed").length;
  const getCompletionPercentage = () => {
    const total = getTotalGoals();
    return total > 0 ? Math.round((getCompletedGoals() / total) * 100) : 0;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userName={localStorage.getItem("userName")} />
        
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Goals</h1>
                <p className="text-gray-600">Track and manage your progress</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => navigate("/goal")}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Create New Goal
                </button>
              </div>
            </div>
            
            {/* Progress Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Progress Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Goals</div>
                  <div className="text-2xl font-bold text-gray-800">{getTotalGoals()}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Completed</div>
                  <div className="text-2xl font-bold text-gray-800">{getCompletedGoals()}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
                  <div className="text-2xl font-bold text-gray-800">{getCompletionPercentage()}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                      style={{width: `${getCompletionPercentage()}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filters and Sorting */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                  <div className="flex flex-wrap gap-2">
                    {progressOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFilterStatus(option.value)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filterStatus === option.value
                            ? `${option.color} border-2 border-blue-500`
                            : `${option.color} border border-gray-200`
                        }`}
                      >
                        {option.value}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFilterCategory(option.value)}
                        className={`px-3 py-1 rounded-full text-sm border ${
                          filterCategory === option.value
                            ? "bg-blue-50 border-blue-500"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        {option.value}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sorting */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <div className="flex items-center space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 flex-1"
                    >
                      <option value="targetDate">Target Date</option>
                      <option value="priority">Priority</option>
                      <option value="progress">Progress</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="p-2 rounded-lg border border-gray-300"
                    >
                      {sortOrder === "asc" ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Goals List */}
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading goals...</p>
              </div>
            ) : filteredAndSortedGoals.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <p className="text-gray-500 mb-4">
                  {goals.length === 0 
                    ? "You haven't created any goals yet." 
                    : "No goals match your current filters."}
                </p>
                {goals.length === 0 && (
                  <button 
                    onClick={() => navigate("/goal/create")}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  >
                    Create Your First Goal
                  </button>
                )}
                {goals.length > 0 && (
                  <button 
                    onClick={() => {
                      setFilterStatus("All");
                      setFilterCategory("All");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedGoals.map((goal) => {
                  const daysRemaining = calculateDaysRemaining(goal.targetDate);
                  return (
                    <div 
                      key={goal.id} 
                      className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-200 ${
                        goal.progress === "Completed" ? "border-green-200" : "border-gray-100"
                      }`}
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-gray-100 flex justify-between">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">{goal.category}</span>
                        </div>
                        <div>
                          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[goal.priority] || "bg-gray-100"}`}>
                            {goal.priority}
                          </span>
                        </div>
                      </div>
                      
                      {/* Body */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{goal.goalName}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{goal.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{goal.progress}</span>
                            {goal.progress === "Not Started" && <span>0%</span>}
                            {goal.progress === "In Progress" && <span>50%</span>}
                            {goal.progress === "Completed" && <span>100%</span>}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                goal.progress === "Not Started" ? "bg-gray-400 w-0" :
                                goal.progress === "In Progress" ? "bg-blue-500 w-1/2" :
                                "bg-green-500 w-full"
                              }`}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Date Info */}
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <span>{formatDate(goal.targetDate)}</span>
                          
                          {daysRemaining !== null && (
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              daysRemaining < 0 ? 'bg-red-100 text-red-700' : 
                              daysRemaining < 7 ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-green-100 text-green-700'
                            }`}>
                              {daysRemaining < 0 
                                ? `${Math.abs(daysRemaining)}d overdue` 
                                : daysRemaining === 0 
                                  ? 'Today' 
                                  : `${daysRemaining}d left`}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEditGoal(goal.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
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

export default ViewAllGoals;