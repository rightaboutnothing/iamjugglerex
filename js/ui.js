export class UI {
    bindEvents(game) {
        document.getElementById('btn-insert').addEventListener('click', () => game.insertCoin());
        document.getElementById('btn-maxbet').addEventListener('click', () => game.maxBet());

        // Lever
        const lever = document.getElementById('lever-area');
        lever.addEventListener('mousedown', () => {
            // Visual feedback
        });
        lever.addEventListener('mouseup', () => {
            game.leverOn();
        });

        // Stop Buttons
        document.getElementById('btn-stop-1').addEventListener('click', () => game.stopReel(0));
        document.getElementById('btn-stop-2').addEventListener('click', () => game.stopReel(1));
        document.getElementById('btn-stop-3').addEventListener('click', () => game.stopReel(2));

        // Settings
        document.getElementById('setting-select').addEventListener('change', (e) => {
            game.logic.setSetting(parseInt(e.target.value));
        });

        document.getElementById('btn-reset').addEventListener('click', () => game.reset());
    }

    updateDisplay(game) {
        document.getElementById('credit-val').textContent = game.credits;
        document.getElementById('payout-val').textContent = game.payout;
        document.getElementById('game-count').textContent = game.stats.games;
        document.getElementById('big-count').textContent = game.stats.big;
        document.getElementById('reg-count').textContent = game.stats.reg;

        // Button states
        const maxBetBtn = document.getElementById('btn-maxbet');
        if (game.state === 'IDLE' && game.credits >= 3) {
            maxBetBtn.disabled = false;
            maxBetBtn.style.opacity = 1;
        } else {
            maxBetBtn.disabled = true;
            maxBetBtn.style.opacity = 0.5;
        }
    }

    enableStopButtons(enabled) {
        const btns = document.querySelectorAll('.stop-btn');
        btns.forEach(b => {
            b.disabled = !enabled;
        });
    }

    disableStopButton(index) {
        const btn = document.getElementById(`btn-stop-${index + 1}`);
        btn.disabled = true;
    }

    lightGogoLamp(on) {
        const lamp = document.getElementById('gogo-lamp');
        if (on) lamp.classList.add('on');
        else lamp.classList.remove('on');
    }
}
