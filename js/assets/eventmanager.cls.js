class EventManager{
    #events;
    
    constructor (events = {}){
        this.#events = {};
        if (events instanceof Object)
            for (const eventName in events)
                if (typeof events[eventName] == 'function')
                    this.on(eventName, events[eventName]);

    }

    on(event, fn){
        if (this.#events[event] == undefined)
            this.#events[event] = [];

            this.#events[event].push(fn);
    }

    un(event, ref){
        if (this.#events[event] != undefined){
            let ind = this.#events[event].indexOf(ref);
            if (ind > -1)
                this.#events[event].splice(ind, 1);
        }
    }

    trigger(event){
        if (this.#events[event] != undefined)
            for (const eventFn of this.#events[event])
                eventFn.call(this);
    }
    
}

export { EventManager };