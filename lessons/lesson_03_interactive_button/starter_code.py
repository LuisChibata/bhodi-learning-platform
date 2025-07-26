# Welcome to Interactive Button Master!
# Your mission: Create buttons that users can click on screen

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
        TODO: Implement different behaviors based on self.action
        """
        if self.action == "quit":
            # TODO: Create a funny quit-prevention message
            return "TODO: Add your quit prevention message here!"
        elif self.action == "help":
            # TODO: Create a helpful (but not too helpful) message
            return "TODO: Add your help message here!"
        else:
            # TODO: Create a default response
            return "TODO: Add your default button response here!"

# TODO: Create your buttons here!
# Example: quit_button = Button("Quit Game", 200, 100, "quit")

# TODO: Create a quit button at position (200, 100)
quit_button = None

# TODO: Create a help button at position (400, 200)  
help_button = None

# TODO: Test your buttons (this will display them in the Button Canvas)
if quit_button:
    print(f"Created button: {quit_button.title} at ({quit_button.x}, {quit_button.y})")

if help_button:
    print(f"Created button: {help_button.title} at ({help_button.x}, {help_button.y})")

# The Button Canvas will automatically detect and display your Button objects!
print("🎮 Check the Button Canvas to see your buttons!")
print("📝 Click them to test their on_click() methods!")