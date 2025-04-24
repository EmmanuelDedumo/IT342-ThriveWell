import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AddEntry = () => {
  const [moodType, setMoodType] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const moods = [
    { type: "Happy", emoji: "😊", color: "green", bgColor: "bg-green-50", borderColor: "border-green-500" },
    { type: "Sad", emoji: "😢", color: "blue", bgColor: "bg-blue-50", borderColor: "border-blue-500" },
    { type: "Anxious", emoji: "😰", color: "yellow", bgColor: "bg-yellow-50", borderColor: "border-yellow-500" },
    { type: "Neutral", emoji: "😐", color: "gray", bgColor: "bg-gray-50", borderColor: "border-gray-500" },
    { type: "Angry", emoji: "😡", color: "red", bgColor: "bg-red-50", borderColor: "border-red-500" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!moodType || !notes) {
      setError("Please fill in both mood type and notes.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    try {
      await axios.post(
        "http://localhost:8080/api/moodentry",
        { moodType, notes },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      setSuccess("Mood entry created successfully!");
      setMoodType("");
      setNotes("");
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error creating mood entry", err);
      setError("Failed to create mood entry.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const selectedMood = moods.find(mood => mood.type === moodType);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userName="User" />
        
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Today's Mood</h1>
            <p className="text-gray-600 mb-8">Record how you're feeling and your thoughts</p>
            
            {/* Form Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Mood Selection */}
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  How are you feeling today?
                </h2>
                
                <div className="grid grid-cols-5 gap-4">
                  {moods.map((mood) => (
                    <button
                      key={mood.type}
                      type="button"
                      onClick={() => setMoodType(mood.type)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                        moodType === mood.type 
                          ? `${mood.bgColor} ${mood.borderColor} border-2` 
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-4xl mb-2">{mood.emoji}</span>
                      <span className="text-sm font-medium">{mood.type}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Notes */}
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's on your mind?
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                  rows="5"
                  placeholder="Write your thoughts, feelings, or anything you'd like to remember about today..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                />
              </div>
              
              {/* Submit Section */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {selectedMood && (
                    <span>Selected mood: <span className="font-medium">{selectedMood.type}</span></span>
                  )}
                </div>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200"
                >
                  Save Entry
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

export default AddEntry;