import Processor from './processor';
import Memory from './memory';

export default class Computer {
    
    Processor:Processor;
    Memory:Memory;

    constructor() {

        this.Memory = new Memory(/* 8 GB */);
        this.Processor = new Processor();
    }

}