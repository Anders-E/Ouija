export class EventSystem {
    constructor() {
      self.events = [];
    }

    getEvents() {
      return events;
    }

    addEvent(e) {
      self.events.push(e);
    }

    removeEvent(e) {
      // self.events.remove(e);
    }
}

export class Event {
  constructor(f, rate) {
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
