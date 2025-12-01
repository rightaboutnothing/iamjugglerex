import { SYMBOLS, REEL_STRIPS } from './logic.js';

export class Reel {
    constructor(id, element, stripIndex) {
        this.id = id;
        this.element = element;
        this.strip = REEL_STRIPS[stripIndex];
        this.stripElement = element.querySelector('.reel-strip');
        this.position = 0; // 0 to 20
        this.isSpinning = false;
        this.speed = 0;
        this.stopPromise = null;

        // Visual setup
        this.symbolHeight = 60; // Matches CSS
        this.totalHeight = this.symbolHeight * this.strip.length;

        // Create visual strip
        this.renderStrip();
    }

    renderStrip() {
        // We need to repeat the strip to simulate infinite scrolling
        // 3 sets of symbols should be enough for smooth looping
        this.stripElement.innerHTML = '';
        const fullHtml = [];

        // Helper to get image offset for symbol
        const getSymbolBg = (sym) => {
            // Assuming symbols.png is a vertical strip of 7 symbols
            // 0: BAR, 1: REPLAY, 2: CLOWN, 3: BELL, 4: GRAPE, 5: CHERRY, 6: SEVEN
            // We can use background-position
            return `background-position: 0px -${sym * 60}px`;
        };

        // Render 3 copies of the strip
        for (let i = 0; i < 3; i++) {
            this.strip.forEach(sym => {
                const div = document.createElement('div');
                div.style.height = '60px';
                div.style.width = '100%';
                div.style.backgroundImage = 'url("assets/symbols.png")';
                div.style.backgroundSize = '100% auto';
                div.style.backgroundPosition = `0px -${sym * 60}px`;
                this.stripElement.appendChild(div);
            });
        }
    }

    spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.speed = 30; // pixels per frame

        const animate = () => {
            if (!this.isSpinning) return;

            this.position += this.speed;
            // Loop logic
            // One full strip height is this.totalHeight
            if (this.position >= this.totalHeight) {
                this.position -= this.totalHeight;
            }

            this.updateVisualPosition();
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    stop(targetSymbolIndex = null) {
        return new Promise(resolve => {
            // Simplified stop logic for now
            // In a real machine, we'd have slip control (up to 4 frames)
            // Here we will just stop at the nearest valid position or specific target

            this.isSpinning = false;

            // Snap to nearest symbol
            // Current position in symbols
            let currentSymIndex = Math.floor(this.position / this.symbolHeight);

            // If we have a target index (0-20), we calculate distance
            // For now, just snap to next symbol
            let stopIndex = (currentSymIndex + 1) % this.strip.length;

            // Animate to stop
            const targetPos = stopIndex * this.symbolHeight;

            // Simple snap for MVP
            this.position = targetPos;
            this.updateVisualPosition();

            resolve(stopIndex);
        });
    }

    updateVisualPosition() {
        // We want to show the middle set of the 3 rendered strips
        // Offset by 1 strip height
        const visualPos = this.position + this.totalHeight;
        this.stripElement.style.transform = `translateY(-${visualPos}px)`;
    }

    getCurrentSymbols() {
        // Returns the 3 visible symbols [top, center, bottom]
        const index = Math.floor(this.position / this.symbolHeight);
        const s = this.strip;
        const l = s.length;

        return [
            s[index % l],
            s[(index + 1) % l],
            s[(index + 2) % l]
        ];
    }
}
