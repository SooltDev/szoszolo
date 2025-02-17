import { createElement, getElement, isTouchScreen } from "./stools.js";
import { EventManager } from "./eventmanager.cls.js";
import { HTMLLine } from "./line.cls.js";

const vowels = 'a,á,e,é,i,í,o,ó,ö,ő,u,ú,ü,ű'.split(',');
const isVowle = (letter) => vowels.includes(letter.toLowerCase());

class Matchbox extends EventManager{
    static #types = ['letter', 'voice', 'figure'];
    #type = 'letter';  // letter, voice, figure
    #letter = null;    // char 
    #vowel = false;    // true, ha magánhangzó
    #location;
    #partner;          // Ez a társpéldány
    element;           // outer DOM element
    parentElement;     // 
    typeElement;       // inner container DOM element
    #startX;           // mouse x
    #startY;           // mouse y
    #matchStarting = false; // true, ha elkezdődött a párosítás
    #linked = false;   // true, ha már össze vannak kapcsolva
    #playground;       // dom elements
    line;
    #xOffset = 0;
    #yOffset = 0;
    #wrong = 0;        // Az elrontott összekötések száma
    #imgPath = undefined;
    #voicePath = undefined;

    constructor(o){
        super();
        
        this.type = o.type;
        this.letter = o.letter;
        this.location = o.location;

        if (this.type == 'figure')
            this.#imgPath = o.imgPath;

        if (this.type == 'voice'){
            this.#voicePath = o.voicePath;
        }

        this.#playground = o.playground || null;

        this.#fixLineCoords();

        this.#build();

    }

    #fixLineCoords(){
        
    /* 
        //Kisérlet arra, hogy a vonalak ne a body-ba legyenek, hanem a játékmezőben
        //Az alábbi kód a koordináták ehhez való igazítását szolgálná
    */
        if (this.#playground.playground){
            if (getComputedStyle(this.#playground.playground).position == "relative"){
                const rect = this.#playground.palygroundInner.getBoundingClientRect();

                this.#xOffset = rect.left;
                this.#yOffset = rect.top;
            }
        }
        //*/

        // Beigazí az egér pozicióját attól függően, hogy merre húzzuk a vonalat.
        
        if (this.#location == 'start'){
            this.#xOffset += 5;
            this.#yOffset += 0;
        } else if (this.#location == 'target'){
            this.#xOffset += -5;
            this.#yOffset += 0;
        }
    }
    //#region #build
    #build(){
        this.element = document.createElement('div');
        this.element.className = 'matchcard in-game';

        //console.info(this.makeFuncName());
        
        this[this.makeFuncName()]();

        if (isTouchScreen){
            this.element.addEventListener('touchstart', this.#mouseDown);
            this.typeElement.addEventListener('touchend', this.checkPartner);
        } else {
            this.element.addEventListener('mousedown', this.#mouseDown);
            this.typeElement.addEventListener('mouseup', this.checkPartner);
        }

    }
    //#endregion
    /*
        Ha felengedjük az egér gombját (mouseup), akkor megnézzük, hogy a társától indult-e vonal
    */
   //#region checkPartner
    checkPartner = (e) => {
        
        if (!this.matching){//ha nem erről a kártyáról indult a vonalösszekötés
            if (this.partner.matching){
                this.#linked = true;
                this.partner.makeLine();
            } else{
                this.trigger('badlink');
                this.wrongInc();
                this.partner.wrongInc();
            }
        }
    }
    //#endregion
/*
    #mouseOver = (e) => {}
    #mouseOut = (e) => {}
*/
    //#region #mouseDown
    #mouseDown = (e) => {
        // Get the current mouse position
        this.#startX = this.offsetMiddle.x;
        this.#startY = this.offsetMiddle.y;

        this.#fixLineCoords();

        this.#matchStarting = true;

        // Attach the listeners to document

        const clientX = isTouchScreen ? e.touches[0].clientX : e.clientX;
        const clientY = isTouchScreen ? e.touches[0].clientY : e.clientY;

        this.line = new HTMLLine({
            color: '#37528e',
            height: 5,
            coords: [ 
                clientX - this.#xOffset, clientY - this.#yOffset, 
                this.#startX, this.#startY 
            ],
            parentElement: this.parentElement.parentElement.parentElement
        });

        if (isTouchScreen){
            document.addEventListener('touchmove', this.#mouseMove);
            document.addEventListener('touchend', this.#mouseUp);
            //e.target.releasePointerCapture(e.pointerId);
        } else {
            document.addEventListener('mousemove', this.#mouseMove);
            document.addEventListener('mouseup', this.#mouseUp);
        }

        this.trigger('mousemove');
    }
    //#endregion

    //#region #mouseUp
    #mouseUp = (e) => {
        // Remove the handlers of mousemove and mouseup
        let check = false;
        
        if (isTouchScreen){
            document.removeEventListener('touchmove', this.#mouseMove);
            document.removeEventListener('touchend', this.#mouseUp);

            const onUpElement = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            //console.log(onUpElement);
            
            if (onUpElement == this.partner.typeElement){
                this.#partner.checkPartner(e);
                check = true;
            }else if (onUpElement != this.typeElement && onUpElement.parentElement.classList.contains("matchcard")){

                this.trigger('badlink');
                this.partner.wrongInc();
                this.wrongInc();
            }
            
        } else {
            document.removeEventListener('mousemove', this.#mouseMove);
            document.removeEventListener('mouseup',this.#mouseUp);
        }
        
        if (!check){
            this.line.destroy();
            this.line = null;
        }

        this.#matchStarting = false;

        this.trigger('mouseup');
    }
    //#endregion

    //#region #mouseMove
    #mouseMove = (e) => {
        e.preventDefault();
        const clientX = isTouchScreen ? e.touches[0].clientX : e.clientX;
        const clientY = isTouchScreen ? e.touches[0].clientY : e.clientY;

        this.line.setLine(
            clientX - this.#xOffset, clientY - this.#yOffset, 
            this.#startX, this.#startY
        );

        this.trigger('move');
    }
    //#endregion

    calcXY2(x, y){

    }

    makeFuncName(){
        const type = this.#type;
        return `make${type[0].toUpperCase()}${type.slice(1)}`;
    }

    makeLetter(){
        this.typeElement = createElement({
            tagName: 'div',
            className: this.vowel ? 'letter vowel' : 'letter',
            parentElement: this.element,
            textContent: this.#letter
        });
    }

    makeVoice(){
        this.typeElement = createElement({
            tagName: 'div',
            className: 'voice',
            parentElement: this.element
        });

        const audio = new Audio(this.#voicePath.normalize('NFD'));

        this.typeElement.addEventListener('click', () => {
            audio.play();
        });
    }

    makeFigure(){
        this.typeElement = createElement({
            tagName: 'div',
            className: 'figure',
            parentElement: this.element
        });

        const img = createElement({
            tagName: 'img'
        });

        img.src = this.#imgPath;

        this.typeElement.appendChild(img);
    }

    removeMouseEvents() {

        if (isTouchScreen){
            this.element.removeEventListener('touchstart', this.#mouseDown);
            this.typeElement.removeEventListener('touchend', this.checkPartner);
        }else {
            this.element.removeEventListener('mousedown', this.#mouseDown);
            this.typeElement.removeEventListener('mouseup', this.checkPartner);
        }

        if (isTouchScreen){
            document.removeEventListener('touchmove', this.#mouseMove);
            document.removeEventListener('touchend',this.#mouseUp);
        }else {
            document.removeEventListener('mousemove', this.#mouseMove);
            document.removeEventListener('mouseup',this.#mouseUp);
        }
    }

    finishStyle(){
        this.element.classList.remove('in-game');
        this.element.classList.add('finish');
        
        if (this.line){
            this.line.color = 'green';
            this.line.element.style.opacity = '0.45';
        }
    }

    makeLine(){
        if (this.#partner.linked){
            this.removeMouseEvents();
            this.#partner.removeMouseEvents();
            this.finishStyle();
            this.#partner.finishStyle();
            this.#linked = true;
            this.trigger('link');
        }
    }

    appendTo(parentElement){
        this.parentElement = getElement(parentElement);
        if (this.parentElement)
            this.parentElement.appendChild(this.element);
    }

    set location(l){
        this.#location = l;
    }

    get location(){
        return this.#location;
    }

    get type(){
        return this.#type;
    }

    set type(t){
        t = t.toLowerCase();
        if ( Matchbox.#types.includes(t) )
            this.#type = t;
    }
    /**
     * Egy karaktert vár és igazat ad vissza, ha a példány, az adott betű képviselője
     * @param {string} char 
     * @param {boolean} caseSensitive
     * @returns {boolean}
     */
    is(char, caseSensitive = false){
        return caseSensitive ? 
            char === this.letter : 
            char.toUpperCase() === this.#letter.toUpperCase();
    }

    /**
     * Összehasonlítja egy ugyan ilyen példánnyal, és igazat ad vissza, ha azonos betű képviselői
     * @param {object} matchboxObject 
     * @returns {boolean}
     */
    compare(matchboxObject){
        if (matchboxObject instanceof Matchbox)
            return matchboxObject.is(this.#letter);
    }

    initial(){
        if (this.#letter.length > 1)
            this.#letter = this.#letter[0].toUpperCase() + this.#letter.slice(1);

        return this.#letter;
    }

    /**
     * Igazat ad vissza, ha volt már ezzel a kártyával hibás összekötés.
     * @returns {boolean}
     */
    isWrong(){
        return this.#wrong > 0;
    }

    wrongInc(){
        this.#wrong++;
    }

    /**
     * Beállítja a betűt, akkor is, ha az karakterkód, és akkor is, ha string karakter
     * 
     */
    set letter(l){
        if (typeof l == 'number')
            return this.#letter = String.fromCharCode(l);
        
        this.#vowel = isVowle(l);

        return this.#letter = l;
    }

    get letter(){
        return this.#letter;
    }

    get vowel () {
        return this.#vowel;
    }

    get partner(){
        return this.#partner;
    }

    get matching(){
        return this.#matchStarting;
    }

    set partner(p){
        if (p instanceof Matchbox)
            this.#partner = p;
    }

    get middle(){
        return {
            x: this.element.clientWidth / 2,
            y: this.element.clientHeight / 2
        }
    }

    get offsetMiddle(){
        const m = this.middle;
        return {
            x: this.element.offsetLeft + m.x,
            y: this.element.offsetTop + m.y
        }
    }

    get linked() {
        return this.#linked;
    }
}

export { Matchbox }