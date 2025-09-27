# Getting Started

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **Git** for version control
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ronit0000/ClipShare.git
cd ClipShare/clipshare
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://ybueanmewrciysqlkdnb.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Custom Configuration
VITE_MAX_FILE_SIZE=52428800  # 50MB in bytes
VITE_MAX_FILES_PER_UPLOAD=10
VITE_FILE_EXPIRY_HOURS=24
```

> **Note:** The current implementation has hardcoded Supabase credentials. For production use, please use environment variables.

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm run deploy` | Deploy to GitHub Pages |

## Development Workflow

### 1. Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
git add .
git commit -m "feat: add your feature description"

# Push to GitHub
git push origin feature/your-feature-name
```

### 2. Code Style Guidelines

- Use **camelCase** for variable and function names
- Use **PascalCase** for component names
- Use **kebab-case** for file names (except components)
- Follow **ESLint** rules configured in the project
- Write **descriptive commit messages** following conventional commits

### 3. Component Structure

```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Component description
 * @param {Object} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState(null);

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };

  // Render
  return (
    <div className="component-container">
      {/* Component content */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

ComponentName.defaultProps = {
  prop2: 0
};

export default ComponentName;
```

## Supabase Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Database Schema

Execute the following SQL in your Supabase SQL editor:

```sql
-- Create uploads table
CREATE TABLE uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  files JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create index for faster lookups
CREATE INDEX idx_uploads_code ON uploads(code);
CREATE INDEX idx_uploads_expires_at ON uploads(expires_at);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('clipshare-files', 'clipshare-files', true);

-- Set up storage policy (allow public access)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'clipshare-files');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'clipshare-files');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'clipshare-files');
```

### 3. Storage Configuration

Configure your storage bucket:
1. Go to Storage in Supabase dashboard
2. Create bucket named `clipshare-files`
3. Set it to **public**
4. Configure file size limits (default: 50MB)

## Deployment Options

### Option 1: GitHub Pages (Current)

The project is configured to automatically deploy to GitHub Pages via GitHub Actions:

1. Push to `main` branch
2. GitHub Actions builds and deploys automatically
3. Access at `https://yourusername.github.io/ClipShare`

### Option 2: Vercel

1. Import project from GitHub
2. Set environment variables
3. Deploy with one click

### Option 3: Netlify

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

## Local Development Tips

### Hot Reload

The Vite development server provides instant hot reload. Changes to components will reflect immediately without page refresh.

### Debugging

1. Use React Developer Tools browser extension
2. Check browser console for errors
3. Use Supabase dashboard for database debugging
4. Network tab for API request debugging

### Performance Monitoring

```javascript
// Add to your component for performance monitoring
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log('Component:', id, 'Phase:', phase, 'Duration:', actualDuration);
};

<Profiler id="ComponentName" onRender={onRenderCallback}>
  <YourComponent />
</Profiler>
```

## Troubleshooting

### Common Issues

1. **Port 5173 already in use**
   ```bash
   # Kill process using port
   lsof -ti:5173 | xargs kill -9
   # Or use different port
   npm run dev -- --port 3000
   ```

2. **Supabase connection errors**
   - Verify your Supabase URL and key
   - Check network connectivity
   - Ensure database schema is set up correctly

3. **Build errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Styling issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS classes
   - Verify PostCSS configuration

### Getting Help

- Check [GitHub Issues](https://github.com/ronit0000/ClipShare/issues)
- Review [Architecture Documentation](./03-architecture.md)
- Contact: ronitkusahu@gmail.com

## Next Steps

Once you have the project running:

1. Explore the [Current Features](./04-current-features.md)
2. Review the [Architecture Guide](./03-architecture.md)
3. Check out the [Development Guide](./06-development-guide.md)
4. See the [Feature Roadmap](./08-roadmap.md) for upcoming enhancements