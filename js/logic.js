export const SYMBOLS = {
    BAR: 0,
    REPLAY: 1,
    CLOWN: 2,
    BELL: 3,
    GRAPE: 4,
    CHERRY: 5,
    SEVEN: 6 // Added Seven, wasn't in the text list but essential for Juggler
};

// Re-constructed reel strips based on standard Juggler layouts + Search results
// Note: The search result text didn't explicitly list SEVEN in the text list I copied, 
// but Juggler MUST have 7s. I will inject 7s in place of some BARs or add them.
// Standard Juggler usually has 21 symbols.
// I will create a balanced 21-symbol strip for this simulator.

const REEL_LENGTH = 21;

export const REEL_STRIPS = [
    // Left Reel
    [
        SYMBOLS.SEVEN, SYMBOLS.CHERRY, SYMBOLS.GRAPE, SYMBOLS.REPLAY, SYMBOLS.BAR, 
        SYMBOLS.GRAPE, SYMBOLS.REPLAY, SYMBOLS.BELL, SYMBOLS.CLOWN, SYMBOLS.GRAPE,
        SYMBOLS.SEVEN, SYMBOLS.CHERRY, SYMBOLS.GRAPE, SYMBOLS.REPLAY, SYMBOLS.BAR,
        SYMBOLS.GRAPE, SYMBOLS.REPLAY, SYMBOLS.BELL, SYMBOLS.CLOWN, SYMBOLS.GRAPE,
        SYMBOLS.CHERRY
    ],
    // Center Reel
    [
        SYMBOLS.SEVEN, SYMBOLS.GRAPE, SYMBOLS.REPLAY, SYMBOLS.BELL, SYMBOLS.CLOWN,
        SYMBOLS.GRAPE, SYMBOLS.SEVEN, SYMBOLS.GRAPE, SYMBOLS.REPLAY, SYMBOLS.BAR,
        SYMBOLS.GRAPE, SYMBOLS.REPLAY, SYMBOLS.BELL, SYMBOLS.CLOWN, SYMBOLS.GRAPE,
        SYMBOLS.SEVEN, SYMBOLS.GRAPE, SYMBOLS.REPLAY, SYMBOLS.BAR, SYMBOLS.GRAPE,
        SYMBOLS.REPLAY
    ],
    // Right Reel
    [
        SYMBOLS.SEVEN, SYMBOLS.GRAPE, SYMBOLS.REPLAY, SYMBOLS.BELL, SYMBOLS.CLOWN,
        SYMBOLS.GRAPE, SYMBOLS.SEVEN, SYMBOLS.GRAPE, SYMBOLS.REPLAY, SYMBOLS.BAR,
        SYMBOLS.GRAPE, SYMBOLS.REPLAY, SYMBOLS.BELL, SYMBOLS.CLOWN, SYMBOLS.GRAPE,
        SYMBOLS.SEVEN, SYMBOLS.GRAPE, SYMBOLS.REPLAY, SYMBOLS.BAR, SYMBOLS.GRAPE,
        SYMBOLS.REPLAY
    ]
];

// Probabilities (Approximate for Simulation) - Denominator
// Setting 1 to 6
export const PROBABILITIES = {
    1: { BB: 273, RB: 440, GRAPE: 6.5, CHERRY: 36, REPLAY: 7.3 },
    2: { BB: 270, RB: 400, GRAPE: 6.4, CHERRY: 36, REPLAY: 7.3 },
    3: { BB: 270, RB: 331, GRAPE: 6.3, CHERRY: 36, REPLAY: 7.3 },
    4: { BB: 259, RB: 315, GRAPE: 6.2, CHERRY: 36, REPLAY: 7.3 },
    5: { BB: 259, RB: 255, GRAPE: 6.1, CHERRY: 36, REPLAY: 7.3 },
    6: { BB: 255, RB: 255, GRAPE: 5.8, CHERRY: 36, REPLAY: 7.3 }
};

export const PAYOUTS = {
    [SYMBOLS.REPLAY]: 0, // Replay
    [SYMBOLS.GRAPE]: 7, // 7 or 8 coins
    [SYMBOLS.CHERRY]: 2, // 2 coins (corner)
    [SYMBOLS.BELL]: 14,
    [SYMBOLS.CLOWN]: 10,
    [SYMBOLS.BAR]: 0, // Bonus trigger
    [SYMBOLS.SEVEN]: 0 // Bonus trigger
};

export class Logic {
    constructor() {
        this.setting = 6;
        this.flag = null; // 'BB', 'RB', 'GRAPE', 'CHERRY', 'REPLAY', 'BELL', 'CLOWN', or null
    }

    setSetting(s) {
        this.setting = s;
    }

    roll() {
        const probs = PROBABILITIES[this.setting];
        const r = Math.random();

        // Check Bonus
        if (Math.random() < 1/probs.BB) return 'BB';
        if (Math.random() < 1/probs.RB) return 'RB';
        
        // Check Small Wins
        if (Math.random() < 1/probs.GRAPE) return 'GRAPE';
        if (Math.random() < 1/probs.CHERRY) return 'CHERRY';
        if (Math.random() < 1/probs.REPLAY) return 'REPLAY';
        
        // Rare
        if (Math.random() < 1/1092) return 'BELL';
        if (Math.random() < 1/1092) return 'CLOWN';

        return null;
    }
}
