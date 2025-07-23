# Lesson Plan: The Text Adventure Game

This plan scaffolds learning from basic procedural programming to Object-Oriented Programming, all within the narrative of building a game.

---

### **Module 1: Programming Fundamentals**

* **Lesson 1: The First Room**

  * **Goal:** Get the game running.
  * **Concepts:** `print()`, variables, strings, `input()`.
  * **Task:** Create a program that describes a room, asks for the player's name, and greets them.
  * **Confidence Builder:** A simple, achievable first step with a clear, visible output.
* **Lesson 2: Making a Choice**

  * **Goal:** Introduce branching paths.
  * **Concepts:** `if`/`elif`/`else` statements, comparison operators (`==`).
  * **Task:** Present the player with two doors (e.g., "left" or "right"). Print a different description depending on their choice.
* **Lesson 3: The Dungeon Map**

  * **Goal:** Manage game world data efficiently.
  * **Concepts:** Dictionaries (or Lists as a simpler alternative).
  * **Task:** Store the game's rooms and descriptions in a dictionary. Allow the player to move between rooms by updating a `current_room` variable.
* **Lesson 4: Looping Corridors**

  * **Goal:** Keep the game running until the player decides to quit.
  * **Concepts:** `while` loops.
  * **Task:** Wrap the main game logic in a `while True:` loop. Add a "quit" command to `break` the loop.

---

### **Module 2: Object-Oriented Programming (OOP)**

* **Lesson 5: Meet the Creatures**

  * **Goal:** Introduce objects as a way to represent game entities.
  * **Concepts:** `class`, objects (instances), `__init__()` constructor, attributes.
  * **Task:** Create a `Monster` class with `name` and `health` attributes. Create two instances, a "goblin" and a "troll", and place them in different rooms.
* **Lesson 6: A Family of Monsters (Inheritance)**

  * **Goal:** Use inheritance to create specialized types of monsters.
  * **Concepts:** **Inheritance**, parent/child classes, overriding methods.
  * **Task:**
    1. Create a base `Creature` class with `name` and `health`.
    2. Create a `Monster(Creature)` child class that inherits from it.
    3. Create a `Player(Creature)` child class.
    4. **Extension:** Create a `Dragon(Monster)` class that inherits from `Monster` but adds a special `breathe_fire()` method.
  * **Visualizer:** This is where the inheritance visualizer will shine, showing the `Creature -> Monster -> Dragon` and `Creature -> Player` relationships clearly.
