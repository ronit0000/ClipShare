# Contributing Guidelines

## Welcome Contributors! 🎉

Thank you for your interest in contributing to ClipShare! This document provides comprehensive guidelines for contributing to the project, whether you're fixing bugs, adding features, or improving documentation.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Issue Guidelines](#issue-guidelines)
8. [Testing Requirements](#testing-requirements)
9. [Documentation Guidelines](#documentation-guidelines)
10. [Community Guidelines](#community-guidelines)

## Code of Conduct

### Our Pledge

We are committed to making participation in ClipShare a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Git configured with your name and email
- [ ] A GitHub account
- [ ] Basic knowledge of React, JavaScript, and Git
- [ ] Familiarity with the project structure (see [Architecture Guide](./03-architecture.md))

### First-Time Setup

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/ClipShare.git
   cd ClipShare/clipshare
   ```

2. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/ronit0000/ClipShare.git
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Up Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

### Finding Issues to Work On

- **Good First Issues:** Look for issues labeled `good first issue`
- **Help Wanted:** Issues labeled `help wanted` need community support
- **Bug Reports:** Issues labeled `bug` are great for beginners
- **Feature Requests:** Issues labeled `enhancement` for new features

## Development Workflow

### Branch Naming Convention

```bash
# Feature branches
feature/add-password-protection
feature/improve-upload-ui
feature/qr-code-generation

# Bug fix branches
fix/upload-progress-bug
fix/mobile-responsive-issue

# Documentation branches
docs/api-reference-update
docs/contributing-guide

# Hotfix branches (for critical production issues)
hotfix/security-vulnerability
```

### Workflow Steps

1. **Create Issue** (if one doesn't exist)
2. **Create Branch** from main
3. **Make Changes** following coding standards
4. **Test Changes** thoroughly
5. **Commit Changes** with proper messages
6. **Push Branch** to your fork
7. **Create Pull Request**
8. **Address Feedback** if needed
9. **Merge** (after approval)

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Switch to main branch
git checkout main

# Merge upstream changes
git merge upstream/main

# Push to your fork
git push origin main
```

## Coding Standards

### JavaScript/React Standards

#### File Organization
```javascript
// Order of imports
import React, { useState, useEffect } from 'react'; // React imports first
import PropTypes from 'prop-types'; // Third-party libraries
import { supabase } from '../supabaseClient'; // Internal services
import { formatFileSize } from '../utils/formatters'; // Utilities
import Button from './Button'; // Components
import './ComponentName.css'; // Styles (if needed)
```

#### Component Structure
```javascript
/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @param {Function} props.onAction - Action handler
 */
const ComponentName = ({ title, onAction }) => {
  // 1. Hooks (state, effects, context)
  const [state, setState] = useState(null);
  
  // 2. Event handlers
  const handleClick = useCallback(() => {
    // Handler logic
  }, []);
  
  // 3. Render helpers (if complex)
  const renderContent = () => {
    // Rendering logic
  };
  
  // 4. Early returns
  if (!title) return null;
  
  // 5. Main render
  return (
    <div className="component-name">
      {/* Component JSX */}
    </div>
  );
};

// PropTypes after component
ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func
};

export default ComponentName;
```

#### Naming Conventions
- **Variables & Functions:** `camelCase`
- **Components:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Files:** `kebab-case.js` or `PascalCase.jsx` for components

#### Code Formatting
- Use **2 spaces** for indentation
- **Semicolons** required
- **Single quotes** for strings
- **Trailing commas** in objects and arrays
- **Max line length:** 100 characters

### CSS/Styling Standards

#### Tailwind CSS Usage
```jsx
// Preferred: Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-lg rounded-xl">

// Avoid: Custom CSS unless necessary
<div className="custom-card-style">
```

#### Custom CSS (when needed)
```css
/* Use CSS modules or styled-components for custom styles */
.component-name {
  /* Styles */
}

.component-name__element {
  /* BEM methodology for nested elements */
}

.component-name--modifier {
  /* BEM modifiers */
}
```

### Performance Guidelines

#### React Performance
```javascript
// Use React.memo for components that don't need frequent re-renders
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency]);

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

#### Bundle Optimization
```javascript
// Dynamic imports for code splitting
const LazyComponent = lazy(() => import('./LazyComponent'));

// Conditional imports
if (condition) {
  import('./ConditionalModule').then(module => {
    // Use module
  });
}
```

## Commit Guidelines

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add password protection for uploads` |
| `fix` | Bug fix | `fix: resolve upload progress display issue` |
| `docs` | Documentation | `docs: update API reference` |
| `style` | Code style changes | `style: format code with prettier` |
| `refactor` | Code refactoring | `refactor: optimize file upload service` |
| `perf` | Performance improvements | `perf: reduce bundle size by 20%` |
| `test` | Add/update tests | `test: add unit tests for file validation` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `ci` | CI/CD changes | `ci: add automated testing workflow` |

### Examples

```bash
# Good commit messages
feat: implement QR code generation for file sharing
fix(upload): resolve progress bar not updating on mobile
docs: add deployment guide for Vercel
test: add integration tests for file download flow

# Bad commit messages
Update stuff
Fixed bug
WIP
Changes
```

### Commit Best Practices

- **Keep commits atomic** - one logical change per commit
- **Write descriptive messages** - explain what and why, not how
- **Use imperative mood** - "add feature" not "added feature"
- **Reference issues** when applicable: `fixes #123`
- **Break up large changes** into smaller, logical commits

## Pull Request Process

### Before Creating a Pull Request

- [ ] Code follows project coding standards
- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] Changes are properly documented
- [ ] Commit messages follow guidelines
- [ ] Branch is up to date with main

### Pull Request Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (if UI changes)

## Screenshots (if applicable)
Include screenshots of UI changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged

## Related Issues
Fixes #(issue_number)
Closes #(issue_number)
```

### Review Process

1. **Automated Checks** - CI/CD pipeline runs tests
2. **Code Review** - Maintainers review changes
3. **Feedback** - Address review comments
4. **Approval** - At least one maintainer approval required
5. **Merge** - Squash and merge preferred

### Review Criteria

Reviewers will check for:
- **Functionality** - Does it work as expected?
- **Code Quality** - Is it readable and maintainable?
- **Performance** - Any performance impacts?
- **Security** - Are there security implications?
- **Testing** - Adequate test coverage?
- **Documentation** - Properly documented?

## Issue Guidelines

### Issue Types

#### Bug Reports
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

#### Feature Requests
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Issue Labels

| Label | Description | Color |
|-------|-------------|--------|
| `bug` | Something isn't working | `#d73a4a` |
| `enhancement` | New feature or request | `#a2eeef` |
| `good first issue` | Good for newcomers | `#7057ff` |
| `help wanted` | Extra attention is needed | `#008672` |
| `question` | Further information is requested | `#d876e3` |
| `documentation` | Improvements or additions to documentation | `#0075ca` |
| `duplicate` | This issue or pull request already exists | `#cfd3d7` |
| `invalid` | This doesn't seem right | `#e4e669` |
| `wontfix` | This will not be worked on | `#ffffff` |

## Testing Requirements

### Test Categories

#### Unit Tests
```javascript
// Example unit test
import { render, screen } from '@testing-library/react';
import FileUploader from '../FileUploader';

describe('FileUploader', () => {
  test('renders upload zone', () => {
    render(<FileUploader />);
    expect(screen.getByText(/drag files here/i)).toBeInTheDocument();
  });
});
```

#### Integration Tests
```javascript
// Example integration test
describe('Upload Flow', () => {
  test('complete upload process', async () => {
    // Test full upload workflow
  });
});
```

#### E2E Tests (Planned)
```javascript
// Future: Cypress/Playwright tests
describe('ClipShare E2E', () => {
  it('should upload and download file', () => {
    // End-to-end test
  });
});
```

### Test Coverage Requirements

- **Minimum coverage:** 80%
- **Critical paths:** 95% coverage
- **New features:** Must include tests
- **Bug fixes:** Should include regression tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test FileUploader.test.jsx
```

## Documentation Guidelines

### Documentation Types

1. **Code Comments** - Inline documentation
2. **API Documentation** - Function/method documentation
3. **User Documentation** - How-to guides
4. **Technical Documentation** - Architecture and design
5. **README Files** - Project overview and setup

### Writing Standards

- **Clear and concise** language
- **Examples** for complex concepts
- **Up-to-date** with current implementation
- **Proper formatting** using Markdown
- **Accessible** to target audience

### Documentation Structure

```markdown
# Title (H1)

## Overview (H2)
Brief description of what this documents.

## Prerequisites (H2)
What users need before following this guide.

## Step-by-step Instructions (H2)

### Step 1: Do something (H3)
Detailed instructions with code examples.

```bash
# Code example with syntax highlighting
npm install
```

### Step 2: Do something else (H3)
More instructions.

## Troubleshooting (H2)
Common issues and solutions.

## Additional Resources (H2)
Links to related documentation.
```

## Community Guidelines

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Email** - Direct contact: ronitkusahu@gmail.com

### Response Time Expectations

- **Issues:** Response within 48 hours
- **Pull Requests:** Initial review within 72 hours
- **Security Issues:** Response within 24 hours

### Getting Help

1. **Check existing documentation**
2. **Search existing issues**
3. **Ask in GitHub Discussions**
4. **Create detailed issue** if problem persists

### Recognition

Contributors will be recognized through:
- **Contributors list** in README
- **Release notes** mention
- **Special recognition** for significant contributions

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes (backward compatible)

### Release Schedule

- **Patch releases:** As needed for bug fixes
- **Minor releases:** Monthly feature releases
- **Major releases:** Quarterly with breaking changes

Thank you for contributing to ClipShare! Your efforts help make file sharing better for everyone. 🚀