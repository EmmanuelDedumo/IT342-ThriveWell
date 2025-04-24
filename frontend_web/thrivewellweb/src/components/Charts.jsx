import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Charts = () => {
  const [moodData, setMoodData] = useState({
    moodCounts: {},
    moodTimeline: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'

  // Updated mood types with corresponding colors and emojis
  const moods = [
    { type: "Happy", emoji: "😊", color: "rgba(34, 197, 94, 0.7)", borderColor: "rgb(34, 197, 94)" },
    { type: "Sad", emoji: "😢", color: "rgba(59, 130, 246, 0.7)", borderColor: "rgb(59, 130, 246)" },
    { type: "Anxious", emoji: "😰", color: "rgba(234, 179, 8, 0.7)", borderColor: "rgb(234, 179, 8)" },
    { type: "Neutral", emoji: "😐", color: "rgba(156, 163, 175, 0.7)", borderColor: "rgb(156, 163, 175)" },
    { type: "Angry", emoji: "😡", color: "rgba(239, 68, 68, 0.7)", borderColor: "rgb(239, 68, 68)" }
  ];

  // Use useCallback to memoize the fetchMoodData function
  const fetchMoodData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(
        `http://localhost:8080/api/moodentry/stats/${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Check if response data has the expected structure
      if (response.data && typeof response.data === 'object') {
        setMoodData(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Received unexpected data format from server.");
      }
      
    } catch (err) {
      console.error("Error fetching mood data:", err);
      
      // More specific error messages based on error type
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else if (err.response.status === 404) {
          setError("Stats endpoint not found. Please check your API.");
        } else {
          setError(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setError("Failed to load mood charts data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchMoodData();
  }, [fetchMoodData]);

  // Data preparation for the Pie Chart (Mood Distribution)
  const pieChartData = {
    labels: Object.keys(moodData.moodCounts || {}),
    datasets: [
      {
        data: Object.values(moodData.moodCounts || {}),
        backgroundColor: moods.map(mood => mood.color),
        borderColor: moods.map(mood => mood.borderColor),
        borderWidth: 1,
      },
    ],
  };

  // Data preparation for the Bar Chart (Mood Frequency)
  const barChartData = {
    labels: Object.keys(moodData.moodCounts || {}),
    datasets: [
      {
        label: 'Frequency',
        data: Object.values(moodData.moodCounts || {}),
        backgroundColor: moods.map(mood => mood.color),
        borderColor: moods.map(mood => mood.borderColor),
        borderWidth: 1,
      },
    ],
  };

  // Data preparation for the Line Chart (Mood Timeline)
  const prepareTimelineData = () => {
    if (!moodData.moodTimeline || moodData.moodTimeline.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Get all dates from the timeline entries
    const dates = moodData.moodTimeline.map(entry => entry.date);
    const uniqueDates = [...new Set(dates)].sort();
    
    // Create datasets for each mood type
    const datasets = moods.map(mood => {
      const data = uniqueDates.map(date => {
        // Count occurrences of this mood on this date
        return moodData.moodTimeline.filter(
          entry => entry.date === date && entry.mood === mood.type
        ).length;
      });

      return {
        label: mood.type,
        data,
        borderColor: mood.borderColor,
        backgroundColor: mood.color,
        tension: 0.3,
        fill: false,
      };
    });

    return {
      labels: uniqueDates.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets,
    };
  };

  const lineChartData = prepareTimelineData();

  // Charts options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Mood Insights',
      },
    },
  };

  // Calculate total entries and percentages
  const calculateTotalEntries = () => {
    if (!moodData.moodCounts) return 0;
    return Object.values(moodData.moodCounts).reduce((sum, val) => sum + val, 0);
  };

  const totalEntries = calculateTotalEntries();

  // Function to retry loading data
  const handleRetry = () => {
    fetchMoodData();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userName="User" />
        
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Mood Analytics</h1>
                <p className="text-gray-600">Visualize and track your mood patterns over time</p>
              </div>
              
              {/* Time range selector */}
              <div className="flex space-x-2">
                {['week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      timeRange === range
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded flex flex-col">
                <p>{error}</p>
                <button 
                  onClick={handleRetry}
                  className="mt-3 self-end px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : totalEntries === 0 ? (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-6 rounded-lg text-center">
                <h3 className="text-xl font-medium mb-2">No mood data available</h3>
                <p className="mb-4">Start recording your moods to see analytics here!</p>
                <a 
                  href="/entries/add" 
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Mood Entry
                </a>
              </div>
            ) : (
              <>
                {/* Mood Insights Section at the top */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Insights</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {moods.map(mood => {
                      const count = moodData.moodCounts ? moodData.moodCounts[mood.type] || 0 : 0;
                      const percentage = totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;
                      
                      return (
                        <div 
                          key={mood.type}
                          className={`rounded-lg p-4 border ${
                            mood.type === "Happy" ? "border-green-200 bg-green-50" :
                            mood.type === "Sad" ? "border-blue-200 bg-blue-50" :
                            mood.type === "Anxious" ? "border-yellow-200 bg-yellow-50" :
                            mood.type === "Neutral" ? "border-gray-200 bg-gray-50" :
                            "border-red-200 bg-red-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{mood.emoji}</span>
                            <span className="text-xl font-bold">{percentage}%</span>
                          </div>
                          <h3 className="font-medium">{mood.type}</h3>
                          <p className="text-sm text-gray-600">
                            {count} {count === 1 ? 'entry' : 'entries'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Mood Distribution Chart (Pie) */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Mood Distribution</h2>
                    <div className="h-64">
                      <Pie data={pieChartData} options={chartOptions} />
                    </div>
                  </div>
                  
                  {/* Mood Frequency Chart (Bar) */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Mood Frequency</h2>
                    <div className="h-64">
                      <Bar data={barChartData} options={chartOptions} />
                    </div>
                  </div>
                  
                  {/* Mood Timeline Chart (Line) - Full width */}
                  <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Mood Timeline</h2>
                    <div className="h-80">
                      {moodData.moodTimeline && moodData.moodTimeline.length > 0 ? (
                        <Line data={lineChartData} options={chartOptions} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          Insufficient data for timeline visualization
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;