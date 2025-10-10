import React, { useState } from "react";
import { HyperText } from "./ui/hyper-text.jsx";

const Footer = ({ onNavigate }) => {
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleFeedbackChange = (e) => {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value
    });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      // Simulate API call - replace with actual feedback submission logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus("Thank you for your feedback! We'll get back to you soon.");
      setFeedback({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitStatus("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLinks = [
    { name: "Upload Files", action: () => onNavigate('upload') },
    { name: "Receive Files", action: () => onNavigate('receive') },
    { name: "About Developer", action: () => onNavigate('about') },
    { name: "Contact Us", action: () => onNavigate('contact') }
  ];

  const socialLinks = [
    { 
      name: "GitHub", 
      url: "https://github.com/ronit0000", 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    { 
      name: "LinkedIn", 
      url: "https://www.linkedin.com/in/ronit-kumar-sahu-0032582a2", 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    { 
      name: "Twitter", 
      url: "https://x.com/ronitkusahu", 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    { 
      name: "Email", 
      url: "mailto:ronitkusahu@gmail.com", 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-gray-900/20 backdrop-blur-md border-t border-white/10 text-white py-12 px-6 mt-16 shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
          {/* Brand Section */}
          <div className="space-y-6 max-w-xs">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <div className="text-2xl">
                <HyperText
                  text="ClipShare"
                  className="font-bold text-white font-iceland"
                  duration={600}
                  animateOnLoad={false}
                />
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Secure, fast, and reliable file sharing made simple. Share files effortlessly with password protection and automatic cleanup.
            </p>
            <div className="text-sm text-gray-400">
              <p>Version 1.0.5</p>
              <p>© 2024 ClipShare. All rights reserved.</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 max-w-xs">
            <h4 className="text-h4 font-semibold text-white font-iceland">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-iceland"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <h5 className="text-sm font-semibold text-gray-200 mb-3 font-iceland">Features</h5>
              <ul className="space-y-2 text-xs text-gray-400 font-iceland">
                <li>• Password Protection</li>
                <li>• Automatic File Cleanup</li>
                <li>• Secure File Transfer</li>
                <li>• No Registration Required</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 max-w-xs">
            <h4 className="text-h4 font-semibold text-white font-iceland">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>
                </svg>
                <a href="mailto:ronitkusahu@gmail.com" className="text-gray-300 hover:text-white text-sm font-iceland">
                  ronitkusahu@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="text-gray-300 text-sm font-iceland">India</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-gray-200">Follow Us</h5>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="space-y-6 max-w-xs">
            <h4 className="text-h4 font-semibold text-white font-iceland">Send Feedback</h4>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={feedback.name}
                onChange={handleFeedbackChange}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-iceland"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={feedback.email}
                onChange={handleFeedbackChange}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-iceland"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={feedback.message}
                onChange={handleFeedbackChange}
                required
                rows="3"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none font-iceland"
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 text-sm font-iceland"
              >
                {isSubmitting ? "Sending..." : "Send Feedback"}
              </button>
              {submitStatus && (
                <p className={`text-xs ${submitStatus.includes("Thank you") ? "text-green-400" : "text-red-400"}`}>
                  {submitStatus}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>Built with ❤️ by Ronit Kumar Sahu</p>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;