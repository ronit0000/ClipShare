import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UploadPage from "./UploadPage";
import ReceivePage from "./ReceivePage";
import FileShareBackground from "./components/ui/file-share-background";

const AboutPage = () => (
  <div className="text-center text-white p-8 max-w-3xl mx-auto bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 font-iceland">
    <h2 className="text-h2 font-bold mb-4 font-iceland">About Developer</h2>
    <p className="font-iceland">
      This app is developed by Ronit Kumar Sahu , passionate about building intuitive, secure file sharing solutions.
    </p>
  </div>
);

const ContactPage = () => (
  <div className="text-center text-white p-8 max-w-3xl mx-auto bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 font-iceland">
    <h2 className="text-h2 font-bold mb-4 font-iceland">Contact Us</h2>
    <p className="font-iceland">
      For support or inquiries, please email: <a href="mailto:ronitkusahu@gmail.com" className="text-blue-400 underline">ronitkusahu@gmail.com</a>
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
    <FileShareBackground>
      <div className="min-h-screen flex flex-col">
        <Navbar onNavigate={setPage} />
        <main className="relative pt-6 px-4 flex-grow">{renderPage()}</main>
        <Footer onNavigate={setPage} />
      </div>
    </FileShareBackground>
  );
}
export default App;
