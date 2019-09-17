export default class CodeLoader {

    static instance: CodeLoader;

    private constructor() { }

    static get Instance(): CodeLoader {
        if(!this.instance) {
            this.instance = new CodeLoader();
        }
        return this.instance;
    }

    code:string;

    write(code:string) {
        this.code = code;
    }

    read() : string {
        return this.code;
    }

}