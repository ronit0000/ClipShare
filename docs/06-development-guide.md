# Development Guide

## Development Environment Setup

### Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm/yarn package manager
- [ ] Git version control
- [ ] VS Code (recommended) or preferred IDE
- [ ] Supabase account and project
- [ ] Modern web browser with dev tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Environment Configuration

Create `.env.local` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Development Settings
VITE_DEV_MODE=true
VITE_DEBUG_LEVEL=debug

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=false

# Limits
VITE_MAX_FILE_SIZE=52428800
VITE_MAX_FILES=10
VITE_EXPIRY_HOURS=24
```

## Project Structure Guidelines

### Recommended Folder Organization

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI elements
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   └── features/        # Feature-specific components
├── hooks/               # Custom React hooks
├── services/            # API and external services
├── utils/               # Helper functions
├── constants/           # Application constants
├── types/               # TypeScript definitions
├── styles/              # Global styles
├── assets/              # Static assets
└── __tests__/           # Test files
```

### File Naming Conventions

| File Type | Convention | Example |
|-----------|------------|---------|
| Components | PascalCase | `FileUploader.jsx` |
| Hooks | camelCase with 'use' prefix | `useFileUpload.js` |
| Services | camelCase with 'Service' suffix | `storageService.js` |
| Utils | camelCase | `formatFileSize.js` |
| Constants | UPPER_SNAKE_CASE | `API_ENDPOINTS.js` |
| Types | PascalCase with 'Type' suffix | `FileType.ts` |

## Component Development

### Component Template

```jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ComponentName.css'; // If needed

/**
 * Brief component description
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @param {Function} props.onAction - Action handler
 * @param {boolean} props.disabled - Disabled state
 */
const ComponentName = ({ 
  title, 
  onAction, 
  disabled = false,
  children 
}) => {
  // State declarations
  const [localState, setLocalState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect hooks
  useEffect(() => {
    // Initialization logic
    return () => {
      // Cleanup logic
    };
  }, []);

  // Memoized callbacks
  const handleAction = useCallback(async () => {
    if (disabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await onAction?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [disabled, onAction]);

  // Early returns for error states
  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Main render
  return (
    <div className="component-container">
      <h2 className="component-title">{title}</h2>
      
      <button 
        onClick={handleAction}
        disabled={disabled || loading}
        className="action-button"
      >
        {loading ? 'Loading...' : 'Action'}
      </button>
      
      {children}
    </div>
  );
};

ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node
};

ComponentName.defaultProps = {
  disabled: false
};

export default ComponentName;
```

### Custom Hooks Pattern

```jsx
// hooks/useFileUpload.js
import { useState, useCallback } from 'react';
import { StorageService } from '../services/storageService';
import { generateCode } from '../utils/codeGenerator';

/**
 * Custom hook for file upload functionality
 * @param {Object} options - Hook options
 * @returns {Object} Hook state and methods
 */
export const useFileUpload = (options = {}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadCode, setUploadCode] = useState(null);
  const [error, setError] = useState(null);

  const uploadFiles = useCallback(async (fileList) => {
    setUploading(true);
    setError(null);
    setProgress(0);
    
    const code = generateCode();
    
    try {
      const results = await StorageService.uploadMultiple(
        fileList, 
        code, 
        setProgress
      );
      
      setUploadCode(code);
      return results;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const resetUpload = useCallback(() => {
    setFiles([]);
    setUploading(false);
    setProgress(0);
    setUploadCode(null);
    setError(null);
  }, []);

  return {
    files,
    setFiles,
    uploading,
    progress,
    uploadCode,
    error,
    uploadFiles,
    resetUpload
  };
};
```

## Service Layer Development

### Service Class Template

```javascript
// services/BaseService.js
export class BaseService {
  static baseURL = process.env.VITE_API_URL || '';
  static timeout = 30000; // 30 seconds

  /**
   * Make HTTP request with error handling
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  static async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  /**
   * Handle service errors consistently
   * @param {Error} error - Error object
   * @returns {Object} Formatted error
   */
  static handleError(error) {
    console.error(`${this.name} Error:`, error);
    
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString()
      }
    };
  }
}
```

### Specific Service Implementation

```javascript
// services/uploadService.js
import { BaseService } from './BaseService';
import { supabase } from '../supabaseClient';

export class UploadService extends BaseService {
  
  /**
   * Save upload metadata
   * @param {string} code - Upload code
   * @param {Array} files - File metadata
   * @returns {Promise<Object>} Result
   */
  static async saveUpload(code, files) {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .insert([{ code, files }]);

      if (error) throw error;

      return {
        success: true,
        data: { code, files }
      };

    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get upload by code
   * @param {string} code - Upload code
   * @returns {Promise<Object>} Upload data
   */
  static async getUpload(code) {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .eq('code', code)
        .single();

      if (error) throw error;

      // Check expiration
      if (new Date(data.expires_at) < new Date()) {
        throw new Error('Upload has expired');
      }

      return {
        success: true,
        data
      };

    } catch (error) {
      return this.handleError(error);
    }
  }
}
```

## State Management

### React Context Pattern

```jsx
// contexts/AppContext.js
import React, { createContext, useContext, useReducer } from 'react';

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_UPLOADS: 'SET_UPLOADS',
  ADD_UPLOAD: 'ADD_UPLOAD',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  loading: false,
  error: null,
  uploads: [],
  currentUpload: null
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
      
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
      
    case ACTIONS.SET_UPLOADS:
      return { ...state, uploads: action.payload };
      
    case ACTIONS.ADD_UPLOAD:
      return { 
        ...state, 
        uploads: [...state.uploads, action.payload],
        currentUpload: action.payload
      };
      
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
      
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    setUploads: (uploads) => dispatch({ type: ACTIONS.SET_UPLOADS, payload: uploads }),
    addUpload: (upload) => dispatch({ type: ACTIONS.ADD_UPLOAD, payload: upload }),
    clearError: () => dispatch({ type: ACTIONS.CLEAR_ERROR })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

## Testing Strategy

### Unit Testing Setup

```javascript
// __tests__/setup.js
import '@testing-library/jest-dom';

// Mock Supabase client
jest.mock('../src/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      insert: jest.fn()
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn()
      }))
    }
  }
}));

// Global test utilities
global.mockFile = (name, size = 1024, type = 'text/plain') => {
  return new File(['content'], name, { type, size });
};
```

### Component Testing

```javascript
// __tests__/components/FileUploader.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUploader from '../../src/components/FileUploader';

describe('FileUploader Component', () => {
  const mockOnUpload = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders upload interface', () => {
    render(<FileUploader onUpload={mockOnUpload} />);
    
    expect(screen.getByText(/drag files here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /browse files/i })).toBeInTheDocument();
  });

  test('handles file selection', async () => {
    const user = userEvent.setup();
    render(<FileUploader onUpload={mockOnUpload} />);
    
    const fileInput = screen.getByLabelText(/file input/i);
    const file = mockFile('test.txt', 1024, 'text/plain');
    
    await user.upload(fileInput, file);
    
    expect(screen.getByText('test.txt')).toBeInTheDocument();
  });

  test('validates file size', async () => {
    const user = userEvent.setup();
    render(<FileUploader maxSize={1000} onUpload={mockOnUpload} />);
    
    const fileInput = screen.getByLabelText(/file input/i);
    const largeFile = mockFile('large.txt', 2000, 'text/plain');
    
    await user.upload(fileInput, largeFile);
    
    expect(screen.getByText(/file size exceeds limit/i)).toBeInTheDocument();
  });

  test('calls onUpload with files', async () => {
    const user = userEvent.setup();
    render(<FileUploader onUpload={mockOnUpload} />);
    
    const fileInput = screen.getByLabelText(/file input/i);
    const file = mockFile('test.txt');
    
    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: /upload/i }));
    
    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith([file]);
    });
  });
});
```

### Service Testing

```javascript
// __tests__/services/uploadService.test.js
import { UploadService } from '../../src/services/uploadService';
import { supabase } from '../../src/supabaseClient';

jest.mock('../../src/supabaseClient');

describe('UploadService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveUpload', () => {
    test('saves upload successfully', async () => {
      const mockData = { code: 'TEST123', files: [] };
      supabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          data: mockData,
          error: null
        })
      });

      const result = await UploadService.saveUpload('TEST123', []);

      expect(result.success).toBe(true);
      expect(result.data.code).toBe('TEST123');
    });

    test('handles database errors', async () => {
      supabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Database error')
        })
      });

      const result = await UploadService.saveUpload('TEST123', []);

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Database error');
    });
  });
});
```

## Performance Optimization

### Code Splitting

```jsx
// Lazy loading components
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

const UploadPage = lazy(() => import('./pages/UploadPage'));
const ReceivePage = lazy(() => import('./pages/ReceivePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Router>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/receive" element={<ReceivePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </Suspense>
  );
};
```

### Memory Management

```jsx
// Proper cleanup in useEffect
useEffect(() => {
  const controller = new AbortController();
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data', {
        signal: controller.signal
      });
      // Handle response
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    }
  };

  fetchData();

  return () => {
    controller.abort(); // Cleanup
  };
}, []);
```

### Image Optimization

```javascript
// utils/imageOptimizer.js
export const optimizeImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};
```

## Debugging and Troubleshooting

### Debug Utilities

```javascript
// utils/debug.js
export const debug = {
  log: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEBUG]', ...args);
    }
  },
  
  error: (error, context) => {
    console.error('[ERROR]', { error, context, stack: error.stack });
  },
  
  performance: (label, fn) => {
    if (process.env.NODE_ENV === 'development') {
      console.time(label);
      const result = fn();
      console.timeEnd(label);
      return result;
    }
    return fn();
  }
};
```

### Error Boundary

```jsx
// components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Build and Deployment

### Build Optimization

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          utils: ['nanoid', '@heroicons/react']
        }
      }
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
```

This comprehensive development guide provides the foundation for building, testing, and maintaining ClipShare with best practices and scalable patterns.