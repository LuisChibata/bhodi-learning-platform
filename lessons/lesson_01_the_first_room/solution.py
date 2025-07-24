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