import ProgramStatusWord from './psw';

export default class Registers {

    ProgramCounter:number;
    Accumulator:number;
    InstructionRegister:number;
    ProgramStatusWord:ProgramStatusWord;

    constructor() {
        this.ProgramCounter = 0;
        this.Accumulator = 0;
        this.InstructionRegister = 0;
        this.ProgramStatusWord = new ProgramStatusWord();
    }

}