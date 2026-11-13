# ♟️ Robert James Fischer (Bobby Fischer) in Minecraft

A Minecraft chess bot powered by the **Stockfish** engine that brings the playing style, historical knowledge, and iconic personality of **Bobby Fischer** into your server.

---

## 🚀 Key Features

* **Stockfish Engine Integration:** Plays strong, calculated chess directly in Minecraft using Stockfish.
* **Controlled Human Error:** Instead of playing like an unbeatable machine every single time, the bot has a chance to make a human-like mistake, keeping games exciting and realistic.
* **Bobby Fischer Personality & Trash Talk:**
  * Calls out opponent blunders in chat based on centipawn drops.
  * Shares random historical Bobby Fischer quotes and dialogues during matches.
  * Recognizes classic chess openings and tells the history/stories behind them as the game unfolds.
* **Time Controls & Clock History:** Supports increment-based time controls (e.g., 3+2, 5+3).

---
## ⚙️ Controls

* **Starting the game:**
 * `!chess`: player plays as white (without time)
 * `!chess white`: same as !chess
 * `!chess black`: player plays as black (without time)
 * `!chess black 3+2 (or !chess white 3+2)`: starts a game with timer
  
* **In-game controls:**
 * `!resign`: player resigns
 * `!draw`: player requests a draw
 * `!time`: shows the time remaining for both sides

* **Support:**
 * `!chesshelp`: It writes a short list of commands in the chat.

* **Notation system:**
 * `Example`: e4, e5, Nf3, Nc6 (nf6, nc6 also works, bot fixes it)
 * `Castling`: o-o, o-o-o
 * `Promote`: e8=Q (or e8q)

* * **Reducing power:**
  * If you find the bot too difficult (or too boring), you can adjust its power in the `bot.js` file. (You will find a photo related to this below.)
  * `0 - 5`: Beginner
  * `5 - 10`: Club Player
  * `10 - 15`: Titled Player
  * `15 20`: Max power / Super GM / GM Level  ---- Its at 29th line
    <img width="794" height="113" alt="image" src="https://github.com/user-attachments/assets/d88becaf-6142-46ab-abe2-79d9ef58333f" />

## 📋 Requirements:

* **Language:** JavaScript (Node.js)
* **Libraries:** `mineflayer` (Minecraft bot API), `chess.js` (Chess rules & validation), Stockfish Engine.

---

## ⚙️ Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yx3zyy/bobby-fischer-in-minecraft.git
   cd bobby-fischer-in-minecraft
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Download Stockfish:**
   Download the official Stockfish binary for your operating system from [Stockfish Offical Web](https://stockfishchess.org/)
   Extract the files:
<img width="658" height="477" alt="image" src="https://github.com/user-attachments/assets/d3169738-cca7-4b71-94ec-5fae5f5a5860" />
<img width="640" height="211" alt="image" src="https://github.com/user-attachments/assets/0affa870-c8a7-4e64-a229-d561f40169d0" />
<img width="872" height="564" alt="image" src="https://github.com/user-attachments/assets/cc518f25-26e0-48a2-9f1f-3a935c32b5e1" />


   Place the stockfish folder/executable inside the project directory next to bot.js (or specify your custom path inside bot.js).
   It should look like this:
<img width="654" height="259" alt="image" src="https://github.com/user-attachments/assets/d4246b82-ba54-4dce-96c4-9552627921bf" />
<img width="680" height="202" alt="image" src="https://github.com/user-attachments/assets/4b940066-d42d-497d-b17e-16a62dbe5b62" />
**NOTE:** Once you have downloaded Stockfish and placed it in a folder, don't forget to rename it to "stockfish.exe" (the original filename often includes the word "universal" and version numbers; you should remove all of that and rename the file to "stockfish.exe").

3. **Configure & Run:**
   Open bot.js and configure your server host, port, and bot credentials. (You will find a photo related to this below.)
   <img width="693" height="161" alt="image" src="https://github.com/user-attachments/assets/dcedce69-6bd0-468b-8433-9c6ca48341d5" />
You must update the code between lines 9 and 17 according to your server's details. Specifically you must update the server IP address on line 13 as well as the login/registration system settings on line 9 if your server has such a system (the bot will automatically determine whether to perform a login or a registration).

**Start the bot**:
```bash
node bot.js
```
