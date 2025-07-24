# The Academy Chronicles - Course Overview Solution
# This shows a glimpse of what we'll build together!

class Character:
    """A preview of the character system we'll build in Week 1"""
    def __init__(self, name, character_class):
        self.name = name
        self.character_class = character_class
        self.health = 100
        self.level = 1
        self.experience = 0
    
    def introduce(self):
        return f"�� Hello! I'm {self.name}, a level {self.level} {self.character_class}!"

# Create a sample character
hero = Character("Alex the Brave", "Software Engineering Student")

print("🎮 The Academy Chronicles - Preview! 🎮")
print("=" * 50)
print()
print("Here's a sneak peek of what you'll create:")
print()
print(hero.introduce())
print(f"Health: {hero.health}/100 ❤️")
print(f"Experience: {hero.experience} XP ⭐")
print()
print("🎯 Your Mission:")
print("- Learn Object-Oriented Programming")  
print("- Master Data Structures & Algorithms")
print("- Build Web Applications")
print("- Implement Security Features") 
print("- Create AI Systems")
print("- Pass your HSC exam with confidence!")
print()
print("Ready to begin this epic journey? 🚀")
print("Let's start with Lesson 1: Character Creation!")
