import React, { useState } from 'react';

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What services do we offer?",
      answer: "We offer a comprehensive wellness platform that empowers users to track their moods, set goals, journal their thoughts, and connect with a supportive community. Our app is designed to help you improve your mental health and overall well-being through daily practices and personalized insights."
    },
    {
      question: "How can I contact support?",
      answer: "You can reach out to our support team via email at support@thrivewell.com or call us at 123-456-7890. Our support team is available Monday through Friday, 9 AM to 6 PM EST. For urgent matters during off-hours, you can use the in-app chat feature for assistance."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a 14-day free trial with full access to all premium features. This gives you a chance to explore our services and see if they fit your needs. No credit card is required to start your free trial - just sign up and begin your wellness journey!"
    },
    {
      question: "Is my data private and secure?",
      answer: "Absolutely. We take privacy and security very seriously. All your personal data is encrypted and securely stored. We never share your information with third parties without your explicit consent. You can review our full privacy policy for more details on how we protect your information."
    },
    {
      question: "Can I use ThriveWell on multiple devices?",
      answer: "Yes, ThriveWell is available on iOS, Android, and as a web application. Your account synchronizes across all your devices, so you can seamlessly switch between your phone, tablet, and computer while maintaining all your data and preferences."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="mt-3 max-w-2xl mx-auto">
            <p className="text-lg text-gray-600">
              Find answers to common questions about ThriveWell and how we can help you on your wellness journey.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-6 overflow-hidden border-b border-gray-200 last:border-0"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="flex justify-between items-center w-full py-5 px-2 text-left focus:outline-none"
                aria-expanded={activeIndex === index}
              >
                <span className="text-xl font-semibold text-gray-800">{faq.question}</span>
                <div className={`ml-6 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pb-5 px-2">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Still have questions? We're here to help.</p>
          <a 
            href="#contact" 
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-md hover:from-green-600 hover:to-blue-600 transition-colors"
          >
            Contact Us
            <svg className="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;