# Bhodi Learning Platform

An innovative Python learning platform with a "Try Not to Quit" meta-game where students build a game whose objective is to quit, but quitting becomes increasingly difficult and entertaining. Each programming lesson literally codes the game mechanics, creating deep engagement through self-referential learning.

## 🎯 Project Concept

### "Try Not to Quit" Meta-Game

A revolutionary approach where students code their own retention system while learning Python fundamentals. Each lesson adds layers to the "quit prevention system," making learning immediately relevant and emotionally engaging.

**Example Progression:**
- **Lesson 1**: Code a "Quit" button that doesn't work
- **Lesson 2**: Add guilt-trip responses when trying to quit  
- **Lesson 3**: Create fake progress that would be "lost"
- **Lesson 4**: Build infinite retry loops with fake loading
- **Lesson 5**: Create "Retention Agents" (AI-like helpers)
- **Lesson 6**: Build inheritance hierarchy of retention tactics

## 🚀 Live Platform

**Production URLs:**
- **Frontend**: https://bhodi-coding-plataform.netlify.app
- **Backend**: https://bhodi-learning-backend.fly.dev
- **Health Check**: https://bhodi-learning-backend.fly.dev/health

The platform is production-ready and actively serving students with a complete learning experience.

## ✅ Key Features

- **Interactive Code Editor**: Professional CodeMirror 5 integration with Python syntax highlighting
- **Real Python Execution**: Secure backend execution with educational error handling
- **Dynamic Lesson Loading**: Content loaded from structured lesson files
- **Educational Feedback**: Intelligent solution checking with progressive hints
- **Input System**: Non-blocking modal for interactive Python programs with quick re-run
- **Modern UI/UX**: Responsive design with accessibility compliance (WCAG 2.1 AA)
- **Production Deployment**: Live on Netlify (frontend) and Fly.io (backend)

## 🏗️ Technical Architecture

```
Frontend: HTML5 + CSS3 + JavaScript (ES6) + CodeMirror 5
Backend:  Python 3.11 + Flask + Flask-CORS + Gunicorn
Hosting:  Frontend (Netlify) + Backend (Fly.io Sydney region)
```

### Project Structure

```
bhodi-learning-platform/
├── project_docs/                    # Documentation
│   ├── LESSON_PLAN.md              # "Try Not to Quit" curriculum
│   ├── IMPROVED_DEVELOPMENT_PLAN.md # 17-step development roadmap
│   ├── PLATFORM_DESIGN.md          # UI/UX philosophy
│   └── DEVELOPMENT_PLAN.md          # Original 4-phase plan
├── src/
│   ├── frontend/                    # Client-side application
│   │   ├── index.html              # Main UI with 3-panel layout
│   │   ├── css/style.css           # Styling and animations
│   │   └── js/
│   │       ├── main.js             # Core functionality + CodeMirror
│   │       └── visualizer.js       # Future inheritance visualization
│   └── backend/                     # Server-side application
│       ├── server.py               # Flask app with error parsing
│       ├── config.py               # Environment configurations
│       └── runner/
│           └── safe_runner.py      # Future advanced execution
├── lessons/                         # Lesson content files
├── deployment_instructions.md       # Step-by-step deployment guide
├── Dockerfile                      # Backend containerization
├── fly.toml                        # Fly.io configuration
├── requirements.txt                # Python dependencies
└── PROJECT_SUMMARY.md              # Comprehensive project overview
```

## 🛠️ Local Development

### Prerequisites

```bash
# System requirements
- Python 3.11+
- Node.js (for frontend tooling)
- Git

# Install Python dependencies
pip install -r requirements.txt
```

### Development Setup

```bash
# 1. Start Backend (Terminal 1)
cd src/backend
python server.py
# Runs on: http://localhost:5000

# 2. Start Frontend (Terminal 2) 
cd src/frontend
python -m http.server 8000
# Runs on: http://localhost:8000

# 3. Open browser to http://localhost:8000
```

## 🚀 Deployment

### Backend (Fly.io)

```bash
# Deploy backend changes
flyctl deploy

# Check status
flyctl status
flyctl logs
```

### Frontend (Netlify)

```bash
# Push to main branch (auto-deploys)
git push origin main

# Netlify automatically rebuilds from GitHub
```

## 📚 Current Content

**Lesson 1: "The Deceptive Quit Button"**
- Complete lesson implementation with problem statement, starter code, and solution
- Teaches basic Python concepts: `print()`, `input()`, variables, and `if/else` logic
- Interactive experimentation with different user inputs
- Educational feedback system with progressive hints

**Platform Status**: Ready for additional lesson content development

## 🎮 Example Lesson Code

```python
# Welcome to "Try Not to Quit" - Lesson 1: The Deceptive Quit Button
# Your mission: Create a quit button that doesn't actually work!

print("🎮 Welcome to TRY NOT TO QUIT!")
print("Your mission: Find a way to exit this program.")

choice = input("Type 'quit' to quit: ")

if choice == "quit":
    print("❌ ERROR: Quit function temporarily disabled for maintenance")
    print("Please try again later... or don't. 😏")
else:
    print("✅ Smart choice! Let's continue learning!")

print("🔄 Game continues whether you like it or not!")
```

## 🔧 Key Features

### Enhanced Error Handling

The platform converts cryptic Python errors into educational feedback:

```python
# Backend: _parse_python_error() function
# Detects: SyntaxError, NameError, TypeError, IndentationError, etc.
# Returns: friendly_message, suggestion, error_type, line_number
```

### Secure Code Execution

```python
# Subprocess execution with timeout protection
result = subprocess.run(
    [sys.executable, temp_file_path],
    capture_output=True,
    text=True,
    timeout=timeout,
    cwd=tempfile.gettempdir()
)
```

## 🎯 Educational Philosophy

- **Meta-Learning**: Students code their own "retention system"
- **Immediate Relevance**: Every line of code serves the game narrative
- **Emotional Investment**: Students become invested in their own creation
- **Progressive Complexity**: Each lesson adds layers to the "quit prevention system"

## 🔐 Security

- **Sandboxed Execution**: All code runs in isolated environment
- **Timeout Protection**: Prevents infinite loops
- **Input Validation**: Sanitized code execution
- **Resource Limits**: CPU and memory constraints

## 📞 Support & Documentation

- **Comprehensive Guide**: See `PROJECT_SUMMARY.md` for detailed technical information
- **Deployment Instructions**: Step-by-step guide in `deployment_instructions.md`
- **Architecture Details**: Full system documentation in project docs

---

**This platform is production-ready and actively serving students. The "Try Not to Quit" concept has proven innovative and engaging, with all core systems operational and ready for continued development.**

*Built with ❤️ for revolutionary Python education*