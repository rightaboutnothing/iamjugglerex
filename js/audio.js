export class AudioController {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playInsert() {
        this.playTone(880, 'sine', 0.1);
    }

    playStart() {
        // "Da-da-da"
        const now = this.ctx.currentTime;
        [440, 554, 659].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'square', 0.1, 0.05), i * 50);
        });
    }

    playStop() {
        this.playTone(220, 'triangle', 0.1, 0.2);
    }

    playWin() {
        // Simple arpeggio
        [523, 659, 783, 1046].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'sine', 0.2, 0.1), i * 80);
        });
    }

    playBonus() {
        // Fanfare-ish
        const notes = [523, 523, 523, 659, 783, 1046];
        notes.forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'sawtooth', 0.3, 0.1), i * 150);
        });
    }
}
