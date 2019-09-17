import { Subject } from 'rxjs';

export default class Memory {

    MemoryState: Subject<number[]>;

    private Slots:number[] = [];

    constructor() {
        this.MemoryState = new Subject<number[]>();
        for(var i = 0; i < 100; i++) {
            this.Slots.push(0);
        }
        this.MemoryState.next(this.Slots);
    }

    read(address:number) : number {
        return this.Slots[address];
    }

    write(address: number, value: number) {
        this.Slots[address] = value;
        this.MemoryState.next(this.Slots);
    }

    replace(slots:number[]) {
        this.Slots = slots;
        this.MemoryState.next(this.Slots);
    }

}