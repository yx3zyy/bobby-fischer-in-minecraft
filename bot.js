const mineflayer = require('mineflayer')
const { Chess } = require('chess.js')
const { spawn } = require('child_process')
const readline = require('readline')
const fs = require('fs')
const path = require('path')

// ==================== PASSWORD ====================
const PASSWORD = 'write_your_password_here(if-server-has-login/register-system)'
// ==================================================

const SERVER = {
  host: 'enter-your-server-ip-here',
  port: 25565,
  username: 'Bobby1Fischer',
  version: false,
  auth: 'offline'
}

// ==================== STOCKFISH ====================
// paste the full path of stockfish.exe between the backticks (quotes are fine too)
// leave it empty to use the stockfish folder next to bot.js
const STOCKFISH_PATH = String.raw``

// skillLevel: 0 (weak) - 20 (full strength), moveTime in ms
const STOCKFISH = {
  path: STOCKFISH_PATH.trim().replace(/^["']|["']$/g, '') ||
    path.join(__dirname, 'stockfish', process.platform === 'win32' ? 'stockfish.exe' : 'stockfish'),
  skillLevel: 20,
  moveTime: 1500,
  threads: 2,
  hash: 128
}
// ===================================================

const SETTINGS = {
  openingMoves: 10,
  trashTalk: true,
  fischerStories: true,
  fischerQuotes: true,
  mistakeChance: 0.015,
  chatDelay: 1200,
  idleMinutes: 10,
  reconnectDelay: 10000,
  antiCaps: true,
  debug: true
}

const OPENINGS = [
  ['e4', "King's Pawn Opening"],
  ['e4 e5', 'Open Game'],
  ['e4 e5 Nf3', "King's Knight Opening"],
  ['e4 e5 Nf3 Nc6', "King's Knight Opening: Normal Variation"],
  ['e4 e5 Nf3 Nc6 Bb5', 'Ruy Lopez'],
  ['e4 e5 Nf3 Nc6 Bb5 a6', 'Ruy Lopez: Morphy Defence'],
  ['e4 e5 Nf3 Nc6 Bb5 a6 Bxc6', 'Ruy Lopez: Exchange Variation'],
  ['e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6', 'Ruy Lopez: Morphy Defence, Normal Line'],
  ['e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7', 'Ruy Lopez: Closed'],
  ['e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4', 'Ruy Lopez: Open Variation'],
  ['e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O', 'Ruy Lopez: Closed, Main Line'],
  ['e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5', 'Ruy Lopez: Marshall Attack'],
  ['e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O a4', 'Ruy Lopez: Anti-Marshall'],
  ['e4 e5 Nf3 Nc6 Bb5 Nf6', 'Ruy Lopez: Berlin Defence'],
  ['e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4', 'Ruy Lopez: Berlin Defence, Open Variation'],
  ['e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8', 'Ruy Lopez: Berlin Wall'],
  ['e4 e5 Nf3 Nc6 Bb5 f5', 'Ruy Lopez: Schliemann Defence'],
  ['e4 e5 Nf3 Nc6 Bb5 Bc5', 'Ruy Lopez: Classical Defence'],
  ['e4 e5 Nf3 Nc6 Bb5 d6', 'Ruy Lopez: Steinitz Defence'],
  ['e4 e5 Nf3 Nc6 Bb5 Nd4', "Ruy Lopez: Bird's Defence"],
  ['e4 e5 Nf3 Nc6 Bb5 g6', 'Ruy Lopez: Fianchetto Defence'],
  ['e4 e5 Nf3 Nc6 Bb5 Nge7', 'Ruy Lopez: Cozio Defence'],
  ['e4 e5 Nf3 Nc6 Bc4', 'Italian Game'],
  ['e4 e5 Nf3 Nc6 Bc4 Bc5', 'Italian Game: Giuoco Piano'],
  ['e4 e5 Nf3 Nc6 Bc4 Bc5 c3', 'Italian Game: Giuoco Piano, Main Line'],
  ['e4 e5 Nf3 Nc6 Bc4 Bc5 d3', 'Italian Game: Giuoco Pianissimo'],
  ['e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3', 'Italian Game: Giuoco Pianissimo'],
  ['e4 e5 Nf3 Nc6 Bc4 Bc5 b4', 'Italian Game: Evans Gambit'],
  ['e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4', 'Italian Game: Evans Gambit Accepted'],
  ['e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bb6', 'Italian Game: Evans Gambit Declined'],
  ['e4 e5 Nf3 Nc6 Bc4 Nf6', 'Italian Game: Two Knights Defence'],
  ['e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5', 'Two Knights Defence: Knight Attack'],
  ['e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5', 'Two Knights Defence: Polerio Defence'],
  ['e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5', 'Two Knights Defence: Knight Attack, Normal Line'],
  ['e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7', 'Two Knights Defence: Fried Liver Attack'],
  ['e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5', 'Two Knights Defence: Traxler Counterattack'],
  ['e4 e5 Nf3 Nc6 Bc4 Nf6 d3', "Two Knights Defence: Modern Bishop's Opening"],
  ['e4 e5 Nf3 Nc6 Bc4 Nf6 d4', 'Two Knights Defence: Modern Attack'],
  ['e4 e5 Nf3 Nc6 Bc4 Be7', 'Italian Game: Hungarian Defence'],
  ['e4 e5 Nf3 Nc6 Bc4 Nd4', 'Italian Game: Blackburne Shilling Gambit'],
  ['e4 e5 Nf3 Nc6 d4', 'Scotch Game'],
  ['e4 e5 Nf3 Nc6 d4 exd4 Nxd4', 'Scotch Game: Main Line'],
  ['e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6', 'Scotch Game: Schmidt Variation'],
  ['e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5', 'Scotch Game: Classical Variation'],
  ['e4 e5 Nf3 Nc6 d4 exd4 Bc4', 'Scotch Gambit'],
  ['e4 e5 Nf3 Nc6 d4 exd4 c3', 'Scotch Game: Goring Gambit'],
  ['e4 e5 Nf3 Nc6 Nc3', 'Three Knights Opening'],
  ['e4 e5 Nf3 Nc6 Nc3 Nf6', 'Four Knights Game'],
  ['e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5', 'Four Knights Game: Spanish Variation'],
  ['e4 e5 Nf3 Nc6 Nc3 Nf6 d4', 'Four Knights Game: Scotch Variation'],
  ['e4 e5 Nf3 Nc6 Nc3 Nf6 Bc4', 'Four Knights Game: Italian Variation'],
  ['e4 e5 Nf3 Nc6 c3', 'Ponziani Opening'],
  ['e4 e5 Nf3 Nc6 Be2', 'Inverted Hungarian'],
  ['e4 e5 Nf3 Nf6', "Petrov's Defence"],
  ['e4 e5 Nf3 Nf6 Nxe5 d6', "Petrov's Defence: Main Line"],
  ['e4 e5 Nf3 Nf6 d4', "Petrov's Defence: Steinitz Attack"],
  ['e4 e5 Nf3 Nf6 Nc3', "Petrov's Defence: Three Knights Game"],
  ['e4 e5 Nf3 d6', 'Philidor Defence'],
  ['e4 e5 Nf3 f6', 'Damiano Defence'],
  ['e4 e5 Nf3 f5', 'Latvian Gambit'],
  ['e4 e5 Nf3 d5', 'Elephant Gambit'],
  ['e4 e5 Nf3 Qf6', 'Greco Defence'],
  ['e4 e5 f4', "King's Gambit"],
  ['e4 e5 f4 exf4', "King's Gambit Accepted"],
  ['e4 e5 f4 exf4 Nf3 g5', "King's Gambit Accepted: Classical Variation"],
  ['e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5', "King's Gambit Accepted: Kieseritzky Gambit"],
  ['e4 e5 f4 exf4 Nf3 d6', "King's Gambit Accepted: Fischer Defence"],
  ['e4 e5 f4 exf4 Nf3 d5', "King's Gambit Accepted: Modern Defence"],
  ['e4 e5 f4 exf4 Bc4', "King's Gambit Accepted: Bishop's Gambit"],
  ['e4 e5 f4 Bc5', "King's Gambit Declined: Classical Variation"],
  ['e4 e5 f4 d5', 'Falkbeer Countergambit'],
  ['e4 e5 Nc3', 'Vienna Game'],
  ['e4 e5 Nc3 Nf6', 'Vienna Game: Falkbeer Variation'],
  ['e4 e5 Nc3 Nf6 f4', 'Vienna Gambit'],
  ['e4 e5 Nc3 Nc6', 'Vienna Game: Max Lange Defence'],
  ['e4 e5 Bc4', "Bishop's Opening"],
  ['e4 e5 Bc4 Nf6', "Bishop's Opening: Berlin Defence"],
  ['e4 e5 d4', 'Center Game'],
  ['e4 e5 d4 exd4 c3', 'Danish Gambit'],
  ['e4 e5 Qh5', 'Wayward Queen Attack'],
  ['e4 e5 Qh5 Nc6 Bc4', "Scholar's Mate Attempt"],
  ['e4 e5 Bc4 Nc6 Qf3', "Scholar's Mate Attempt"],
  ['e4 e5 Ke2', 'Bongcloud Attack'],
  ['e4 c5', 'Sicilian Defence'],
  ['e4 c5 Nf3 d6', 'Sicilian Defence: Modern Variations'],
  ['e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3', 'Sicilian Defence: Open'],
  ['e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6', 'Sicilian Defence: Najdorf Variation'],
  ['e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5', 'Sicilian Defence: Najdorf, Main Line'],
  ['e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3', 'Sicilian Defence: Najdorf, English Attack'],
  ['e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2', 'Sicilian Defence: Najdorf, Opocensky Variation'],
  ['e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6', 'Sicilian Defence: Dragon Variation'],
  ['e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3', 'Sicilian Defence: Dragon, Yugoslav Attack'],
  ['e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6', 'Sicilian Defence: Classical Variation'],
  ['e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e6', 'Sicilian Defence: Scheveningen Variation'],
  ['e4 c5 Nf3 d6 Bb5+', 'Sicilian Defence: Moscow Variation'],
  ['e4 c5 Nf3 Nc6', 'Sicilian Defence: Old Sicilian'],
  ['e4 c5 Nf3 Nc6 Bb5', 'Sicilian Defence: Rossolimo Variation'],
  ['e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6', 'Sicilian Defence: Accelerated Dragon'],
  ['e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5', 'Sicilian Defence: Sveshnikov Variation'],
  ['e4 c5 Nf3 e6', 'Sicilian Defence: French Variation'],
  ['e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6', 'Sicilian Defence: Kan Variation'],
  ['e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6', 'Sicilian Defence: Taimanov Variation'],
  ['e4 c5 Nf3 g6', 'Sicilian Defence: Hyperaccelerated Dragon'],
  ['e4 c5 Nf3 a6', "Sicilian Defence: O'Kelly Variation"],
  ['e4 c5 c3', 'Sicilian Defence: Alapin Variation'],
  ['e4 c5 Nc3', 'Sicilian Defence: Closed'],
  ['e4 c5 d4', 'Sicilian Defence: Smith-Morra Gambit'],
  ['e4 c5 d4 cxd4 c3', 'Sicilian Defence: Smith-Morra Gambit'],
  ['e4 c5 f4', 'Sicilian Defence: Grand Prix Attack'],
  ['e4 c5 b4', 'Sicilian Defence: Wing Gambit'],
  ['e4 e6', 'French Defence'],
  ['e4 e6 d4 d5 Nc3', 'French Defence: Paulsen Variation'],
  ['e4 e6 d4 d5 Nc3 Bb4', 'French Defence: Winawer Variation'],
  ['e4 e6 d4 d5 Nc3 Nf6', 'French Defence: Classical Variation'],
  ['e4 e6 d4 d5 Nc3 dxe4', 'French Defence: Rubinstein Variation'],
  ['e4 e6 d4 d5 Nd2', 'French Defence: Tarrasch Variation'],
  ['e4 e6 d4 d5 e5', 'French Defence: Advance Variation'],
  ['e4 e6 d4 d5 exd5', 'French Defence: Exchange Variation'],
  ['e4 e6 d3', "French Defence: King's Indian Attack"],
  ['e4 c6', 'Caro-Kann Defence'],
  ['e4 c6 d4 d5 e5', 'Caro-Kann Defence: Advance Variation'],
  ['e4 c6 d4 d5 exd5 cxd5', 'Caro-Kann Defence: Exchange Variation'],
  ['e4 c6 d4 d5 exd5 cxd5 c4', 'Caro-Kann Defence: Panov-Botvinnik Attack'],
  ['e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5', 'Caro-Kann Defence: Classical Variation'],
  ['e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7', 'Caro-Kann Defence: Karpov Variation'],
  ['e4 c6 d4 d5 f3', 'Caro-Kann Defence: Fantasy Variation'],
  ['e4 c6 Nc3 d5 Nf3', 'Caro-Kann Defence: Two Knights Attack'],
  ['e4 d5', 'Scandinavian Defence'],
  ['e4 d5 exd5 Qxd5', 'Scandinavian Defence: Mieses-Kotroc Variation'],
  ['e4 d5 exd5 Qxd5 Nc3 Qa5', 'Scandinavian Defence: Main Line'],
  ['e4 d5 exd5 Qxd5 Nc3 Qd6', 'Scandinavian Defence: Gubinsky-Melts Defence'],
  ['e4 d5 exd5 Nf6', 'Scandinavian Defence: Modern Variation'],
  ['e4 Nf6', "Alekhine's Defence"],
  ['e4 Nf6 e5 Nd5 d4 d6 Nf3', "Alekhine's Defence: Modern Variation"],
  ['e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4', "Alekhine's Defence: Four Pawns Attack"],
  ['e4 d6', 'Pirc Defence'],
  ['e4 d6 d4 Nf6 Nc3 g6 f4', 'Pirc Defence: Austrian Attack'],
  ['e4 d6 d4 Nf6 Nc3 g6 Be3', 'Pirc Defence: 150 Attack'],
  ['e4 g6', 'Modern Defence'],
  ['e4 Nc6', 'Nimzowitsch Defence'],
  ['e4 b6', "Owen's Defence"],
  ['e4 a6', 'St. George Defence'],
  ['e4 f6', 'Barnes Defence'],
  ['e4 g5', 'Borg Defence'],
  ['d4', "Queen's Pawn Opening"],
  ['d4 d5', "Queen's Pawn Game"],
  ['d4 d5 c4', "Queen's Gambit"],
  ['d4 d5 c4 dxc4', "Queen's Gambit Accepted"],
  ['d4 d5 c4 dxc4 e4', "Queen's Gambit Accepted: Central Variation"],
  ['d4 d5 c4 e6', "Queen's Gambit Declined"],
  ['d4 d5 c4 e6 Nc3 Nf6 cxd5', "Queen's Gambit Declined: Exchange Variation"],
  ['d4 d5 c4 e6 Nc3 c5', "Queen's Gambit Declined: Tarrasch Defence"],
  ['d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 b6', "Queen's Gambit Declined: Tartakower Defence"],
  ['d4 d5 c4 c6', 'Slav Defence'],
  ['d4 d5 c4 c6 Nf3 Nf6 Nc3 e6', 'Semi-Slav Defence'],
  ['d4 d5 c4 e5', 'Albin Countergambit'],
  ['d4 d5 c4 Nc6', 'Chigorin Defence'],
  ['d4 d5 c4 Bf5', 'Baltic Defence'],
  ['d4 d5 Bf4', 'London System'],
  ['d4 Nf6 Bf4', 'London System'],
  ['d4 d5 Nf3 Nf6 Bf4', 'London System'],
  ['d4 Nf6 Nf3 e6 Bf4', 'London System'],
  ['d4 Nf6 Nf3 g6 Bf4', 'London System'],
  ['d4 d5 Nf3 Nf6 e3', 'Colle System'],
  ['d4 d5 e4', 'Blackmar-Diemer Gambit'],
  ['d4 d5 Bg5', 'Levitsky Attack'],
  ['d4 d5 Nc3 Nf6 Bg5', 'Richter-Veresov Attack'],
  ['d4 Nf6', 'Indian Defence'],
  ['d4 Nf6 Bg5', 'Trompowsky Attack'],
  ['d4 Nf6 c4 e6 Nc3 Bb4', 'Nimzo-Indian Defence'],
  ['d4 Nf6 c4 e6 Nc3 Bb4 e3', 'Nimzo-Indian Defence: Rubinstein Variation'],
  ['d4 Nf6 c4 e6 Nc3 Bb4 Qc2', 'Nimzo-Indian Defence: Classical Variation'],
  ['d4 Nf6 c4 e6 Nf3 b6', "Queen's Indian Defence"],
  ['d4 Nf6 c4 e6 Nf3 Bb4+', 'Bogo-Indian Defence'],
  ['d4 Nf6 c4 e6 g3', 'Catalan Opening'],
  ['d4 Nf6 c4 g6 Nc3 Bg7', "King's Indian Defence"],
  ['d4 Nf6 c4 g6 Nc3 Bg7 e4 d6', "King's Indian Defence: Normal Variation"],
  ['d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3', "King's Indian Defence: Samisch Variation"],
  ['d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4', "King's Indian Defence: Four Pawns Attack"],
  ['d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5', "King's Indian Defence: Orthodox Variation"],
  ['d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7', "King's Indian Defence: Mar del Plata Variation"],
  ['d4 Nf6 c4 g6 Nc3 d5', 'Grunfeld Defence'],
  ['d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4', 'Grunfeld Defence: Exchange Variation'],
  ['d4 Nf6 c4 c5', 'Benoni Defence'],
  ['d4 Nf6 c4 c5 d5 e6', 'Modern Benoni'],
  ['d4 Nf6 c4 c5 d5 b5', 'Benko Gambit'],
  ['d4 Nf6 c4 e5', 'Budapest Gambit'],
  ['d4 Nf6 c4 d6', 'Old Indian Defence'],
  ['d4 f5', 'Dutch Defence'],
  ['d4 f5 c4 Nf6 g3 g6', 'Dutch Defence: Leningrad Variation'],
  ['d4 f5 c4 Nf6 g3 e6 Bg2 d5', 'Dutch Defence: Stonewall Variation'],
  ['d4 f5 e4', 'Dutch Defence: Staunton Gambit'],
  ['d4 e5', 'Englund Gambit'],
  ['d4 c5', 'Old Benoni Defence'],
  ['d4 e6', 'Horwitz Defence'],
  ['d4 g6', 'Modern Defence'],
  ['d4 b5', 'Polish Defence'],
  ['c4', 'English Opening'],
  ['c4 e5', "English Opening: King's English"],
  ['c4 c5', 'English Opening: Symmetrical Variation'],
  ['c4 Nf6', 'English Opening: Anglo-Indian Defence'],
  ['c4 e6', 'English Opening: Agincourt Defence'],
  ['c4 f5', 'English Opening: Anglo-Dutch Defence'],
  ['c4 c6', 'English Opening: Caro-Kann Defensive System'],
  ['Nf3', 'Zukertort Opening'],
  ['Nf3 d5 c4', 'Reti Opening'],
  ['Nf3 d5 g3', "King's Indian Attack"],
  ['f4', "Bird's Opening"],
  ['f4 e5', "Bird's Opening: From's Gambit"],
  ['b3', 'Nimzo-Larsen Attack'],
  ['g3', 'Hungarian Opening'],
  ['b4', 'Polish Opening'],
  ['Nc3', 'Van Geet Opening'],
  ['e3', "Van't Kruijs Opening"],
  ['d3', 'Mieses Opening'],
  ['c3', 'Saragossa Opening'],
  ['g4', 'Grob Opening'],
  ['a3', "Anderssen's Opening"],
  ['h4', 'Kadas Opening'],
  ['a4', 'Ware Opening'],
  ['h3', 'Clemenz Opening'],
  ['Nh3', 'Amar Opening'],
  ['Na3', 'Durkin Opening'],
  ['f3', 'Barnes Opening'],
  ['e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Qb6', 'Sicilian Defence: Najdorf, Poisoned Pawn Variation'],
  ['e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bc4', 'Sicilian Defence: Fischer-Sozin Attack'],
  ['e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8', 'Ruy Lopez: Closed, Breyer Defence'],
  ['d4 Nf6 c4 g6 Nc3 d5 Bf4', 'Grunfeld Defence: Bf4 Variation'],
  ['Nf3 Nf6 c4 g6 Nc3 Bg7 d4 O-O Bf4 d5', 'Grunfeld Defence: Bf4 Variation']
]

const LINES = {
  intro: [
    "Stockfish is a fish. I'm the Fischer.",
    'I advise you to resign.',
    'This move is your second blunder. The first was typing !chess in the chat.',
    "Let's get this over with.",
    "I've already seen how this ends. You won't like it.",
    'Brave of you to sit down across from me.'
  ],
  blunder: [
    'Did you really just play that?',
    "It shouldn't be this easy.",
    'lol',
    'Are you even looking at the board?',
    'Thanks for the free material.',
    "That's not chess. That's charity.",
    "You're making this way too easy.",
    "Hope you didn't need that piece.",
    'Wow. Just... wow.',
    'I almost feel bad. Almost.',
    'Bold strategy. Losing on purpose?',
    "I've seen better moves from people who just learned how the horse moves."
  ],
  mistake: [
    'Hmm. Questionable.',
    'Interesting. Not good, but interesting.',
    'You sure about that?',
    "I'll take it.",
    "That's not the move, friend.",
    'Sloppy.',
    'Careful now.'
  ],
  mateSeen: [
    'I see mate in {n}. Do you?',
    'Mate in {n}. Resign whenever you feel like it.',
    'Mate in {n}. This is over.'
  ],
  decent: [
    "Okay, that one wasn't terrible.",
    'Huh. You actually found it.',
    'Fine. Decent move.'
  ],
  lament: [
    'Wait. How did I play that?',
    'How did I do that? Unbelievable.',
    'I must have been asleep on that move.',
    "That was my mistake, not your brilliance. Remember that."
  ],
  respect: [
    "Okay. I'll admit it, {player}. You can actually play.",
    "{n} moves without a real mistake. That's respect from me.",
    'Not bad, {player}. Not bad at all.',
    "You're making me work for this. I like that.",
    "Fine. You've earned a little respect."
  ],
  quotes: [
    "I like the moment when I break a man's ego.",
    "Chess is war over the board. The object is to crush the opponent's mind.",
    "I don't believe in psychology. I believe in good moves.",
    'All that matters on the chessboard is good moves.',
    'Tactics flow from a superior position.',
    'You have to have the fighting spirit. You have to force moves and take chances.',
    'I give 98 percent of my mental energy to chess. Others give only 2 percent.',
    "Don't even mention losing to me. I can't stand to think of it."
  ],
  drawLosing: [
    "Fine. Draw. I wasn't in the mood anyway.",
    'Draw accepted. Whatever.',
    "Sure, take your draw. I've got better things to do.",
    "Okay, draw. Don't tell anyone.",
    'Draw. I was getting bored anyway.'
  ],
  drawWinning: [
    "A draw? You're losing. Keep playing.",
    'No. I want to watch you suffer a little longer.',
    'Draw? Look at the board, {player}. Then look again.',
    'Nice try. Declined.',
    "You don't offer a draw in a lost position. You resign.",
    "I don't do charity. Play on."
  ],
  drawEqual: [
    'Fine, a draw. Consider yourself lucky.',
    'Draw accepted. Go tell your friends you held me.',
    'Okay, draw. You survived. Barely.',
    "Equal position, so fine. Don't get used to it."
  ],
  drawAgain: [
    'Asked and answered. No.',
    'Still no, {player}.',
    'Ask me again and I start playing faster.'
  ],
  illegal: [
    "{move}? That's not even a legal move.",
    "{move} isn't legal. Try again.",
    'Learn the rules first. {move} is illegal.'
  ],
  botWins: [
    'Checkmate. Next.',
    'Checkmate. That was fun. For me.',
    'Mate. Type !chess if you want another lesson.',
    "Checkmate. I'd say good game, but I don't like to lie."
  ],
  playerWins: [
    "...Checkmate. Fine. Enjoy it, it won't happen again.",
    'You got me. Rematch. Now.',
    'Checkmate. I must have been distracted. Well played, {player}.'
  ],
  draw: [
    'Draw. You should be thrilled.',
    'A draw. Consider that a win for you, {player}.'
  ],
  stalemate: [
    'Stalemate. You escaped. Barely.',
    "Stalemate. Lucky. Don't get used to it."
  ],
  resign: [
    'Smart choice, {player}.',
    'Resignation accepted. Wise.',
    'Leaving already? Fine.'
  ],
  idle: [
    'You took too long, {player}. I count that as a resignation.'
  ],
  flag: [
    "Time's up, {player}. The clock doesn't care about your plans.",
    'Flagged. Thinking is allowed, just not forever.',
    'Your flag fell. lol.',
    'Out of time. Maybe try a slower time control. Like correspondence.',
    "And that's the flag. Tick tock, {player}."
  ],
  flagDraw: [
    "Your flag fell, but I've got nothing left to mate you with. Draw. Lucky you."
  ],
  botFlag: [
    'My flag fell? Impossible. Fine, you win on time.',
    "I lost on time. Don't celebrate, you didn't outplay me."
  ],
  botFlagDraw: [
    "My flag fell, but you can't mate me with that. Draw."
  ]
}

const FISCHER_CLOCK_LINE = "I got so sick of losing on time back in the day that I invented the Fischer clock, and you're still losing on time..."

const TIME_CONTROLS = ['1+0', '1+1', '3+2', '5+3', '10+5', '120+30']

const SPECIAL = {
  'Bongcloud Attack': 'The Bongcloud? This is going to be quick.',
  'Grob Opening': 'The Grob. Bold. Wrong, but bold.',
  'Wayward Queen Attack': 'Queen out on move two? Really?',
  "Scholar's Mate Attempt": "Going for Scholar's Mate? Cute.",
  'Barnes Opening': 'f3? Really?',
  'Barnes Defence': 'f6? Your king is going to hate you for that.',
  'Borg Defence': 'g5? Is that a move or a cry for help?',
  'Amar Opening': 'Nh3. Okay then.',
  'Durkin Opening': 'Na3. You must be joking.',
  'Kadas Opening': 'h4 on move one. Creative.',
  'Two Knights Defence: Fried Liver Attack': 'The Fried Liver. I know this one, kid.'
}

const STORIES = [
  [/Poisoned Pawn/, [
    "The Poisoned Pawn. My pet line. Spassky beat me in it in game 11 in 1972 with 14.Nb1. I don't make the same mistake twice."
  ]],
  [/Breyer/, [
    'The Breyer. I beat Spassky in this line in game 10 in 1972, and again in game 1 of our 1992 rematch.'
  ]],
  [/Ruy Lopez: Exchange/, [
    'The Exchange Ruy Lopez. I brought it back from the dead at the 1966 Havana Olympiad. Ask Portisch and Gligoric how that went.'
  ]],
  [/Fischer Defence/, [
    "3...d6. My defence. I called it a high-class waiting move and said the King's Gambit loses by force."
  ]],
  [/Kieseritzky/, [
    "The Kieseritzky. Spassky beat me with this at Mar del Plata in 1960, when I was 17. I answered with an article: A Bust to the King's Gambit."
  ]],
  [/King's Gambit/, [
    "The King's Gambit. Spassky beat me with it in 1960, so I went home and wrote A Bust to the King's Gambit."
  ]],
  [/Evans Gambit/, [
    'The Evans Gambit. I used it to destroy Reuben Fine in 17 moves back in 1963.'
  ]],
  [/Pirc Defence: Austrian/, [
    'The Austrian Attack. Me against Benko, 1963: 19.Rf6!! and he resigned two moves later.'
  ]],
  [/Pirc/, [
    "The Pirc. I surprised Spassky with it in game 17 in 1972. That one was a draw. You won't be so lucky."
  ]],
  [/Fischer-Sozin/, [
    'Bc4 against the Sicilian. They named it the Fischer-Sozin Attack. After me. Respect the name.'
  ]],
  [/Najdorf/, [
    'The Najdorf. My weapon of choice against 1.e4 for my whole career.'
  ]],
  [/Grunfeld/, [
    'The Grunfeld. I was 13 when I sacrificed my queen in this opening against Donald Byrne. They called it the Game of the Century.',
    'Grunfeld, huh. New York, 1956. I played 17...Be6!! at 13. Look it up.'
  ]],
  [/Tartakower/, [
    'The Tartakower. Spassky trusted it in game 6 in 1972. I opened 1.c4, played a masterpiece, and Spassky stood up and applauded me.'
  ]],
  [/English Opening/, [
    '1.c4. Reykjavik 1972, game 6. I almost never played it, then beat Spassky so beautifully that he applauded.',
    'The English. I shocked the whole world with this move in 1972. You just shocked nobody.'
  ]],
  [/Benoni/, [
    'The Benoni. Game 3 in 1972, played in a back room. My first win against Spassky ever came from this opening.'
  ]],
  [/Nimzo-Indian/, [
    'The Nimzo-Indian. I lost game 1 in 1972 with it after grabbing a pawn on h2, then won game 5 with it. Lesson learned.'
  ]],
  [/Alekhine/, [
    "Alekhine's Defence. I pulled it out of nowhere in game 13 in 1972 and won a 74-move war."
  ]],
  [/King's Indian Defence/, [
    "The King's Indian. My favourite defence against 1.d4. I used it again and again in the 1992 rematch too."
  ]],
  [/King's Indian Attack/, [
    "The King's Indian Attack. My favourite way to meet the French. Myagmarsuren found out in 1967 when it ended in mate on e4."
  ]],
  [/Queen's Gambit Declined/, [
    "Queen's Gambit Declined. Nobody had seen me play the white side of this until game 6 in 1972. I won anyway."
  ]],
  [/Ruy Lopez/, [
    'The Ruy Lopez. My favourite opening with white. I played it my whole career, right up to the 1992 rematch.'
  ]],
  [/Sicilian/, [
    'The Sicilian. Game 21 in 1972: I played it, Spassky resigned the adjourned game by phone, and I became world champion.'
  ]]
]

const pick = (list, vars = {}) => list[Math.floor(Math.random() * list.length)]
  .replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : ''))
const chance = p => Math.random() < p
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
const clamp = cp => Math.max(-1500, Math.min(1500, cp))
const fenKey = chess => chess.fen().split(' ').slice(0, 3).join(' ')

function pickFresh(list, used, vars) {
  const left = list.filter(l => !used.has(l))
  const line = pick(left.length ? left : list, vars)
  used.add(line)
  return line
}

function tryMove(chess, move) {
  try {
    return chess.move(move) || null
  } catch {
    return null
  }
}

function uciHistory(chess) {
  return chess.history({ verbose: true }).map(m => m.from + m.to + (m.promotion || ''))
}

function toCp(score) {
  if (!score) return 0
  if (score.type === 'mate') return score.value > 0 ? 3000 - score.value : -3000 - score.value
  return score.value
}

const BOOK = new Map()
for (const [line, name] of OPENINGS) {
  const c = new Chess()
  const bad = line.split(' ').find(san => !tryMove(c, san))
  if (bad) {
    console.log(`[book] skipped "${name}" (illegal move: ${bad})`)
    continue
  }
  BOOK.set(fenKey(c), name)
}

class Engine {
  constructor(opts) {
    this.opts = opts
    this.proc = null
    this.alive = false
    this.ready = Promise.resolve()
    this.listeners = new Set()
    this.queue = Promise.resolve()
  }

  start() {
    if (!fs.existsSync(this.opts.path)) {
      console.log(`[engine] Stockfish not found at ${this.opts.path}`)
      return
    }
    this.proc = spawn(this.opts.path, [], { stdio: ['pipe', 'pipe', 'ignore'] })
    this.alive = true
    this.proc.on('error', err => {
      console.log(`[engine] ${err.message}`)
      this.alive = false
    })
    this.proc.on('exit', code => {
      console.log(`[engine] exited with code ${code}`)
      this.alive = false
    })
    readline.createInterface({ input: this.proc.stdout }).on('line', raw => {
      const line = raw.trim()
      for (const fn of [...this.listeners]) fn(line)
    })

    const level = Math.max(0, Math.min(20, Math.round(this.opts.skillLevel)))
    this.ready = (async () => {
      await this.command('uci', l => l === 'uciok', 15000)
      this.send(`setoption name Threads value ${this.opts.threads}`)
      this.send(`setoption name Hash value ${this.opts.hash}`)
      this.send(`setoption name Skill Level value ${level}`)
      await this.command('isready', l => l === 'readyok', 15000)
      console.log(`[engine] ready (skill level ${level}, ${this.opts.moveTime}ms per move)`)
    })()
    this.ready.catch(err => {
      console.log(`[engine] init failed: ${err.message}`)
      this.alive = false
    })
  }

  send(cmd) {
    if (this.proc && this.proc.stdin.writable) this.proc.stdin.write(cmd + '\n')
  }

  waitFor(isDone, timeout, onLine) {
    return new Promise((resolve, reject) => {
      const fn = line => {
        if (onLine) onLine(line)
        if (!isDone(line)) return
        clearTimeout(timer)
        this.listeners.delete(fn)
        resolve(line)
      }
      const timer = setTimeout(() => {
        this.listeners.delete(fn)
        reject(new Error('engine timeout'))
      }, timeout)
      this.listeners.add(fn)
    })
  }

  command(cmd, isDone, timeout) {
    const p = this.waitFor(isDone, timeout)
    this.send(cmd)
    return p
  }

  enqueue(run) {
    const job = this.queue.then(run, run)
    this.queue = job.catch(() => {})
    return job
  }

  go(moves, movetime, onInfo) {
    const done = this.waitFor(l => l.startsWith('bestmove'), movetime + 20000, line => {
      if (line.startsWith('info')) onInfo(line)
    })
    this.send(`position startpos${moves.length ? ' moves ' + moves.join(' ') : ''}`)
    this.send(`go movetime ${movetime}`)
    return done.then(line => line.split(/\s+/)[1])
  }

  search(moves, movetime = this.opts.moveTime) {
    return this.enqueue(async () => {
      if (!this.alive) throw new Error('engine offline')
      await this.ready
      let score = null
      const move = await this.go(moves, movetime, line => {
        if (/ multipv [2-9]/.test(line)) return
        const m = line.match(/ score (cp|mate) (-?\d+)/)
        if (m) score = { type: m[1], value: Number(m[2]) }
      })
      return { move, score }
    })
  }

  searchLines(moves, movetime, count) {
    return this.enqueue(async () => {
      if (!this.alive) throw new Error('engine offline')
      await this.ready
      const lines = new Map()
      this.send(`setoption name MultiPV value ${count}`)
      try {
        const best = await this.go(moves, movetime, line => {
          const k = line.match(/ multipv (\d+)/)
          const s = line.match(/ score (cp|mate) (-?\d+)/)
          const pv = line.match(/ pv (\S+)/)
          if (s && pv) lines.set(k ? Number(k[1]) : 1, { move: pv[1], score: { type: s[1], value: Number(s[2]) } })
        })
        return { best, lines: [...lines.keys()].sort((a, b) => a - b).map(k => lines.get(k)) }
      } finally {
        this.send('setoption name MultiPV value 1')
      }
    })
  }
}

const engine = new Engine(STOCKFISH)
const games = new Map()
const chatQueue = []
let chatBusy = false
let lastSent = null
let bot = null
let auth = null

const SAN_TOKEN = /^(\d+\.+)?([KQRBN][a-h]?[1-8]?x?[a-h][1-8]|[a-h](x[a-h])?[1-8]|O-O)/

function tame(msg, limit) {
  const words = msg.split(' ')
  let caps = (msg.match(/[A-Z]/g) || []).length
  for (let i = words.length - 1; i >= 0 && caps > limit; i--) {
    const n = (words[i].match(/[A-Z]/g) || []).length
    if (!n || SAN_TOKEN.test(words[i])) continue
    words[i] = words[i].toLowerCase()
    caps -= n
  }
  return words.join(' ')
}

function say(msg, retried = false, onSent = null) {
  let text = String(msg).slice(0, 250)
  if (SETTINGS.antiCaps) text = tame(text, 4)
  chatQueue.push({ msg: text, retried, onSent })
  pump()
}

function retryIfBlocked(text) {
  if (!lastSent || lastSent.retried || Date.now() - lastSent.time > 4000) return false
  if (!/b[uü]y[uü]k harf|too many caps|caps lock|uppercase/i.test(text)) return false
  console.log('[chat] blocked by caps filter, resending in lowercase')
  lastSent.retried = true
  chatQueue.unshift({ msg: tame(lastSent.msg, 0), retried: true, onSent: null })
  pump()
  return true
}

function pump() {
  if (chatBusy || !chatQueue.length || !bot) return
  chatBusy = true
  const item = chatQueue.shift()
  lastSent = { ...item, time: Date.now() }
  try {
    bot.chat(item.msg)
  } catch (err) {
    console.log(`[chat] ${err.message}`)
  }
  if (item.onSent) item.onSent()
  setTimeout(() => {
    chatBusy = false
    pump()
  }, SETTINGS.chatDelay)
}

const MOVE_RE = /^([KQRBNkqrbn]?[a-h]?[1-8]?x?[a-h][1-8](=?[QRBNqrbn])?|[Oo0]-[Oo0](-[Oo0])?|[a-h][1-8][a-h][1-8][qrbnQRBN]?)[+#!?]*$/

function parsePlayerMove(chess, input) {
  const clean = input.trim().replace(/[+#!?]+$/, '')
  const tries = [clean]

  if (/^[o0]-[o0](-[o0])?$/i.test(clean)) tries.unshift(clean.length > 3 ? 'O-O-O' : 'O-O')
  if (/^[nbrqk]/.test(clean) && clean.length >= 3) tries.push(clean[0].toUpperCase() + clean.slice(1))
  if (/=?[qrbn]$/.test(clean)) tries.push(...tries.map(t => t.replace(/=?([qrbn])$/, (_, p) => '=' + p.toUpperCase())))

  for (const t of tries) {
    const move = tryMove(chess, t)
    if (move) return move
  }

  const uci = clean.toLowerCase().match(/^([a-h][1-8])([a-h][1-8])([qrbn])?$/)
  if (uci) return tryMove(chess, { from: uci[1], to: uci[2], promotion: uci[3] || 'q' })
  return null
}

function openingName(game) {
  for (let i = game.fens.length - 1; i >= 0; i--) {
    const name = BOOK.get(game.fens[i])
    if (name) return name
  }
  return null
}

function findStory(names) {
  for (const [re, lines] of STORIES) {
    if (names.some(n => re.test(n))) return lines
  }
  return null
}

function endGame(game) {
  if (games.get(game.player) === game) games.delete(game.player)
  clearTimeout(game.timer)
  if (game.clock) clearTimeout(game.clock.timer)
}

const pad = n => String(n).padStart(2, '0')

function fmtClock(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`
}

function tcLabel(minutes) {
  if (minutes < 3) return 'bullet'
  if (minutes < 10) return 'blitz'
  if (minutes < 60) return 'rapid'
  return 'classical'
}

function canMate(chess, color) {
  const pieces = side => chess.board().flat().filter(p => p && p.color === side && p.type !== 'k').map(p => p.type)
  const mine = pieces(color)
  if (!mine.length) return false
  if (mine.length === 1 && 'bn'.includes(mine[0]) && !pieces(color === 'w' ? 'b' : 'w').length) return false
  return true
}

function playerTimeLeft(game) {
  const c = game.clock
  return c.turnStart === null ? c.player : c.player - (Date.now() - c.turnStart)
}

function startPlayerClock(game) {
  const c = game.clock
  if (!c || games.get(game.player) !== game) return
  clearTimeout(c.timer)
  c.turnStart = Date.now()
  c.timer = setTimeout(() => flagPlayer(game), Math.max(0, c.player) + 50)
}

function stopPlayerClock(game) {
  const c = game.clock
  if (!c || c.turnStart === null) return true
  clearTimeout(c.timer)
  c.player -= Date.now() - c.turnStart
  c.turnStart = null
  if (c.player <= 0) {
    flagPlayer(game)
    return false
  }
  c.player += c.inc
  return true
}

function flagPlayer(game) {
  if (games.get(game.player) !== game) return
  endGame(game)
  console.log(`[chess] ${game.player} lost on time`)
  if (!canMate(game.chess, game.botColor)) return say(pick(LINES.flagDraw, { player: game.player }))
  say(pick(LINES.flag, { player: game.player }))
  say(FISCHER_CLOCK_LINE)
}

function thinkTime(game) {
  const c = game.clock
  if (!c) return STOCKFISH.moveTime
  return Math.max(100, Math.min(STOCKFISH.moveTime, Math.floor(c.bot / 30 + c.inc * 0.7)))
}

function showTime(player) {
  const game = games.get(player)
  if (!game) return
  if (!game.clock) return say('No clock in this game. Take your time. Not too much.')
  say(`${player}: ${fmtClock(playerTimeLeft(game))} | me: ${fmtClock(game.clock.bot)}`)
}

function reactTo(game, result) {
  const plies = game.chess.history().length
  const now = toCp(result.score)
  const base = game.baseline
  const loss = base && base.ply === plies - 1 ? clamp(now) - clamp(base.cp) : null

  if (loss !== null) game.cleanStreak = loss < 100 ? game.cleanStreak + 1 : 0

  if (game.gift && !game.lamented && plies - game.gift.ply <= 7 && now <= Math.min(-80, game.gift.bestCp - 150)) {
    game.lamented = true
    return pick(LINES.lament)
  }

  if (!game.respected && game.cleanStreak >= game.respectAt) {
    game.respected = true
    return pick(LINES.respect, { player: game.player, n: game.cleanStreak })
  }

  if (!SETTINGS.trashTalk) return null

  const name = BOOK.get(game.fens[game.fens.length - 1])
  if (name && SPECIAL[name] && !game.jabbed.has(name)) {
    game.jabbed.add(name)
    return SPECIAL[name]
  }

  if (loss === null) return null
  if (loss >= 250) {
    if (result.score && result.score.type === 'mate' && result.score.value > 0) {
      return pick(LINES.mateSeen, { n: result.score.value })
    }
    return pick(LINES.blunder)
  }
  if (loss >= 120) return chance(0.7) ? pick(LINES.mistake) : null
  if (loss <= 15 && plies > 16 && chance(0.08)) return pick(LINES.decent)
  return null
}

async function refreshBaseline(game) {
  const ply = game.chess.history().length
  try {
    const { score } = await engine.search(uciHistory(game.chess), Math.min(600, STOCKFISH.moveTime))
    game.baseline = { ply, cp: -toCp(score) }
  } catch {}
}

async function chooseMistake(moves, movetime = STOCKFISH.moveTime) {
  const { best, lines } = await engine.searchLines(moves, movetime, 5)
  const top = lines[0]
  if (!top) return { move: best, score: null }
  const topCp = toCp(top.score)
  const options = lines.slice(1).filter(l => {
    const drop = topCp - toCp(l.score)
    return drop >= 120 && drop <= 450
  })
  if (!options.length) return { move: best, score: top.score }
  const choice = options[Math.floor(Math.random() * options.length)]
  return { move: choice.move, score: top.score, gift: topCp }
}

function finish(game, lastMover) {
  endGame(game)
  const c = game.chess
  const vars = { player: game.player }
  if (c.isCheckmate()) say(pick(lastMover === 'bot' ? LINES.botWins : LINES.playerWins, vars))
  else if (c.isStalemate()) say(pick(LINES.stalemate, vars))
  else say(pick(LINES.draw, vars))
}

function scheduleQuote(game, first = true) {
  if (!SETTINGS.fischerQuotes) return
  const delay = (first ? rand(40, 150) : rand(150, 300)) * 1000
  game.timer = setTimeout(() => {
    if (games.get(game.player) !== game) return
    say(pickFresh(LINES.quotes, game.usedQuotes))
    if (++game.quotesSaid < 2) scheduleQuote(game, false)
  }, delay)
}

function startGame(player, color, tc = null) {
  if (games.has(player)) return say(`${player}, we're already playing. (!resign to quit)`)
  if (!engine.alive) return say('My engine is offline. Tell my owner to check the Stockfish path.')

  const playerColor = color === 'black' ? 'b' : 'w'
  const game = {
    player,
    playerColor,
    botColor: playerColor === 'w' ? 'b' : 'w',
    chess: new Chess(),
    fens: [],
    jabbed: new Set(),
    usedQuotes: new Set(),
    seenNames: [],
    lastOpening: null,
    stable: 0,
    storyTold: false,
    introDone: false,
    baseline: null,
    gift: null,
    lamented: false,
    cleanStreak: 0,
    respectAt: rand(20, 30),
    respected: false,
    quotesSaid: 0,
    drawRejectedAt: -100,
    timer: null,
    clock: null,
    busy: false,
    lastActive: Date.now()
  }
  if (tc) {
    const [minutes, inc] = tc.split('+').map(Number)
    game.clock = { minutes, inc: inc * 1000, player: minutes * 60000, bot: minutes * 60000, turnStart: null, timer: null }
  }
  games.set(player, game)

  const tcText = tc ? ` ${tc} ${tcLabel(game.clock.minutes)}.` : ''
  say(playerColor === 'w'
    ? `Alright ${player}. You're white, I'm black.${tcText} Make your move.`
    : `Alright ${player}. You're black, I'm white.${tcText} Watch and learn.`,
  false, playerColor === 'w' ? () => startPlayerClock(game) : null)
  scheduleQuote(game)

  if (game.botColor === 'w') botTurn(game, false)
  else refreshBaseline(game)
}

function resign(player) {
  const game = games.get(player)
  if (!game) return
  endGame(game)
  say(pick(LINES.resign, { player }))
}

async function offerDraw(player) {
  const game = games.get(player)
  if (!game) return
  if (game.busy) return say(`Let me finish my move first, ${player}.`)

  const plies = game.chess.history().length
  if (plies - game.drawRejectedAt < 6) return say(pick(LINES.drawAgain, { player }))

  game.busy = true
  let score
  try {
    ({ score } = await engine.search(uciHistory(game.chess), Math.min(1000, STOCKFISH.moveTime)))
  } catch {
    game.busy = false
    return say("Can't think about draws right now. Play on.")
  }
  game.busy = false
  if (games.get(player) !== game) return

  let cp = toCp(score)
  if (game.chess.turn() !== game.botColor) cp = -cp
  console.log(`[chess] ${player} offered a draw, eval for me: ${cp}`)

  if (cp >= 100) {
    game.drawRejectedAt = plies
    return say(pick(LINES.drawWinning, { player }))
  }
  endGame(game)
  say(pick(cp <= -100 ? LINES.drawLosing : LINES.drawEqual, { player }))
}

async function botTurn(game, playerMoved) {
  const { player, chess } = game
  game.busy = true
  const started = Date.now()
  const movetime = thinkTime(game)

  let result
  try {
    if (chess.history().length === 0) {
      result = { move: chance(0.15) ? 'c2c4' : 'e2e4', score: null }
    } else if (playerMoved && !game.gift && chess.history().length >= 12 && chance(SETTINGS.mistakeChance)) {
      result = await chooseMistake(uciHistory(chess), movetime)
    } else {
      result = await engine.search(uciHistory(chess), movetime)
    }
  } catch (err) {
    console.log(`[engine] ${err.message}`)
    endGame(game)
    return say('My engine just crashed. Game aborted. You got lucky.')
  }
  if (games.get(player) !== game) return

  const reaction = playerMoved ? reactTo(game, result) : null
  const reply = tryMove(chess, {
    from: result.move.slice(0, 2),
    to: result.move.slice(2, 4),
    promotion: result.move[4] || 'q'
  })
  game.busy = false

  if (!reply) {
    endGame(game)
    return say('Something went wrong on my side. Game aborted.')
  }

  if (game.clock) {
    game.clock.bot -= Date.now() - started
    if (game.clock.bot <= 0) {
      endGame(game)
      console.log(`[chess] I lost on time against ${player}`)
      return say(pick(canMate(chess, game.playerColor) ? LINES.botFlag : LINES.botFlagDraw, { player }))
    }
    game.clock.bot += game.clock.inc
  }

  const plies = chess.history().length
  if (result.gift !== undefined) {
    game.gift = { ply: plies, bestCp: result.gift }
    console.log(`[chess] playing a deliberate mistake (${reply.san}) against ${player}`)
  }
  game.fens.push(fenKey(chess))
  game.lastActive = Date.now()

  const out = []
  const name = openingName(game)
  if (name && !game.seenNames.includes(name)) game.seenNames.push(name)

  let line = reply.san
  if (plies <= SETTINGS.openingMoves * 2 && name && name !== game.lastOpening) {
    game.lastOpening = name
    game.stable = 0
    line += ` - ${name}`
  } else {
    game.stable++
  }
  out.push(line)

  if (!playerMoved && plies === 1 && reply.san === 'e4' && chance(0.6)) out.push('Best by test.')
  if (reaction) out.push(reaction)
  if (playerMoved && !game.introDone) {
    game.introDone = true
    out.push(pick(LINES.intro))
  }
  if (SETTINGS.fischerStories && !game.storyTold && plies <= 30 && game.seenNames.length && (game.stable >= 1 || plies >= 20)) {
    const story = findStory(game.seenNames)
    if (story) {
      game.storyTold = true
      out.push(pick(story))
    }
  }
  out.forEach((m, i) => say(m, false, i === 0 ? () => startPlayerClock(game) : null))

  if (chess.isGameOver()) return finish(game, 'bot')
  refreshBaseline(game)
}

async function onPlayerMove(game, text) {
  const { player, chess } = game
  if (game.busy || chess.turn() !== game.playerColor) return say(`Patience, ${player}. I'm thinking.`)
  if (game.clock && playerTimeLeft(game) <= 0) return flagPlayer(game)

  const move = parsePlayerMove(chess, text)
  if (!move) {
    const last = chess.history().slice(-1)[0]
    return say(pick(LINES.illegal, { move: text }) + (last ? ` My last move was ${last}.` : ''))
  }

  if (!stopPlayerClock(game)) return
  game.fens.push(fenKey(chess))
  game.lastActive = Date.now()
  if (chess.isGameOver()) return finish(game, 'player')
  botTurn(game, true)
}

function handleAuth(text) {
  if (auth.done) return
  const t = text.toLowerCase()

  if (/success|ba[sş]ar[iı]yla|ba[sş]ar[iı]l[iı]|zaten|already|logged in|giri[sş] yapt[iı]n|ho[sş] geldin|welcome back/.test(t)) {
    auth.done = true
    console.log('[auth] done')
    return
  }

  if (Date.now() - auth.last < 4000) return

  let cmd = null
  if (/\/register\b|\/kayit\b|please register|kay[iı]t ol/.test(t) && auth.register < 3) {
    auth.register++
    cmd = `/register ${PASSWORD} ${PASSWORD}`
  } else if (/\/login\b|\/giris\b|please log ?in|giri[sş] yap/.test(t) && auth.login < 3) {
    auth.login++
    cmd = `/login ${PASSWORD}`
  }
  if (!cmd) return

  auth.last = Date.now()
  console.log(`[auth] sending ${cmd.split(' ')[0]}`)
  setTimeout(() => {
    try {
      bot.chat(cmd)
    } catch (err) {
      console.log(`[auth] ${err.message}`)
    }
  }, 1000)
}

function parseChat(text) {
  const m = text.match(/^<([A-Za-z0-9_]{3,16})> (.+)$/) ||
    text.match(/^(?:.*?[\s\]])?([A-Za-z0-9_]{3,16})\s*(?:»|>>|->|:|>|\|)\s*(.+)$/)
  if (!m) return null
  const known = bot.players && bot.players[m[1]]
  if (!known && /\/(register|login|kayit|giris)\b/i.test(text)) return null
  return { user: m[1], msg: m[2].trim() }
}

function nameFromUuid(uuid) {
  if (!uuid || typeof uuid !== 'string' || /^0{8}-0{4}-0{4}/.test(uuid)) return null
  const id = uuid.replace(/-/g, '').toLowerCase()
  const found = Object.values(bot.players || {}).find(p => p.uuid && p.uuid.replace(/-/g, '').toLowerCase() === id)
  return found ? found.username : null
}

function handleMessage(raw, sender) {
  const text = raw.replace(/§./g, '').trim()
  if (!text) return

  let chat = null
  const senderName = nameFromUuid(sender)
  if (!senderName && retryIfBlocked(text)) return
  if (senderName) {
    const parsed = parseChat(text)
    chat = { user: senderName, msg: parsed && parsed.user === senderName ? parsed.msg : text }
  } else {
    chat = parseChat(text)
  }

  if (SETTINGS.debug) console.log(chat ? `[chat] ${chat.user}: ${chat.msg}` : `[chat] ${text}`)
  if (!chat) return handleAuth(text)

  const { user, msg } = chat
  if (user === bot.username) return

  const cmd = msg.toLowerCase().replace(/\s+/g, ' ').trim()
  if (cmd.startsWith('!')) console.log(`[cmd] ${user}: ${msg}`)
  if (cmd === '!chess' || cmd.startsWith('!chess ')) {
    let color = 'white'
    let tc = null
    for (const part of cmd.split(' ').slice(1)) {
      if (part === 'white' || part === 'black') color = part
      else if (/^\d+\+\d+$/.test(part) && TIME_CONTROLS.includes(part)) tc = part
      else return say(`Usage: !chess [black] [time]. Time controls: ${TIME_CONTROLS.join(', ')}`)
    }
    return startGame(user, color, tc)
  }
  if (cmd === '!time') return showTime(user)
  if (cmd === '!draw') return offerDraw(user)
  if (cmd === '!resign') return resign(user)
  if (cmd === '!chesshelp') {
    return say(`!chess [black] [time], !draw, !resign, !time. Time controls: ${TIME_CONTROLS.join(', ')}`)
  }

  const game = games.get(user)
  if (game && MOVE_RE.test(msg)) onPlayerMove(game, msg)
}

function createBot() {
  auth = { done: false, register: 0, login: 0, last: 0 }
  bot = mineflayer.createBot(SERVER)

  bot.once('spawn', () => console.log(`[bot] joined ${SERVER.host}:${SERVER.port} as ${bot.username}`))
  bot.on('messagestr', (msg, position, json, sender) => {
    if (position === 'game_info') return handleAuth(msg)
    handleMessage(msg, sender)
  })
  bot.on('kicked', reason => console.log(`[bot] kicked: ${typeof reason === 'string' ? reason : JSON.stringify(reason)}`))
  bot.on('error', err => console.log(`[bot] error: ${err.message}`))
  bot.on('end', reason => {
    console.log(`[bot] disconnected (${reason}), reconnecting in ${SETTINGS.reconnectDelay / 1000}s`)
    for (const game of games.values()) {
      clearTimeout(game.timer)
      if (game.clock) clearTimeout(game.clock.timer)
    }
    games.clear()
    chatQueue.length = 0
    setTimeout(createBot, SETTINGS.reconnectDelay)
  })
}

setInterval(() => {
  const limit = SETTINGS.idleMinutes * 60 * 1000
  for (const game of [...games.values()]) {
    if (!game.clock && !game.busy && Date.now() - game.lastActive > limit) {
      endGame(game)
      say(pick(LINES.idle, { player: game.player }))
    }
  }
}, 30000)

if (PASSWORD === 'write_your_password_here') console.log('[auth] you have not set a password yet, edit PASSWORD at the top of bot.js')
console.log(`[book] ${BOOK.size} openings loaded`)
engine.start()
createBot()