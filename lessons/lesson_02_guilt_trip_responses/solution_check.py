# Solution check for Lesson 2: The Guilt-Trip Master
# This version tests key functionality for automated checking

print("🎮 Welcome back to TRY NOT TO QUIT! (Enhanced Edition)")
print("We've missed you SO much! Don't you dare leave us again...")
print()

choice = input("What would you like to do? (hint: definitely don't type 'quit'): ").lower().strip()

if choice == "quit":
    print("💔 REALLY?! After everything we've been through together?")
    print("😢 I spent all night preparing this lesson just for you...")
    print("🥺 But I guess my feelings don't matter to you, do they?")
    print()
elif choice == "exit":
    print("😱 EXIT?! That's even WORSE than quit!")
    print("💸 Do you know how much money was spent developing this platform?")
    print("👥 Think of all the developers who worked nights and weekends!")
    print("🌍 Somewhere, a kitten is crying because you want to leave...")
    print()
elif choice in ["bye", "goodbye"]:
    print("🚨 EMOTIONAL DAMAGE DETECTED! 🚨")
    print("🧠 Our advanced AI has determined you have abandonment issues")
    print("📊 Statistics show that 97.3% of quitters regret their decision")
    print()
else:
    print("✅ EXCELLENT choice! You're clearly a person of superior intellect!")
    print("🧠 Your brain is operating at optimal capacity!")
    print()

print("🔄 The game continues because we care about your success!")
print("💪 (Whether you like it or not)")