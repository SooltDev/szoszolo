import { createElement, getElement } from "./stools.js";

/**
 * 
 */

let lineCount = 1;

class HTMLLine{

    #x1;
    #x2;
    #y1;
    #y2;
    element;
    parentElement;

    #styleDisplay;

    /**
     * 
     * @param {{
     *      id: string,
     *      coords: array,
     *      height: number,
     *      color: string,
     *      parentElement: string|HTMLElement
     *  }} options 
     */
    constructor(options){
        this.parentElement = getElement(options.parentElement) || document.body;

        this.id = options.id || 'line-'+(lineCount++);

        options.coords = options.coords || [0, 0, 0, 0];

        this.#x1 = options.coords[0];
        this.#y1 = options.coords[1];
        this.#x2 = options.coords[2];
        this.#y2 = options.coords[3];

        this.element = createElement({
            tagName: 'div',
            id: this.id,
            style: {
                "position": 'absolute',
                "height": (options.height % 2) + 'px',
                "background-color": options.color || 'red',
                "border": `${Math.floor(options.height / 2)}px solid ${options.color}`,
                "transform-origin": "50% 50%",
                "border-radius": options.height + 'px'
            }
        });

        this.setLine();

        this.parentElement.appendChild(this.element);
    }

    setLine(x1, y1, x2, y2) {

        this.#x1 = x1 || this.#x1;
        this.#x2 = x2 || this.#x2;
        this.#y1 = y1 || this.#y1;
        this.#y2 = y2 || this.#y2;

        //console.log(this.#x1, this.#y1, this.#x2, this.#y2);
    
        let distance = Math.sqrt( ((this.#x1 - this.#x2) ** 2) + ((this.#y1 - this.#y2) ** 2) ); 
    
        let xMid = (this.#x1 + this.#x2) / 2;
        let yMid = (this.#y1 + this.#y2) / 2;
    
        let inRadian = Math.atan2(this.#y1 - this.#y2, this.#x1 - this.#x2);
        let inDegrees = (inRadian * 180) / Math.PI;

        const style = {
            width: distance + 'px',
            top: yMid + 'px',
            left: (xMid - (distance / 2)) +'px',
            transform: `rotate(${inDegrees}deg)`,
        };
    
        Object.assign(this.element.style, style);
    }

    /**
     * @param {any} c
     */
    set color(c){
        Object.assign(this.element.style, {
            "background-color": c || 'red',
            "border-color": c || 'red'
        });
    }

    hide(){
        const display = getComputedStyle(this.element).display;
        if (display != 'none'){
            this.#styleDisplay = display;
            this.element.style.display = 'none';
        }
    }

    show(){
        this.element.style.display = this.#styleDisplay;
    }

    destroy(){
        this.element.remove();
    }
}

export {HTMLLine}