import { Component, OnInit } from '@angular/core';
import Computer from '../models/computer';
import Registers from '../models/registers';
import { ProcessorStatus } from '../models/processor';
import IOModule from '../models/iomodule';
import { Data } from '@angular/router';

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
  stat: ProcessorStatus;
  mailboxes: Mailbox[] = [];
  ac:number = 1;

  constructor() {

    for(var i = 0; i < 100; i++) {
      var m = new Mailbox();
      m.id = i;
      m.content = 0;
      this.mailboxes.push(m);
    }

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

    });

    IOModule.Instance.OutStream.subscribe((data:number) => {

    });

    IOModule.Instance.InterruptStream.subscribe((data:boolean) => {

    });
   }

  ngOnInit() {
  }

}
