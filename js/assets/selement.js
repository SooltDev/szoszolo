
import * as sTools from "./stools.js";
import { EventManager } from "./eventmanager.cls.js";

let IDCOUNT = 1;
const IDPREFIX = 'selement-';

const nextID = () => IDPREFIX + (IDCOUNT++);
const CACHE = {};

const sCache = () => CACHE;

class SElement extends EventManager{

    element;
    parentElement;
    #children = [];
    #id;
    #cache = false;

    constructor(params){
        super();

        if ('cache' in params)
            this.#cache = params.cache;

        if (sTools.isObject(params)){

            this.element = document.createElement(params.tagName || 'div');

            this.set(
                Object.assign({
                    id: nextID()
                }, params)
            );
        }
    }

    set(params){
        for (const key in params){
            if (this.__proto__.hasOwnProperty(key)){
                if (typeof this[key] == 'function')
                    this[key](params[key]);
                else this[key] = params[key];
            }
        }
    }

    isChildren(sElement){
        return this.#children.includes(sElement)
    }

    add(selement){
        if (selement instanceof SElement){
            if (!this.isChildren(selement))
                this.#children.push(selement);
                this.element.appendChild(selement.element);
                selement.parentElement = this;
        } 
    }

    remove(sChildren){
        if (this.children.includes(sChildren)){
            sChildren.element.remove();
            const ind = this.children.indexOf(sChildren);
            this.children.splice(ind, 1);
            sChildren.destroy();
        }

    }

    set children(childs){

    }

    destroy(){
        delete CACHE[this.#id];
    }

    set id(_id){
        //console.log(_id);
        if (this.#cache && this.#id){
            this.destroy();
        }

        this.#id = _id;
        this.element.id = _id;

        if (this.#cache)
            CACHE[this.#id] = this;
    }

    get id(){
        return this.#id;
    }

    set text(txt){
        this.element.textContent = txt;
    }

    get text(){
        return this.element.textContent;
    }

    set html(htmlCode){
        this.element.innerHTML = htmlCode;
    }

    get html(){
        return this.element.innerHTML;
    }

    set className(css){
        this.element.className = css;
    }

    get className(){
        return this.element.className;
    }

    isCss(css){
        return this.element.classList.contains(css);
    }

    addCss(css){
        this.element.classList.add(css);
    }

    removeCss(css){
        this.element.classList.remove(css);
    }

    toggleCss(css){
        this.element.classList.toggle(css);
    }

    addStyle(s){
        Object.assign(this.element.style, s);
    }

}

const createSElement = (p) => {
    return new SElement(p);
}

export { 
    SElement, createSElement, sCache
}