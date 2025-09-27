# ClipShare 📎

<div align="center">
  <img src="public/vite.svg" alt="ClipShare Logo" width="80" height="80">
  
  **Seamless file sharing between devices with unique sharing codes**
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://ronit0000.github.io/ClipShare)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/ronit0000/ClipShare)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
  
</div>

## 🌟 Overview

ClipShare is an innovative web-based file sharing platform that eliminates the traditional barriers of cross-device file transfer. With a simple three-step process—upload, share code, download—users can securely transfer files between any devices without the need for email attachments, cloud storage logins, or physical media.

### ✨ Key Features

- 🚀 **No Account Required** - Start sharing immediately
- 🔒 **Secure & Private** - Temporary storage with auto-cleanup
- 📱 **Cross-Platform** - Works on any device with a browser
- ⚡ **Fast & Intuitive** - Drag & drop interface with real-time progress
- 🎨 **Modern Design** - Beautiful glassmorphism UI with particle effects
- 🌐 **Universal Support** - All file types, up to 50MB per file

## 🎯 Quick Start

### For Users

1. **Visit** [ClipShare](https://ronit0000.github.io/ClipShare)
2. **Upload** your files by dragging or clicking
3. **Share** the generated 8-character code
4. **Download** files using the code on any device

### For Developers

```bash
# Clone the repository
git clone https://github.com/ronit0000/ClipShare.git
cd ClipShare/clipshare

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Technology Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, Vite, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL + Storage) |
| **Styling** | Tailwind CSS, Heroicons |
| **Build Tools** | Vite, ESLint, PostCSS |
| **Deployment** | GitHub Pages, GitHub Actions |
| **Effects** | react-tsparticles |

</div>

## 📋 Features Breakdown

### Current Features (v1.0.0) ✅

- **Multi-file Upload**: Drag & drop or click to select multiple files
- **Real-time Progress**: Visual progress tracking with percentage
- **Image Previews**: Thumbnail generation for image files
- **Unique Codes**: 8-character sharing codes using nanoid
- **Auto-Expiry**: Files automatically deleted after 24 hours
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **File Type Support**: All formats supported (images, documents, videos, etc.)

### Upcoming Features 🚧

- 🔐 **Password Protection** - Optional password for uploads
- ⏰ **Custom Expiry** - Set expiration times (1h, 4h, 24h, 7d)
- 📊 **Download Limits** - Restrict number of downloads
- 📱 **QR Codes** - Generate QR codes for mobile sharing
- 👤 **User Accounts** - Persistent storage and history
- 🔄 **Real-time Updates** - Live transfer notifications

## 🏗️ Project Structure

```
clipshare/
├── 📁 src/
│   ├── 📄 App.jsx              # Main application component
│   ├── 📄 main.jsx             # Entry point
│   ├── 📄 UploadPage.jsx       # File upload interface
│   ├── 📄 ReceivePage.jsx      # File download interface
│   ├── 📄 supabaseClient.js    # Backend configuration
│   └── 📁 components/          # Reusable UI components
├── 📁 public/                  # Static assets
├── 📁 docs/                    # Comprehensive documentation
├── 📁 .github/workflows/       # CI/CD automation
└── 📄 package.json            # Dependencies and scripts
```

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) folder:

- [📖 Project Overview](./docs/01-project-overview.md)
- [🚀 Getting Started](./docs/02-getting-started.md)
- [🏗️ Architecture & Design](./docs/03-architecture.md)
- [⚡ Current Features](./docs/04-current-features.md)
- [🔌 API Reference](./docs/05-api-reference.md)
- [👨‍💻 Development Guide](./docs/06-development-guide.md)
- [🚢 Deployment Guide](./docs/07-deployment.md)
- [🗺️ Feature Roadmap](./docs/08-roadmap.md)
- [🤝 Contributing Guidelines](./docs/09-contributing.md)
- [📝 Changelog](./docs/10-changelog.md)

## 🚀 Performance

<div align="center">

| Metric | Value |
|--------|--------|
| **Bundle Size** | ~150KB (gzipped) |
| **Load Time** | < 2 seconds |
| **Lighthouse Score** | 90+ Performance |
| **Browser Support** | All modern browsers |
| **Max File Size** | 50MB per file |

</div>

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Quick Contribution Steps

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

See our [Contributing Guidelines](./docs/09-contributing.md) for detailed information.

## 🔒 Security & Privacy

- **Temporary Storage**: Files are automatically deleted after 24 hours
- **No User Tracking**: No personal information collected
- **HTTPS Encryption**: All data transmitted securely
- **Secure Codes**: Cryptographically secure random code generation
- **Privacy by Design**: No permanent data retention

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for excellent backend services
- **React Team** for the amazing framework
- **Tailwind CSS** for utility-first styling
- **Open Source Community** for inspiration and tools

## 📞 Support & Contact

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ronit0000/ClipShare/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/ronit0000/ClipShare/discussions)
- 📧 **Email**: ronitkusahu@gmail.com
- 🌟 **Feature Requests**: [GitHub Issues](https://github.com/ronit0000/ClipShare/issues/new)

## 🎉 Try It Now!

Ready to experience seamless file sharing? 

**[🚀 Launch ClipShare](https://ronit0000.github.io/ClipShare)**

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/ronit0000">Ronit Kumar Sahu</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>