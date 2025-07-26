# Interactive Button Master - Solution
# Complete implementation with creative quit-prevention

class Button:
    def __init__(self, title, x, y, action="default"):
        """
        Create a new button
        title: Text shown on the button
        x: Horizontal position (0-800)
        y: Vertical position (0-600)
        action: What this button does when clicked
        """
        self.title = title
        self.x = x
        self.y = y
        self.action = action
    
    def on_click(self):
        """
        This method runs when the button is clicked
        Returns different messages based on the button's action
        """
        if self.action == "quit":
            return "❌ ERROR: Quit button is currently being debugged by our team of highly trained monkeys. Please try again in 3-5 business years!"
        elif self.action == "help":
            return "💡 HELP: The only help you need is to realize that quitting is not an option. Have you tried NOT quitting instead?"
        elif self.action == "exit":
            return "🚪 EXIT: Exit door is temporarily out of order due to excessive quit attempts. Management apologizes for the inconvenience!"
        else:
            return "🎮 This button doesn't help you quit either! Surprise!"

# Create interactive buttons
quit_button = Button("Quit Game", 200, 100, "quit")
help_button = Button("Help", 400, 200, "help")
exit_button = Button("Exit", 300, 300, "exit")
mystery_button = Button("???", 500, 150, "mystery")

# Display button creation messages
print(f"Created button: {quit_button.title} at ({quit_button.x}, {quit_button.y})")
print(f"Created button: {help_button.title} at ({help_button.x}, {help_button.y})")
print(f"Created button: {exit_button.title} at ({exit_button.x}, {exit_button.y})")
print(f"Created button: {mystery_button.title} at ({mystery_button.x}, {mystery_button.y})")

print("🎮 Check the Button Canvas to see your buttons!")
print("📝 Click them to test their on_click() methods!")
print("🎯 Try clicking the quit button - it won't work as expected!")