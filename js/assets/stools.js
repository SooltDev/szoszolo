const randomize = (a, b) => Math.floor(Math.random() * (b -a )) + a;

const delay = async(ms) => {
    return new Promise( (resolve, reject) => {
        setTimeout( () => {
            resolve('success');
        }, ms);
    });
}

/**
 * Átalakít egy stringet úgy, hogy nagybetűvel kezdődjön, az összes többi kisbetűs lesz
 * (Főleg szavakra alkalmazandó)
 * @param {string} s 
 * @returns {string}
 */
const capitalize = (s) => typeof s == 'string' ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '';

const shuffleArray = (array) => {
    let j;
    const [ ...copyArray ] = array;
    
    do {
        for (let i = 0; i < array.length; i++){
            
            do {
                j = randomize(0, array.length);
            } while (j == i)

            [array[i], array[j]] = [array[j], array[i]];

        }
    } while (JSON.stringify[array] == JSON.stringify(copyArray))

    return array;
}

/**
 * Objecteket és Tömböket egyesít. Hasonló az Object.Assign()-hez, annyi külömbséggel, hogy 
 * a deepAssign a teljes mélységig klónoz. 
 * 
 * A deepAssign metódust egy tömb vagy object teljes mélységében való klónozására is használható.
 * 
 * Annyiban jobb a JSON.parse(JSON.stringify(object)) megoldáshoz képest, hogy a 
 * 
 * @param  {...object|array} objects 
 * @returns {object|array}
 */
const deepAssign = (...objects) => {
    const merged = Array.isArray(objects[0]) ? [] : {};
    
    for (const object of objects){
        
        for (const key in object){
            if (!Array.isArray(object[key]) && object[key] instanceof Object ){
                if (!merged.hasOwnProperty(key))
                    merged[key] = {};
                merged[key] = deepAssign(merged[key], object[key]);
            }
            else if ( Array.isArray(object[key]) ) {
                if (!merged.hasOwnProperty(key))
                    merged[key] = [];
                merged[key] = deepAssign(merged[key], object[key]);
            } else 
                merged[key] = object[key];
        }
    }

    return merged;
};

/**
 * Kiürít egy tömböt. Előfordul, hogy a tömböt nem szeretnénk lecserélni, vagy konstans. 
 * Így nem adhatunk az őt tároló változónak új értéket egy üres tömbbel. Ekkor szükség az ürítés
 * 
 * @param {array} array 
 * @returns {array} A kiürített tömb
 */

const emptyArray = (array) => {
    array.splice(0, array.length);
    return array;
}

const createElement = (o) => {

    o = Object.assign({
        tagName: 'div',
        className: '',
        id: '',
        innerHTML: '',
        style: {}
    }, o);

    const el = document.createElement(o.tagName);
    
    if (o.className)
        el.className = o.className;

    if (o.id)
        el.id = o.id;

    if (o.innerHTML)
        el.innerHTML = o.innerHTML;

    if (o.innerText)
        el.innerText = o.innerText;

    if (o.textContent)
        el.textContent = o.textContent;
    
    if (o.dataset)
        Object.assign(el.dataset, o.dataset);

    if (o.src){
        el.src = o.src;
    }

    Object.assign(el.style, o.style);

    if (o.parentElement){
        let pElement = getElement(o.parentElement);
        if (pElement)
            pElement.appendChild(el);
    }

    return el;
}

const getElement = (selectorOrElement) => {

    if (!selectorOrElement)
        return null;

    let el = null;

    if (typeof selectorOrElement === 'string')
        el = document.querySelector(selectorOrElement);
    else if (typeof selectorOrElement === 'object' && selectorOrElement instanceof HTMLElement)
        el = selectorOrElement;

    return el;
}

function removeAllChild(element, onlyHTML = false){
    const el = getElement(element);

    if (el){
        const childType = onlyHTML ? 'firstElementChild' : 'firstChild';
        while (el[childType]){
            el[childType].remove();
        }
    }
}

const isObject = o => o instanceof Object && !Array.isArray(o);

const removeAccents = str =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
     * A window objectbe beállít egy értéket, amennyiben nincs érték, úgy visszaadja az értéket.
     * tehát setter/getter függvényként használható
     * @param {string} key 
     * @param {any} val 
     * @returns 
     */
const global = (key, val="/*null*/") => {
    if (val != "/*null*/")
        window[key] = val;

    return window[key];
}

Object.defineProperties(global, {
    GLOBAL: {
        value: {},
        writable: true
    },
    define: {
        value: function(key, val){
            this.GLOBAL[key] = val;
        }
    },

    val: {
        value: function(key){
            return this.GLOBAL[key];
        }
    },

    remove: {
        value: function(key){
            delete this.GLOBAL[key];
        }
    }
});

global('global', global);

const isTouchScreen = "ontouchstart" in document.documentElement;
//const isTouchScreen = true;
export {
    randomize, createElement, getElement, removeAllChild, 
    shuffleArray, emptyArray, deepAssign, capitalize, isObject,
    removeAccents, delay, isTouchScreen, global
};