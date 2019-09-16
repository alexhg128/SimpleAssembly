import { Component, OnInit } from '@angular/core';
declare var M:any;

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var instance = M.Tabs.init(document.getElementsByClassName("tabs")[0], {
      swipeable: true
    });
  }

}
