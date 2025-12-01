import { Logic, SYMBOLS, PAYOUTS } from './logic.js';
import { Reel } from './reels.js';

export class Game {
    constructor(ui) {
        this.ui = ui;
        this.logic = new Logic();
        this.reels = [];
        this.state = 'IDLE'; // IDLE, BETTING, READY, SPINNING, STOPPING, PAYOUT, BONUS
        this.credits = 50;
        this.bet = 0;
        this.payout = 0;
        this.bonusState = null; // null, 'BIG', 'REG'

        this.stats = {
            games: 0,
            big: 0,
            reg: 0
        };

        this.init();
    }

    init() {
        // Initialize Reels
        this.reels = [
            new Reel(0, document.getElementById('reel-1'), 0),
            new Reel(1, document.getElementById('reel-2'), 1),
            new Reel(2, document.getElementById('reel-3'), 2)
        ];

        // Bind UI events
        this.ui.bindEvents(this);
        this.updateUI();
    }

    insertCoin() {
        if (this.credits < 50) {
            this.credits++;
            this.updateUI();
        }
    }

    maxBet() {
        if (this.state !== 'IDLE' && this.state !== 'BONUS') return;
        if (this.credits >= 3) {
            this.credits -= 3;
            this.bet = 3;
            this.state = 'READY';
            this.updateUI();
        }
    }

    leverOn() {
        if (this.state !== 'READY') return;

        this.state = 'SPINNING';
        this.flag = this.logic.roll();
        console.log("Flag:", this.flag);

        // Start all reels
        this.reels.forEach(r => r.spin());

        this.ui.enableStopButtons(true);
        this.stats.games++;
        this.updateUI();
    }

    async stopReel(reelIndex) {
        if (this.state !== 'SPINNING' && this.state !== 'STOPPING') return;

        this.state = 'STOPPING';
        const reel = this.reels[reelIndex];

        // Determine stop position based on flag (Slip logic placeholder)
        // For now, just stop naturally
        await reel.stop();

        this.ui.disableStopButton(reelIndex);

        // Check if all stopped
        if (this.reels.every(r => !r.isSpinning)) {
            this.checkResult();
        }
    }

    checkResult() {
        this.state = 'PAYOUT';

        const r1 = this.reels[0].getCurrentSymbols();
        const r2 = this.reels[1].getCurrentSymbols();
        const r3 = this.reels[2].getCurrentSymbols();

        // Simple center line check for MVP
        // In real machine, 5 lines are valid
        const c1 = r1[1];
        const c2 = r2[1];
        const c3 = r3[1];

        let win = 0;

        // Check Replay
        if (c1 === SYMBOLS.REPLAY && c2 === SYMBOLS.REPLAY && c3 === SYMBOLS.REPLAY) {
            win = 'REPLAY';
        }
        // Check Grape
        else if (c1 === SYMBOLS.GRAPE && c2 === SYMBOLS.GRAPE && c3 === SYMBOLS.GRAPE) {
            win = 7;
        }
        // Check Cherry (Left reel only)
        else if (c1 === SYMBOLS.CHERRY) {
            win = 2;
        }
        // Check 777
        else if (c1 === SYMBOLS.SEVEN && c2 === SYMBOLS.SEVEN && c3 === SYMBOLS.SEVEN) {
            this.triggerBonus('BIG');
        }
        // Check 77BAR
        else if (c1 === SYMBOLS.SEVEN && c2 === SYMBOLS.SEVEN && c3 === SYMBOLS.BAR) {
            this.triggerBonus('REG');
        }

        if (win === 'REPLAY') {
            this.bet = 3; // Replay
            this.state = 'READY'; // Auto-bet
            console.log("REPLAY!");
        } else if (win > 0) {
            this.credits += win;
            this.payout = win;
            this.state = 'IDLE';
            this.bet = 0;
        } else {
            this.state = 'IDLE';
            this.bet = 0;
        }

        // GOGO Lamp Logic (Post-lever or Post-stop)
        // If flag was bonus and we didn't align it, light the lamp?
        // Or simple version: Randomly light up if flag is bonus
        if ((this.flag === 'BB' || this.flag === 'RB') && !this.bonusState) {
            this.ui.lightGogoLamp(true);
        }

        this.updateUI();
    }

    triggerBonus(type) {
        console.log("BONUS!", type);
        this.bonusState = type;
        if (type === 'BIG') this.stats.big++;
        if (type === 'REG') this.stats.reg++;
        this.ui.lightGogoLamp(false); // Reset lamp
        // Bonus game logic would go here (simplified: just payout)
        this.credits += (type === 'BIG' ? 300 : 100);
        this.state = 'IDLE';
        this.bet = 0;
    }

    updateUI() {
        this.ui.updateDisplay(this);
    }

    reset() {
        this.credits = 50;
        this.bet = 0;
        this.payout = 0;
        this.stats = {
            games: 0,
            big: 0,
            reg: 0
        };
        this.state = 'IDLE';
        this.bonusState = null;
        this.ui.lightGogoLamp(false);
        this.updateUI();
    }
}
