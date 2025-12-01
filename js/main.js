import { Game } from './game.js';
import { UI } from './ui.js';

window.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const game = new Game(ui);

    // Debug
    window.game = game;
});
