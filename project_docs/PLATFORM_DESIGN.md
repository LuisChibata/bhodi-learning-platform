# Platform Format & Design Instructions

## 1. Core Philosophy

The platform's design is guided by two main influences:

1. **NESA Exam Clarity:** A clean, minimalist, and distraction-free interface to reduce cognitive load.
2. **Educational Design Principles:** Integrating proven learning strategies to maximize Bhodi's understanding and confidence.

---

## 2. Educational Design Principles

This platform will be built upon the following principles:

* **Scaffolding:** Lessons will start with significant support (e.g., starter code, clear hints) that is gradually removed as Bhodi's skills grow. We start from the absolute basics to ensure his foundation is solid before moving to complex topics like inheritance.
* **Immediate & Constructive Feedback:** The platform must provide instant feedback. The "Run Code" button shows *what* his code does. The "Check Answer" button shows *how* it compares to the goal, providing specific, helpful advice rather than just "correct/incorrect."
* **Cognitive Load Management:** The UI will be minimalist. We only show what is necessary for the current task: the problem, the code, and the output. This avoids overwhelming Bhodi with extraneous information.
* **Dual Coding Theory:** Information will be presented both textually (code, descriptions) and visually. The inheritance visualizer is a key example, turning abstract code into a concrete diagram.
* **Constructivism & Gamification:** Bhodi learns by *building* something tangible—a game. This provides a continuous narrative, making each lesson a meaningful step toward a larger, motivating goal.

---

## 3. UI/UX Layout & Functionality

The interface will be a single page, divided into three clear, resizable sections.

### Header Navigation Bar
| **Lesson Navigation & Progress** |
| :-------------------------------- |
| - **Lesson Selector:** Dropdown showing "Lesson 1: The First Room" with progress indicators (✓ for completed) |
| - **Progress Bar:** Visual indicator showing overall course completion (e.g., "2/6 lessons completed") |
| - **Previous/Next Buttons:** Navigate between lessons seamlessly |
| - **Settings Icon:** Access to preferences (theme, font size, etc.) |

| **Problem Statement & Visualizer** (Top Section)                                                                                                                                                                                |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| -**Problem Statement:** Loaded from `problem_statement.md`. Clearly states the goal, requirements, and provides an example of expected output.                                                                                |
| -**Inheritance Visualizer:** A simple graphical box diagram. When Bhodi codes classes like `class Child(Parent):`, the visualizer will automatically draw a box for `Parent` with an arrow pointing to a box for `Child`. |

| **Code Editor** (Bottom-Left Section)                                                                                                                                       |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| - A clean, simple code editor (e.g., using CodeMirror or Monaco).                                                                                                                 |
| - Pre-populated with starter code from `starter_code.py`.                                                                                                                       |
| -**[Run Code]** button: Executes the Python code and displays `stdout` (any `print()` statements) in the Output Panel. This is for quick, iterative testing.            |
| -**[Check Answer]** button: Runs the code against a hidden test case. Compares the output to the `solution.py` file and provides structured feedback in the Output Panel. |
| -**Status Indicator:** Shows "Ready", "Running...", or error states with appropriate colors |

| **Output & Feedback** (Bottom-Right Section)                                                                                       |
| :--------------------------------------------------------------------------------------------------------------------------------------- |
| -**Output Tab:** Shows the direct output from the "Run Code" button.                                                               |
| -**Feedback Tab:** Shows the results from the "Check Answer" button.                                                               |
| -**Success:** "Well done! Your code produced the correct output."                                                                  |
| -**Error:** "Almost there! Your output didn't match the expected output. **Hint:** Check how you are handling player names." |
| -**Error Details:** For syntax/runtime errors, show line numbers and helpful explanations |

---

## 4. User Experience Enhancements

### Error Handling & Feedback
* **Syntax Errors:** Highlight problematic lines in the editor with clear explanations
* **Runtime Errors:** Show stack traces in beginner-friendly language
* **Infinite Loops:** Automatic timeout with helpful message: "Your code seems to be running forever. Check your loop conditions!"
* **Success States:** Celebrate wins with positive feedback and progress indicators

### Responsive Design
* **Desktop:** Full 3-panel layout with resizable sections
* **Tablet:** Stack visualizer on top, code and output side-by-side below
* **Mobile:** Single column layout with tabs to switch between panels

### Accessibility Features
* **Keyboard Navigation:** Tab through all interactive elements
* **High Contrast Mode:** Toggle for better visibility
* **Font Size Controls:** Adjustable text size for code editor
* **Screen Reader Support:** Proper ARIA labels and descriptions

### Progress & Motivation
* **Completion Badges:** Visual rewards for finishing lessons
* **Code History:** Save and review previous attempts
* **Hint System:** Progressive hints that don't give away the answer immediately
