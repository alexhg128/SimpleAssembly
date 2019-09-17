import { Component, OnInit } from '@angular/core';
import Computer from '../models/computer';

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

   }

  ngOnInit() {
  }

}
