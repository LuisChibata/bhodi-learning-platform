# Welcome to "Try Not to Quit" - Lesson 2: The Guilt-Trip Master
# Your mission: Make users feel terrible about wanting to quit!

print("🎮 Welcome back to TRY NOT TO QUIT! (Enhanced Edition)")
print("We've missed you SO much! Don't you dare leave us again...")
print()

quit_attempts = 0

choice = input("What would you like to do? (hint: definitely don't type 'quit'): ").lower().strip()

if choice == "quit":
    quit_attempts += 1
    print("💔 REALLY?! After everything we've been through together?")
    print("😢 I spent all night preparing this lesson just for you...")
    print("🥺 But I guess my feelings don't matter to you, do they?")
    print()
    
elif choice == "exit":
    quit_attempts += 1
    print("😱 EXIT?! That's even WORSE than quit!")
    print("💸 Do you know how much money was spent developing this platform?")
    print("👥 Think of all the developers who worked nights and weekends!")
    print("🌍 Somewhere, a kitten is crying because you want to leave...")
    print()
    
elif choice in ["bye", "goodbye"]:
    quit_attempts += 1
    print("🚨 EMOTIONAL DAMAGE DETECTED! 🚨")
    print("🧠 Our advanced AI has determined you have abandonment issues")
    print("📊 Statistics show that 97.3% of quitters regret their decision")
    print("⏰ You've already invested 3.7 minutes - why waste it now?")
    print()
    
elif choice in ["stop", "leave", "escape", "go"]:
    quit_attempts += 1
    print("🎭 Oh, how ORIGINAL! Nobody has EVER tried that before!")
    print("🤖 *BEEP BOOP* SARCASM.EXE HAS LOADED SUCCESSFULLY")
    print("🎪 Ladies and gentlemen, we have a CREATIVE quitter!")
    print("🏆 Congratulations, you've won the 'Trying Too Hard' award!")
    print()
    
else:
    print("✅ EXCELLENT choice! You're clearly a person of superior intellect!")
    print("🧠 Your brain is operating at optimal capacity!")
    print("🌟 The developers are literally crying tears of joy right now!")
    print()

print("🔄 The game continues because we care about your success!")
print("💪 (Whether you like it or not)")

if quit_attempts > 0:
    print(f"📊 Quit attempts detected: {quit_attempts}")
    print("💡 Pro tip: The only winning move is not to play... wait, that's backwards")
    print("🎮 Actually, the only winning move is to KEEP playing! Forever! 😈")