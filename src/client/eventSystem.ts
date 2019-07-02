export class EventSystem {
    constructor() {
        self.events = [];
    }

    getEvents(): Event[] {
        return self.events;
    }

    addEvent(e: Event): void {
        self.events.push(e);
    }

    removeEvent(e: Event): void {
        const i = self.events.indexOf(e);
        if (i > -1)
            self.events.splice(i, 1);
    }
}

export class Event {
    private function: Function;
    private rate: number

    constructor(f: Function, rate: number) {
        self.function = f;
        self.rate = rate;
    }

    getRate() {
        return self.rate;
    }

    getFunction() {
        return self.function;
    }
}
