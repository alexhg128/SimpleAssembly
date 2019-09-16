import { Component, OnInit } from '@angular/core';
import 'brace';
import 'brace/mode/assembly_x86';
import 'brace/theme/github';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  value:string;

  constructor() { }

  ngOnInit() {
  }

}
