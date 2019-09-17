import { Subject } from 'rxjs';
import Computer from './computer';

export default class IOModule {

    private static instace: IOModule;

    OutStream: Subject<number>;
    InStream: Subject<boolean>;
    InterruptStream: Subject<boolean>;

    private constructor() {
        this.OutStream = new Subject<number>();
        this.InStream = new Subject<boolean>();
        this.InterruptStream = new Subject<boolean>();
    }

    static get Instance() : IOModule {
        if(!this.instace) {
            this.instace = new IOModule();
        }
        return this.instace;
    }

    output(val:number) {
        this.OutStream
    }

    requestInput() {
        this.InStream.next(true);
    }

    requestInterrupt() {
        this.InterruptStream.next(true);
    }

    input(val:number) {
        Computer.Instance.Processor.Registers.Accumulator = val;
        Computer.Instance.Processor.Locked = false;
        //Computer.Instance.continue();
    }

    interrupt(val:number) {
        Computer.Instance.Processor.Registers.Accumulator = val;
        Computer.Instance.Processor.Locked = false;
        //Computer.Instance.continue();
    }

}