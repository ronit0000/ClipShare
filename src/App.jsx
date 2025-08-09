import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ParticlesBackground from "./components/ParticlesBackground";
import UploadPage from "./UploadPage";
import ReceivePage from "./ReceivePage"; // <- Add this

const AboutPage = () => (
  <div className="text-center text-white p-8 max-w-3xl mx-auto">
    <h2 className="text-3xl font-bold mb-4">About Developer</h2>
    <p>
      This app is developed by [Your Name], passionate about building intuitive, secure file sharing solutions.
    </p>
  </div>
);

const ContactPage = () => (
  <div className="text-center text-white p-8 max-w-3xl mx-auto">
    <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
    <p>
      For support or inquiries, please email:
      <a href="mailto:support@clipshare.com" className="text-blue-400 underline">support@clipshare.com</a>
    </p>
  </div>
);

function App() {
  const [page, setPage] = useState("upload");

  const renderPage = () => {
    switch (page) {
      case "upload": return <UploadPage />;
      case "receive": return <ReceivePage />;
      case "about": return <AboutPage />;
      case "contact": return <ContactPage />;
      default: return <UploadPage />;
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <ParticlesBackground />
      <Navbar onNavigate={setPage} />
      <main className="relative pt-6 px-4 z-10">{renderPage()}</main>
    </div>
  );
}
export default App;
