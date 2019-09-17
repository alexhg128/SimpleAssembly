import { Component, OnInit } from '@angular/core';
import Computer from '../models/computer';
import Registers from '../models/registers';
import { ProcessorStatus } from '../models/processor';
import IOModule from '../models/iomodule';
import { Data } from '@angular/router';
import Compiler from '../models/compiler';
import CodeLoader from '../models/codeloader';
import BootLoader from '../models/bootloader';

declare var M:any;

class Mailbox {
  id:number;
  content:number;
}

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  reg: Registers;
  regstack: Registers[]; 
  stat: ProcessorStatus = ProcessorStatus.IDLE;
  mailboxes: Mailbox[] = [];
  ac:number = 1;
  input:number = 0;
  output:string = "";
  int:number = 0;

  constructor() {

    for(var i = 0; i < 100; i++) {
      var m = new Mailbox();
      m.id = i;
      m.content = 0;
      this.mailboxes.push(m);
    }

    this.reg = Computer.Instance.Processor.Registers;
    this.regstack = Computer.Instance.Processor.RegistersStack;

    Computer.Instance.Memory.MemoryState.subscribe((data:number[]) => {
      for(var i = 0; i < data.length; i++) {
        this.mailboxes[i].content = data[i];
      }
    });

    Computer.Instance.Processor.ProcessorState.subscribe((data:Registers) => {
      this.reg = data;
    });

    Computer.Instance.Processor.ProcessorStack.subscribe((data:Registers[]) => {
      this.regstack = data;
    });
    
    Computer.Instance.Processor.Status.subscribe((data:ProcessorStatus) => {
      this.stat = data;
    });

    IOModule.Instance.InStream.subscribe((data:boolean) => {
      var instance = M.Modal.getInstance(document.getElementById("input"));
      instance.open();
    });

    IOModule.Instance.OutStream.subscribe((data:number) => {
      this.output += data + "\n";
      var instance = M.Modal.getInstance(document.getElementById("output"));
      instance.open();
    });

    IOModule.Instance.InterruptStream.subscribe((data:boolean) => {
      var instance = M.Modal.getInstance(document.getElementById("interrupt"));
      instance.open();
    });
   }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {});
  }

  mailboxChange(id: number) {
    var x = [] as number[];
    for(var i = 0; i < 100; i++) {
      x.push(this.mailboxes[i].content);
    }
    Computer.Instance.Memory.replace(x);
  }

  getStatusText(s: ProcessorStatus) {
    switch(s) {
      case ProcessorStatus.IDLE:
        return "IDLE";
        break;
      case ProcessorStatus.EXECUTING:
        return "EXECUTING";
        break;
      case ProcessorStatus.FETCHING:
        return "FETCHING";
        break;
      case ProcessorStatus.WAITING:
        return "WAITING";
    }
  }

  interrupt() {
    Computer.Instance.Processor.interrupt();
  }

  run() {
    Computer.Instance.run();
  }

  step() {
    Computer.Instance.step();
  }

  load() {
    var exe = Compiler.Instance.Compile(CodeLoader.Instance.code);
    console.log("Loading");
    if(exe.error) {
      var instance = M.Modal.getInstance(document.getElementById("error"));
      instance.open();
    }
    BootLoader.Instance.Load(exe);
  }

  reset() {
    Computer.Instance.Processor.reset();
    this.output = "";
  }

  sendInput() {
    IOModule.Instance.input(this.input);
  }

  sendInterrupt() {
    IOModule.Instance.interrupt(this.int);

  }

}
