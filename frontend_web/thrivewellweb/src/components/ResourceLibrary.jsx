import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ResourceLibrary = () => {
  const [resources, setResources] = useState({ videos: [], articles: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('mental health');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    setErrorMessage('');
    
    const token = localStorage.getItem("token");
    
    try {
      // First try the main resources endpoint
      console.log(`Fetching resources with query: ${searchQuery}`);
      const url = `http://localhost:8080/api/resources/all?query=${encodeURIComponent(searchQuery)}&maxResults=12`;
      
      const headers = token 
        ? {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        : { "Content-Type": "application/json" };
        
      const response = await fetch(url, { headers });
      
      console.log(`API Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response data:", data);
      
      // Check if the response has the expected structure
      if (!data || ((!data.videos || !Array.isArray(data.videos)) && 
                    (!data.articles || !Array.isArray(data.articles)))) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format from server");
      }
      
      setResources({
        videos: data.videos || [],
        articles: data.articles || []
      });
    } catch (error) {
      console.error('Error fetching resources:', error);
      setErrorMessage('Failed to load resources. Please try again later.');
      
      // If the main endpoint fails, try the test endpoint
      try {
        console.log("Trying fallback test endpoint");
        const testResponse = await fetch('http://localhost:8080/api/resources/test', {
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        });
        
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log("Test endpoint response:", testData);
          
          setResources({
            videos: testData.videos || [],
            articles: testData.articles || []
          });
          
          setErrorMessage('Using sample data. API connection issues detected.');
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const renderVideoCard = (video) => (
    <div key={video.videoId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="rounded-t-xl w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
            Video
          </span>
          <span className="text-gray-500 text-xs">{new Date(video.publishedAt).toLocaleDateString()}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{video.title}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{video.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-xs">{video.channelTitle}</span>
          <a
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition-all duration-200"
          >
            Watch
          </a>
        </div>
      </div>
    </div>
  );

  const renderArticleCard = (article) => (
    <div key={article.url} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="rounded-t-xl w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/800x400?text=No+Image+Available';
          }}
        />
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
            Article
          </span>
          <span className="text-gray-500 text-xs">{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-xs">{article.source}</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition-all duration-200"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );

  const getDisplayedResources = () => {
    switch (activeTab) {
      case 'videos':
        return resources.videos.map(renderVideoCard);
      case 'articles': 
        return resources.articles.map(renderArticleCard);
      default:
        // 'all' tab - combine and alternate between videos and articles
        const combinedResources = [];
        const maxLength = Math.max(resources.videos.length, resources.articles.length);
        
        for (let i = 0; i < maxLength; i++) {
          if (i < resources.videos.length) {
            combinedResources.push(renderVideoCard(resources.videos[i]));
          }
          if (i < resources.articles.length) {
            combinedResources.push(renderArticleCard(resources.articles[i]));
          }
        }
        
        return combinedResources;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userName={localStorage.getItem("userName")} />
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <h1 className="text-3xl font-semibold text-teal-700 mb-4 md:mb-0">🧘 Mental Health Resource Library</h1>
              
              <form onSubmit={handleSearch} className="w-full md:w-auto">
                <div className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources..."
                    className="px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-64"
                  />
                  <button
                    type="submit"
                    className="bg-teal-600 text-white px-4 py-2 rounded-r-lg hover:bg-teal-700 transition-all duration-200"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`mr-8 py-4 px-1 ${
                      activeTab === 'all'
                        ? 'border-b-2 border-teal-500 text-teal-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } font-medium`}
                  >
                    All Resources
                  </button>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className={`mr-8 py-4 px-1 ${
                      activeTab === 'videos'
                        ? 'border-b-2 border-teal-500 text-teal-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } font-medium`}
                  >
                    Videos
                  </button>
                  <button
                    onClick={() => setActiveTab('articles')}
                    className={`py-4 px-1 ${
                      activeTab === 'articles'
                        ? 'border-b-2 border-teal-500 text-teal-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } font-medium`}
                  >
                    Articles
                  </button>
                </nav>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                <p>{errorMessage}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : (
              <>
                {getDisplayedResources().length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getDisplayedResources()}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow">
                    <p className="text-gray-600 text-lg">No resources found. Try a different search term.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceLibrary;