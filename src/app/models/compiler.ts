import Executable from './executable';

export default class Compiler {

    static instance: Compiler;

    private constructor() {

    }

    static get Instance() : Compiler {
        if(!this.instance) {
            this.instance = new Compiler();
        }
        return this.instance;
    }

    code: number[] = [];
    interrupt: number[] = [];

    Spawn() {
        this.code = [];
        this.codeIndex = 0;
        this.interrupt = [];
        for(var i = 0; i < 100; i++) {
            this.code.push(0);
        }
    }

    ProcessData(line:string) : boolean {
        var components = line.split(" ");
        if(components.length == 2) {
            var n1 = Number(components[0]);
            var n2 = Number(components[1]);
            if(n1 != NaN && n2 != NaN && n1 % 1 == 0 && n2 % 1 == 0) {
                this.code[n1] = n2;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
        return false;
    }

    ProcessInterrupt(line:string) : boolean {
        
        var components = line.split(" ");
        if(components.length == 1) {
            var n1 = Number(components[0]);
            if(n1 != NaN && n1 % 1 == 0) {
                this.interrupt.push(n1);
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    codeIndex: number = 0;

    ProcessCode(line:string) : boolean {
        console.log(line);
        var components = line.split(" ");
        if(components.length == 1) {
            if(components[0].toLowerCase() == "in") {
                this.code[this.codeIndex] = 901;
                this.codeIndex++;
                return true;
            }
            else if(components[0].toLowerCase() == "out") {
                this.code[this.codeIndex] = 902;
                this.codeIndex++;
                return true;
            }
            else if(components[0].toLowerCase() == "exit") {
                this.code[this.codeIndex] = 0;
                this.codeIndex++;
                return true;
            }
            else if(components[0].toLowerCase() == "halt") {
                this.code[this.codeIndex] = 0;
                this.codeIndex++;
                return true;
            }
            else if(components[0].toLowerCase() == "inex") {
                this.code[this.codeIndex] = 999;
                this.codeIndex++;
                return true;
            }
            return false;
        }
        else if (components.length == 2) {
            var n = Number(components[1]);
            if(n / 100 >= 1) {
                return false;
            }
            if(n != NaN && n % 1 == 0) {
                if(components[0].toLowerCase() == "add") {
                    this.code[this.codeIndex] = n + 100;
                    this.codeIndex++;
                    return true;
                }
                else if(components[0].toLowerCase() == "sub") {
                    this.code[this.codeIndex] = n + 200;
                    this.codeIndex++;
                    return true;
                }
                else if(components[0].toLowerCase() == "sto") {
                    this.code[this.codeIndex] = n + 300;
                    this.codeIndex++;
                    return true;
                }
                else if(components[0].toLowerCase() == "sta") {
                    this.code[this.codeIndex] = n + 400;
                    this.codeIndex++;
                    return true;
                }
                else if(components[0].toLowerCase() == "load") {
                    this.code[this.codeIndex] = n + 500;
                    this.codeIndex++;
                    return true;
                }
                else if(components[0].toLowerCase() == "b") {
                    this.code[this.codeIndex] = n + 600;
                    this.codeIndex++;
                    return true;
                }
                else if(components[0].toLowerCase() == "bz") {
                    this.code[this.codeIndex] = n + 700;
                    this.codeIndex++;
                    return true;
                }
                else if(components[0].toLowerCase() == "bp") {
                    this.code[this.codeIndex] = n + 800;
                    this.codeIndex++;
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    }

    Compile(code:string) : Executable {
        console.log("here");
        this.Spawn();
        var lines = code.split("\n");
        var mode = Mode.NULL;
        for(var i = 0; i < lines.length; i++) {
            if(lines[i] == "") {
                continue;
            }
            if(lines[i].toLowerCase().trim() == "data:") {
                mode = Mode.DATA;
            }
            else if(lines[i].toLowerCase().trim() == "interrupts:") {
                mode = Mode.INTERRUPT;
            }
            else if(lines[i].toLowerCase().trim() == "code:") {
                mode = Mode.CODE;
            }
            else if(mode == Mode.DATA) {
                if(!this.ProcessData(lines[i])) {
                    var exe = new Executable();
                    exe.error = true;
                    return exe;
                }
            }
            else if(mode == Mode.INTERRUPT) {
                if(!this.ProcessInterrupt(lines[i])) {
                    var exe = new Executable();
                    exe.error = true;
                    return exe;
                }
            }
            else if(mode == Mode.CODE) {
                if(!this.ProcessCode(lines[i])) {
                    var exe = new Executable();
                    exe.error = true;
                    return exe;
                }
            }
            else {
                var exe = new Executable();
                exe.error = true;
                return exe;
            }
        }

        var exe = new Executable();
        exe.error = false;
        exe.code = this.code;
        exe.interrupts = this.interrupt;
        return exe;
    }

}

enum Mode {
    NULL, DATA, INTERRUPT, CODE
}