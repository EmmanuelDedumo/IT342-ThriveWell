import React from 'react';

const HeroSection = () => {
  return (
    <section id="home" className="pt-28 pb-24 md:pt-36 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Your Journey To <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Wellness</span> Starts Here
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              ThriveWell empowers you to track your moods, set achievable goals, journal your thoughts, and connect with a supportive community on your path to well-being.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="#features" 
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all"
              >
                Get Started
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a 
                href="#faq" 
                className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100 rounded-3xl transform rotate-3 scale-105"></div>
              <img 
                src="/assets/Hero Image.jpg" 
                alt="ThriveWell App Dashboard" 
                className="relative z-10 rounded-3xl shadow-xl w-full object-cover" 
              />
              {/* Floating elements for visual appeal */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-green-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;