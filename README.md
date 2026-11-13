# ♟️ Robert James Fischer in Minecraft

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
 * !chess: player plays as white (without time)
 * !chess white: same as !chess
 * !chess black: player plays as black (without time)
 * !chess black 3+2 (or !chess white 3+2): starts a game with timer
  
* **In-game controls:**
  * !resign: player resigns
 * !draw: player requests a draw
 * !time: shows the time remaining for both sides

* **Support:**
 * !chesshelp: It writes a short list of commands in the chat.

* * **Notation system:**
 * Example: e4, e5, Nf3, Nc6 (nf6, nc6 also works, bot fixes it)
 * Castling: o-o, o-o-o
 * Promote: e8=Q (or e8q)
   
## 🛠️ Tech Stack

* **Language:** JavaScript (Node.js)
* **Libraries:** `mineflayer` (Minecraft bot API), `chess.js` (Chess rules & validation), Stockfish Engine.

---

## ⚙️ Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/yx3zyy/bobby-fischer-in-minecraft.git](https://github.com/yx3zyy/bobby-fischer-in-minecraft.git)
   cd bobby-fischer-in-minecraft

2. **Install Dependencies:**
   npm install

3. **Download Stockfish:**
   Download the official Stockfish binary for your operating system from stockfishchess.org.
   Place the stockfish folder/executable inside the project directory next to bot.js (or specify your custom path inside bot.js).
