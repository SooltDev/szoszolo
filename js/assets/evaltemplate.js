
/* ********************************************* *

            -----Eval template----

**************************************************/

/**
 *  Egy "id" vagy "class" attributumból, Javascript változónevet állít elő
 * @param {string} as Egy "id" vagy "class" attributum
 * @returns {string}
 */

function nameByAttrStr(as){
    let name = '';

    let nameChunks = as.split(/-|_/g);
    for (const word of nameChunks)
        name += word[0].toUpperCase() + word.slice(1);

    return name[0].toLowerCase() + name.slice(1);
}

/**
 * Egy HTMLelement attributumai alapján egy JSnevet állít elő.
 * az "attrs" parméterben be lehet állítani az attributumok fontossági sorrendjét.
 * Az első érvényes attributum értékét fogja névvé konvertálni
 * @param {HTMLElement} element 
 * @param {array:string} attrs 
 * @returns {string}
 */

function nameByAttr(element, attrs = ['data-domname', 'id', 'class']){
    let nameAttrVal;

    for (const attr of attrs){
        if (element.hasAttribute(attr)){
            nameAttrVal = element.getAttribute(attr);
            break;
        }
    }

    return nameByAttrStr(nameAttrVal || '');
}

/**
 * Rekurzívan bejár egy HTML DOM Elementet, és amelyik elmenél be van állítva "data-eval" és/vagy a "data-domname"
 * lekérdezi az element DOM fájából, (beleértve az "element" paramétert is) és a "data-domname" vagy az "id" vagy a "class"
 * attríbutumokból javascript nevet készít, és visszatér a HTML elemek domName: HTMLElement referinciák objectével.
 * 
 * @param {HTMLElement} element 
 * @param {object} ret returnobject
 * @returns {object} HTMLElements
 */

const elementsByNames = (element, ret = {}) => {
    
    if ( element.dataset.eval && element.dataset.eval == 'dom' || element.dataset.domname ){
        ret[nameByAttr(element)] = element;
        delete element.dataset.eval;
        delete element.dataset.domname;
    }

    if (element.children.length > 0)        
        for (const el of element.children)
            elementsByNames(el, ret);

    return ret;
}

/**
 * Kiértékel egy HTML templétet, és visszaadja a DOM struktúrát egy vag több HTML elementben
 * @param {string} tpl 
 * @returns {HTMLElement|HTMLCollection}
 */

const evalTemplate = (tpl) => {
    const div = document.createElement('div');
    div.innerHTML = tpl;

    return div.children;
}
/**
 * 
 * @param {string} tpl Egy HTML template string
 * @returns {object} HTMLElements
 */

const elementsFromTempalte = (tpl) => {
    const htmlElements = evalTemplate(tpl)[0];

    return elementsByNames(htmlElements);
}

/**
 * 
 * @param {string} template HTML template
 * @param {object} object - Ehhez az objecthez adja hozzá a névvel ellátott dom elementeket.
 * @returns {object} azzal az "object"-el tér vissza, amit paraméterként kapott, csak itt már hozzá vannak adva,
 * a használnni kívánt dom elemntek
 */

const templateToObject = (template, object) => {
    return Object.assign(object, elementsFromTempalte(template));
}

export {elementsFromTempalte, evalTemplate, templateToObject}