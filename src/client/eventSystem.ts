export class EventSystem {
    private events: Event[];

    public constructor() {
        this.events = [];
    }

    public getEvents(): Event[] {
        return this.events;
    }

    public addEvent(e: Event): void {
        this.events.push(e);
    }

    public removeEvent(e: Event): void {
        const i = this.events.indexOf(e);
        if (i > -1) this.events.splice(i, 1);
    }
}

export class Event {
    private function: Function;
    private rate: number;

    public constructor(f: Function, rate: number) {
        this.function = f;
        this.rate = rate;
    }

    public getRate(): number {
        return this.rate;
    }

    public getFunction(): Function {
        return this.function;
    }
}
