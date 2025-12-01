import { SYMBOLS, REEL_STRIPS } from './logic.js';

export class Reel {
    constructor(id, element, stripIndex) {
        this.id = id;
        this.element = element; // This IS the .reel-strip now
        this.strip = REEL_STRIPS[stripIndex];
        this.stripElement = element; // Direct reference
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.speed = 30; // pixels per frame

        const animate = () => {
            if (!this.isSpinning) return;

            this.position += this.speed;
            // Loop logic
            if (this.position >= this.totalHeight) {
                this.position -= this.totalHeight;
            }

            this.updateVisualPosition();
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    stop(targetSymbol = null) {
        return new Promise(resolve => {
            this.isSpinning = false;

            // Current position in symbols (float)
            const currentSymIndex = this.position / this.symbolHeight;
            const baseIndex = Math.ceil(currentSymIndex); // Next integer index

            let stopIndex = baseIndex;

            // SLIP CONTROL (Hikikomi)
            // If we have a target symbol, we look ahead up to 4 frames (0 to 4)
            if (targetSymbol !== null) {
                for (let i = 0; i <= 4; i++) {
                    const checkIndex = (baseIndex + i) % this.strip.length;
                    if (this.strip[checkIndex] === targetSymbol) {
                        stopIndex = baseIndex + i; // Slide to this
                        break;
                    }
                }
            }

            // Normalize stopIndex to strip length
            const finalIndex = stopIndex % this.strip.length;

            // Animate to stop (Slip effect)
            const targetPos = stopIndex * this.symbolHeight;

            this.position = targetPos;

            // Wrap position for state
            if (this.position >= this.totalHeight) {
                this.position %= this.totalHeight;
            }

            this.updateVisualPosition();

            resolve(finalIndex);
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
