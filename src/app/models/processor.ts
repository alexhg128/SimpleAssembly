import { Subject } from 'rxjs';
import Registers from './registers';
import Memory from './memory';
import IOModule from './iomodule';

export default class Processor {

    ProcessorState:Subject<Registers>;
    ProcessorStack:Subject<Registers[]>;
    Status:Subject<ProcessorStatus>;
    
    Registers:Registers;
    RegistersStack:Registers[] = [];
    Memory:Memory;
    Enabled:boolean;
    Locked:boolean;

    constructor(bus:Memory) {
        this.ProcessorState = new Subject<Registers>();
        this.ProcessorStack = new Subject<Registers[]>();
        this.Status = new Subject<ProcessorStatus>();
        this.Registers = new Registers();
        this.Memory = bus;
        this.Enabled = true;
        this.Locked = false;
    }

    reset() {
        this.ProcessorState = new Subject<Registers>();
        this.Status = new Subject<ProcessorStatus>();
        this.Registers.ProgramCounter = 0;
        this.Registers.Accumulator = 0;
        this.Registers.InstructionRegister = 0;
        this.Registers.ProgramStatusWord.PositiveFlag = true;
        this.Registers.ProgramStatusWord.ZeroFlag = true;
        this.Registers.ProgramStatusWord.InterruptFlag = false;
        this.Enabled = true;
        this.ProcessorState.next(this.Registers);
    }

    interrupt() {
        this.Registers.ProgramStatusWord.InterruptFlag = true;
    }

    run() {
        this.Status.next(ProcessorStatus.FETCHING);
        this.Registers.InstructionRegister = this.fetch();
        if(this.Registers.ProgramStatusWord.InterruptFlag) {
            // Handle Interrupts
            IOModule.Instance.requestInterrupt();
            var backup = new Registers();
            backup.Accumulator = this.Registers.Accumulator;
            backup.InstructionRegister = this.Registers.Accumulator;
            backup.ProgramCounter = this.Registers.Accumulator;
            backup.ProgramStatusWord = this.Registers.ProgramStatusWord;
            backup.ProgramStatusWord.InterruptFlag = false;
            this.RegistersStack.push(backup);
            this.Registers = new Registers();
            IOModule.Instance.requestInterrupt();
            this.Locked = true;
            this.ProcessorState.next(this.Registers);
            this.Status.next(ProcessorStatus.WAITING);
            return;
        }
        this.execute();
    }

    fetch() : number {
        return this.Memory.read(this.Registers.ProgramCounter);
    }

    private evaluateFlags() {
        if(this.Registers.Accumulator == 0) {
            this.Registers.ProgramStatusWord.ZeroFlag = true;
        }
        else {
            this.Registers.ProgramStatusWord.ZeroFlag = true;
        }

        if(this.Registers.Accumulator >= 0) {
            this.Registers.ProgramStatusWord.PositiveFlag = true;
        }
        else {
            this.Registers.ProgramStatusWord.PositiveFlag = true;
        }
        this.Registers.ProgramStatusWord.InterruptFlag = false;
    }

    execute() {
        var instruction = this.Registers.InstructionRegister;
        this.Status.next(ProcessorStatus.EXECUTING);
        switch(instruction) {
            case 901:
                // INPUT
                IOModule.Instance.requestInput();
                this.Locked = true;
                this.Status.next(ProcessorStatus.WAITING);
                break;
            case 902:
                // OUTPUT
                IOModule.Instance.output(this.Registers.Accumulator);
                this.Status.next(ProcessorStatus.IDLE);
                break;
            case 999:
                // INTERRUPT HANDLER EXIT
                var backup = this.RegistersStack.shift();
                this.Registers = backup;
                this.Status.next(ProcessorStatus.IDLE);
                break;
            case 0:
                this.Status.next(ProcessorStatus.HALT);
                this.Enabled = false;
                break;
            default:
                if(instruction >= 100 && instruction < 200) {
                    // ADD
                    var temp = this.Memory.read(instruction - 100);
                    this.Registers.Accumulator += temp;
                }
                else if(instruction >= 200 && instruction < 300) {
                    // SUB
                    var temp = this.Memory.read(instruction - 200);
                    this.Registers.Accumulator -= temp;
                }
                else if(instruction >= 300 && instruction < 400) {
                    // STO
                    this.Memory.write(instruction - 300, this.Registers.Accumulator);
                }
                else if(instruction >= 400 && instruction < 500) {
                    // STA
                    var temp = this.Registers.Accumulator % 100;
                    var temp2 = this.Memory.read(instruction - 400);
                    temp2 -= (temp2 % 100);
                    temp2 += temp;
                    this.Memory.write(instruction - 400, temp2);
                }
                else if(instruction >= 500 && instruction < 600) {
                    // LOAD
                    this.Registers.Accumulator = this.Memory.read(instruction - 500);
                }
                else if(instruction >= 600 && instruction < 700) {
                    // B
                    var temp = instruction - 600;
                    this.Registers.ProgramCounter = temp;
                }
                else if(instruction >= 700 && instruction < 800) {
                    // BZ
                    if(this.Registers.ProgramStatusWord.ZeroFlag) {
                        var temp = instruction - 700;
                        this.Registers.ProgramCounter = temp;
                    }
                }
                else if(instruction >= 800 && instruction < 800) {
                    // BP
                    if(this.Registers.ProgramStatusWord.ZeroFlag) {
                        var temp = instruction - 700;
                        this.Registers.ProgramCounter = temp;
                    }
                }
                this.Status.next(ProcessorStatus.IDLE);
                break;
        }

        this.Registers.ProgramCounter++;
        this.evaluateFlags();
        this.ProcessorState.next(this.Registers);
        this.ProcessorStack.next(this.RegistersStack);
    }

}

export enum ProcessorStatus {
    IDLE, FETCHING, EXECUTING, WAITING, HALT
}