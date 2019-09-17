import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var M:any;

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    var instance = M.Tabs.init(document.getElementsByClassName("tabs")[0], {
      swipeable: true
    });
    if(window.innerWidth < 1100) {
      this.router.navigate(['mobile']);
    }
  }

}
