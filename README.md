# Bhodi Learning Platform

An interactive Python learning platform that teaches programming fundamentals and Object-Oriented Programming through building a text adventure game. Features real-time code execution, inheritance visualization, and immediate feedback.

## 🎯 Project Overview

This platform guides students from basic Python concepts to advanced OOP principles through a gamified learning experience. Students build a text adventure game while learning:

- **Module 1:** Programming fundamentals (variables, conditionals, loops, data structures)
- **Module 2:** Object-Oriented Programming (classes, inheritance, methods)

### Key Features

- **Real-time Code Execution:** Instant feedback on code changes
- **Inheritance Visualizer:** Visual diagrams showing class relationships
- **Progressive Learning:** Scaffolded lessons with decreasing support
- **Secure Sandbox:** Safe code execution environment
- **Clean UI:** Minimalist 3-panel design focused on learning

## 🏗️ Architecture

```
bhodi-learning-platform/
├── project_docs/          # Design specifications and plans
├── src/
│   ├── frontend/          # HTML, CSS, JavaScript client
│   └── backend/           # Python server and code execution
├── lessons/               # Lesson content and solutions
└── requirements.txt       # Python dependencies
```

## 🚀 Development Phases

### Phase 1: MVP ⚡

- Basic Flask server with `exec()` code execution
- Simple HTML interface with textarea and output
- Hardcoded first lesson

### Phase 2: Content Engine 📚

- Dynamic lesson loading from files
- "Check Answer" functionality
- 3-panel UI with CodeMirror editor

### Phase 3: Visualizer 🎨

- AST parsing for class detection
- Inheritance diagram generation
- Mermaid.js visualization

### Phase 4: Security & Polish 🔒

- Docker/RestrictedPython sandboxing
- Mobile responsiveness
- Accessibility features

## 🛠️ Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+ (for frontend dependencies)

### Installation

1. **Clone and navigate:**

   ```bash
   cd bhodi-learning-platform
   ```
2. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```
3. **Install frontend dependencies:**

   ```bash
   npm install
   ```
4. **Run development server:**

   ```bash
   npm run dev
   ```

## 🧪 Development

### Code Quality

```bash
# Format Python code
npm run format

# Lint Python code  
npm run lint

# Run tests
npm run test
```

### Project Structure

- **`src/frontend/`** - Client-side code (HTML, CSS, JS)
- **`src/backend/`** - Server API and code execution
- **`lessons/`** - Lesson content in markdown and Python
- **`project_docs/`** - Design specifications and development plans

## 📋 Educational Principles

- **Scaffolding:** Gradual reduction of support as skills develop
- **Immediate Feedback:** Real-time code execution and error reporting
- **Cognitive Load Management:** Clean, focused interface
- **Dual Coding:** Text + visual representation of concepts
- **Constructivism:** Learning by building a complete project

## 🔐 Security

The platform implements multiple security layers:

- Input validation and sanitization
- Execution timeouts to prevent infinite loops
- Sandboxed code execution (Phase 4)
- Resource limits on CPU and memory usage

## 🤝 Contributing

1. Follow the 4-phase development plan
2. Maintain educational focus in all features
3. Ensure accessibility compliance
4. Test on multiple devices and browsers
5. Update documentation with changes

## 📖 Documentation

- **[Platform Design](project_docs/PLATFORM_DESIGN.md)** - UI/UX specifications and educational principles
- **[Development Plan](project_docs/DEVELOPMENT_PLAN.md)** - 4-phase implementation roadmap
- **[Lesson Plan](project_docs/LESSON_PLAN.md)** - Curriculum structure and learning objectives

---

*Built with ❤️ for effective Python education*
