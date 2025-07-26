# Lesson Creation Guide

**Purpose**: Step-by-step guide for creating new lessons in the Bhodi Learning Platform
**Audience**: Content creators, developers, educators
**Last Updated**: January 2025

---

## 📚 Overview

The Bhodi Learning Platform uses a file-based lesson system where each lesson is stored in its own directory with standardized files. The platform automatically loads lessons and provides navigation between them.

### Lesson Structure Philosophy

Each lesson follows the **"Try Not to Quit"** meta-game concept where students code their own retention system while learning Python fundamentals. Lessons should build progressively on each other.

---

## 🗂️ File Structure

Each lesson requires a specific directory structure:

```
lessons/
└── lesson_XX_descriptive_name/
    ├── problem_statement.md    # The lesson content and instructions
    ├── starter_code.py        # Template code with TODOs for students
    ├── solution.py           # Complete working solution
    └── solution_check.py     # Simplified solution for automated checking
```

### File Naming Convention

**Directory**: `lesson_XX_descriptive_name`
- `XX` = Two-digit lesson number (01, 02, 03, etc.)
- `descriptive_name` = Brief description using underscores
- Example: `lesson_02_guilt_trip_responses`

**Files**: All lessons must contain these exact filenames:
- `problem_statement.md` - Markdown file with lesson content
- `starter_code.py` - Python template with TODO comments
- `solution.py` - Complete working solution
- `solution_check.py` - Simplified version for automated checking

---

## 📝 Content Guidelines

### 1. Problem Statement (problem_statement.md)

**Structure**:
```markdown
# Lesson X: Descriptive Title

Brief engaging introduction that connects to the "Try Not to Quit" theme.

## Your Mission
Clear explanation of what students will build and learn.

## The Challenge
Step-by-step requirements for the program.

## Expected Behavior
Example output showing exactly what the program should do.

## 🎮 Experiment Ideas
Specific inputs students should try to test their code.

## Learning Goals
Clear list of programming concepts covered.

## Programming Concepts Introduced (if applicable)
Code examples of new concepts.
```

**Writing Guidelines**:
- Use engaging, playful tone that fits the "Try Not to Quit" theme
- Include specific input/output examples
- Provide clear learning objectives
- Add experiment suggestions to encourage exploration
- Use emojis and humor appropriately

### 2. Starter Code (starter_code.py)

**Structure**:
```python
# Welcome to "Try Not to Quit" - Lesson X: Title
# Your mission: Brief description of what they're building

# Initial code that works
print("🎮 Welcome message")

# TODO: Clear instruction for first task
# Hint: Specific guidance on how to complete it

# TODO: Next task
# Hint: More guidance

# Additional TODOs as needed
```

**Guidelines**:
- Start with working code that runs successfully
- Use clear TODO comments with hints
- Provide enough scaffolding without giving away the solution
- Include meaningful variable names and structure
- Add comments explaining complex concepts

### 3. Solution (solution.py)

**Complete working implementation**:
- Must run without errors
- Should handle edge cases appropriately
- Include comments explaining key concepts
- Demonstrate best practices for the lesson level
- Match the expected behavior described in problem statement

### 4. Solution Check (solution_check.py)

**Simplified version for automated checking**:
- Streamlined version of the full solution
- Focuses on core functionality
- Used by the backend for answer verification
- Should produce consistent, predictable output
- Avoid complex branching that makes automated checking difficult

---

## 🔧 Technical Implementation

### Backend Integration

The platform automatically discovers lessons using the `find_lesson_directory()` function in `src/backend/server.py`. No backend changes needed for new lessons.

**API Endpoints Created Automatically**:
- `GET /lesson/{lesson_id}` - Load lesson content
- `POST /lesson/{lesson_id}/check` - Check student answer

### Frontend Integration

The navigation system automatically supports new lessons:
- Previous/Next buttons work with any lesson number
- Missing lessons show "Coming Soon" messages gracefully
- Progress tracking scales to accommodate new lessons

---

## 🎯 "Try Not to Quit" Lesson Progression

### Planned Lesson Arc

1. **Lesson 1**: The Deceptive Quit Button ✅
   - Basic `input()`, `print()`, `if/else`
   - Simple quit button that doesn't work

2. **Lesson 2**: The Guilt-Trip Master ✅ 
   - Multiple conditions with `elif`
   - String methods (`.lower()`, `.strip()`)
   - Escalating emotional responses

3. **Lesson 3**: Fake Progress Indicators (Future)
   - Loops and counters
   - Progress bars and fake loading
   - Time delays

4. **Lesson 4**: Infinite Retry Loops (Future)
   - `while` loops
   - Loop control with `break` and `continue`
   - Persistent state

5. **Lesson 5**: Retention Agents (Future)
   - Functions and modular programming
   - AI-like response systems
   - Random responses

6. **Lesson 6**: Inheritance Hierarchy (Future)
   - Object-oriented programming
   - Class inheritance
   - Complex retention systems

### Thematic Guidelines

Each lesson should:
- Build on previous programming concepts
- Add new "retention tactics" to the meta-game
- Maintain the playful, slightly evil tone
- Include interactive elements that require user input
- Demonstrate real programming concepts through game mechanics

---

## ✅ Quality Checklist

Before publishing a lesson, verify:

### Content Quality
- [ ] Problem statement is clear and engaging
- [ ] Learning objectives are specific and achievable
- [ ] Expected behavior examples are accurate
- [ ] Experiment ideas encourage exploration
- [ ] Tone matches the "Try Not to Quit" theme

### Code Quality
- [ ] Starter code runs without errors
- [ ] TODOs provide clear guidance without giving away solutions
- [ ] Solution code demonstrates best practices
- [ ] Solution check version is simplified but functional
- [ ] All files use consistent formatting and style

### Technical Testing
- [ ] Backend can load the lesson: `curl http://localhost:5000/lesson/XX`
- [ ] Answer checking works: `POST /lesson/XX/check`
- [ ] Navigation buttons work correctly
- [ ] Progress tracking updates appropriately
- [ ] "Coming Soon" fallback works for future lessons

---

## 🧪 Testing New Lessons

### 1. Backend Testing
```bash
# Start backend server
cd src/backend && python server.py

# Test lesson loading
curl http://localhost:5000/lesson/02

# Test answer checking
curl -X POST http://localhost:5000/lesson/02/check \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"test code\")"}'
```

### 2. Frontend Testing
```bash
# Start frontend server
cd src/frontend && python -m http.server 8000

# Open browser to http://localhost:8000
# Test navigation between lessons
# Verify progress tracking works
# Check "Coming Soon" messages for future lessons
```

### 3. Full Integration Testing
- Load lesson in browser
- Complete the coding exercise
- Check answer and verify feedback
- Navigate to next/previous lessons
- Refresh browser and verify progress persistence

---

## 🚀 Deployment

### Development
New lessons are automatically available once files are created in the correct directory structure.

### Production
1. **Backend (Fly.io)**: Lessons are copied during deployment
2. **Frontend (Netlify)**: No changes needed for lesson content
3. **Testing**: Verify lessons load at production URLs

### Updating Live Platform
1. Create lesson files in correct structure
2. Test locally using checklist above
3. Commit changes to git repository
4. Deploy backend if needed: `flyctl deploy`
5. Frontend updates automatically via Netlify

---

## 📋 Example: Creating Lesson 3

### Step 1: Create Directory
```bash
mkdir lessons/lesson_03_fake_progress
```

### Step 2: Create problem_statement.md
```markdown
# Lesson 3: The Progress Illusion

Time to add fake progress indicators that make users think they're achieving something...

## Your Mission
Create a program that shows fake loading bars and progress indicators...
```

### Step 3: Create starter_code.py
```python
# Welcome to "Try Not to Quit" - Lesson 3: The Progress Illusion
# Your mission: Create convincing fake progress!

import time

print("🎮 Welcome to ADVANCED Try Not to Quit!")
print("Now with 37.2% more psychological manipulation!")

# TODO: Create a fake progress bar
# Hint: Use a for loop with time.sleep()
```

### Step 4: Create solution.py and solution_check.py
Complete implementations that match the problem statement.

### Step 5: Test
Follow testing checklist above.

---

## 💡 Tips for Success

### Educational Design
- Start with what students already know
- Introduce one new concept per lesson
- Provide multiple examples and practice opportunities
- Use humor and engagement to maintain interest

### Technical Considerations
- Keep lessons focused and completable in 15-30 minutes
- Test with different types of student solutions
- Ensure automated checking works reliably
- Plan for common student mistakes

### "Try Not to Quit" Theme
- Each lesson should add new "retention tactics"
- Maintain the playful, slightly manipulative tone
- Use the meta-game to teach real programming concepts
- Make the irony obvious and entertaining

---

**Remember**: The goal is teaching programming through an engaging, self-aware game about retention tactics. Each lesson should be both educational and entertaining!