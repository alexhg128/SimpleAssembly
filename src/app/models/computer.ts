import Processor from './processor';
import Memory from './memory';

export default class Computer {

    static instance:Computer;
    
    Processor:Processor;
    Memory:Memory;

    private constructor() {

        this.Memory = new Memory(/* 32 GB */);
        this.Processor = new Processor(this.Memory);
    }

    static get Instance() : Computer {
        if(!this.instance) {
            this.instance = new Computer();
        }
        return this.instance;
    }

    last_is_step:boolean;

    continue() {
        if(!this.last_is_step) {
            this.run();
        }
    }

    step() {
        this.last_is_step = true;
        this.Processor.run();
    }

    run() {
        this.last_is_step = false;
        while(this.Processor.Enabled && !this.Processor.Locked) {
            this.Processor.run();
        }
    }

}