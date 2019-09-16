import { Subject } from 'rxjs';
import Registers from './registers';

export default class Processor {

    ProcessorState:Subject<Registers>;
    Status:Subject<ProcessorStatus>;
    
    registers:Registers;

    constructor() {
        this.registers = new Registers();
    }

    reset() {
        this.ProcessorState = new Subject<Registers>();
        this.Status = new Subject<ProcessorStatus>();
        this.registers.ProgramCounter = 0;
        this.registers.Accumulator = 0;
        this.registers.InstructionRegister = 0;
        this.registers.ProgramStatusWord.PositiveFlag = true;
        this.registers.ProgramStatusWord.ZeroFlag = true;
        this.registers.ProgramStatusWord.InterruptFlag = false;
        this.ProcessorState.next(this.registers);
    }

    interrupt() {
        this.registers.ProgramStatusWord.InterruptFlag = true;
    }

}

export enum ProcessorStatus {
    IDLE, FETCHING, EXECUTING, WAITING, HALT
}