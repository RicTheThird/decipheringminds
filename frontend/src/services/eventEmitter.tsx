// eventEmitter.ts
type Listener<T> = (data: T) => void;

class EventEmitter {
    private events: { [key: string]: Listener<any>[] } = {};

    on<T>(event: string, listener: Listener<T>): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    off<T>(event: string, listener: Listener<T>): void {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(l => l !== listener);
    }

    emit<T>(event: string, data: T): void {
        if (!this.events[event]) return;
        this.events[event].forEach(listener => listener(data));
    }
}

const eventEmitter = new EventEmitter();
export default eventEmitter;
