import React from "react";
import { HyperText } from "./ui/hyper-text.jsx";
import NavDock from "./ui/nav-dock.jsx";

const Navbar = ({ onNavigate }) => {
  const navItems = [
    { id: 'upload', label: 'Upload', onClick: () => onNavigate('upload') },
    { id: 'receive', label: 'Receive', onClick: () => onNavigate('receive') },
    { id: 'about', label: 'About Developer', onClick: () => onNavigate('about') },
    { id: 'contact', label: 'Contact Us', onClick: () => onNavigate('contact') },
  ];
  return (
    <nav className="bg-gray-900/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-3 sm:px-6 py-2 sm:py-3">
        <div
          className="cursor-pointer logo-size flex-shrink-0"
          onClick={() => onNavigate('upload')}
        >
          <HyperText
            text="ClipShare"
            className="font-bold text-white font-iceland"
            duration={600}
            animateOnLoad={false}
          />
        </div>
        <div className="hidden sm:block">
          <NavDock items={navItems} />
        </div>
        {/* Mobile Menu */}
        <div className="sm:hidden">
          <div className="flex space-x-3 text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-iceland px-2 py-1"
              >
                {item.label.split(' ')[0]} {/* Show only first word on mobile */}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
