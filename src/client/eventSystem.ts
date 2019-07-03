export class EventSystem {
    private events: Event[];
    
    constructor() {
        this.events = [];
    }

    getEvents(): Event[] {
        return this.events;
    }

    addEvent(e: Event): void {
        this.events.push(e);
    }

    removeEvent(e: Event): void {
        const i = this.events.indexOf(e);
        if (i > -1)
        this.events.splice(i, 1);
    }
}

export class Event {
    private function: Function;
    private rate: number

    constructor(f: Function, rate: number) {
        this.function = f;
        this.rate = rate;
    }

    getRate() {
        return this.rate;
    }

    getFunction() {
        return this.function;
    }
}
