import Executable from './executable';
import Computer from './computer';

export default class BootLoader {

    private static instance: BootLoader;

    private constructor() {

    }

    static get Instance() : BootLoader {
        if(!this.instance) {
            this.instance = new BootLoader();
        }
        return this.instance;
    }

    Load(exe: Executable) {
        if(!exe.error) {
            Computer.Instance.Memory.replace(exe.code);
            Computer.Instance.Interrupts = exe.interrupts;
        }
    }

}