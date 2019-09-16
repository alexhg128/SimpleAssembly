export default class ProgramStatusWord {

    PositiveFlag:boolean;
    ZeroFlag:boolean;
    InterruptFlag:boolean;

    constructor() {
        this.PositiveFlag = true;
        this.ZeroFlag = true;
        this.InterruptFlag = false;
    }

}