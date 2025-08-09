import React from "react";

const Navbar = ({ onNavigate }) => {
  return (
    <nav className="bg-gray-900 bg-opacity-80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        <h1
          className="text-2xl font-bold text-white cursor-pointer"
          onClick={() => onNavigate('upload')}
        >
          ClipShare
        </h1>
        <ul className="flex space-x-6 text-gray-300">
          <li className="cursor-pointer hover:text-white" onClick={() => onNavigate('upload')}>Upload</li>
          <li className="cursor-pointer hover:text-white" onClick={() => onNavigate('receive')}>Receive</li>
          <li className="cursor-pointer hover:text-white" onClick={() => onNavigate('about')}>About Developer</li>
          <li className="cursor-pointer hover:text-white" onClick={() => onNavigate('contact')}>Contact Us</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
