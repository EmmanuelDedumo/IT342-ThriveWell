import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useParams, useNavigate } from "react-router-dom";

const EditGoal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { goalName, description, targetDate, progress, category, priority } = formData;

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

  useEffect(() => {
    fetchGoal();
  }, [id]);

  const fetchGoal = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/goal/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      const goal = response.data;
      
      // Populate form data
      setFormData({
        goalName: goal.goalName || "",
        description: goal.description || "",
        targetDate: goal.targetDate ? goal.targetDate.split("T")[0] : "",
        progress: goal.progress || "Not Started",
        category: goal.category || "Personal",
        priority: goal.priority || "Medium"
      });
      
    } catch (err) {
      console.error("Error fetching goal", err);
      setError("Failed to load goal. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    if (!goalName || !description || !targetDate) {
      setError("Please fill in all required fields.");
      setIsSaving(false);
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/goal/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess("Goal updated successfully!");
      setTimeout(() => {
        navigate("/goal/view"); // Fixed route path
      }, 1500);
      
    } catch (err) {
      console.error("Error updating goal", err);
      setError(err.response?.data?.message || "Failed to update goal.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/goal/view"); // Fixed route path
  };

  const selectedProgressOption = progressOptions.find(option => option.value === progress);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userName={localStorage.getItem("userName")} />
        
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Goal</h1>
              <p className="text-gray-600">Update your goal details and progress</p>
            </div>
            
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading goal details...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Basic Info Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 mb-1">
                        Goal Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="goalName"
                        name="goalName"
                        value={goalName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="What do you want to achieve?"
                        required
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Provide details about your goal..."
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Target Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="targetDate"
                        name="targetDate"
                        value={targetDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {daysRemaining !== null && (
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full inline-block ${
                            daysRemaining < 0 ? 'bg-red-100 text-red-700' : 
                            daysRemaining < 7 ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {daysRemaining < 0 
                              ? `${Math.abs(daysRemaining)} days overdue` 
                              : daysRemaining === 0 
                                ? 'Due today' 
                                : `${daysRemaining} days remaining`}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          name="category"
                          value={category}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none"
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
                  </div>
                </div>
                
                {/* Progress Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Progress & Priority</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Progress
                      </label>
                      <select
                        name="progress"
                        value={progress}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none"
                      >
                        {progressOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.value} ({option.percentage}%)
                          </option>
                        ))}
                      </select>
                      
                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              progress === "Not Started" ? "bg-gray-400" :
                              progress === "In Progress" ? "bg-blue-500" :
                              "bg-green-500"
                            }`} 
                            style={{ width: `${selectedProgressOption.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level
                      </label>
                      <select
                        name="priority"
                        value={priority}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none"
                      >
                        {priorityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : "Save Changes"}
                  </button>
                </div>
              </form>
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

export default EditGoal;