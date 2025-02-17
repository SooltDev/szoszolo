/**
 * Name: Szószóló
 * Version: 1.0
 * Description: Készségfejlesztő játék, tanulásban akadályoztatott gyerekek számára. 
 * Mely a betűk elsajátítását hívatott elősegíteni
 * 
 * Author: Fosztó Zsolt, Tanay Marcell javaslata, és további ötletei alapján
 * Published: 2025. február
 */
import { gameSetup } from "./js/gamesetup.js";
import { matchLine } from "./js/game.js";

//screen.orientation.lock('portrait');

const game = matchLine({
    parentElement: '#content',
});

const app = gameSetup({
    parentElement: '#content',
    game: game
});

game.gameSetup = app;

app.render();
