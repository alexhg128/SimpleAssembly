import { Component, OnInit, ViewChild } from '@angular/core';
import 'brace';
import 'brace/mode/assembly_x86';
import 'brace/theme/github';

import { AceComponent, AceDirective, AceConfigInterface } from 'ngx-ace-wrapper';
import CodeLoader from '../models/codeloader';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  value:string;

  @ViewChild(AceComponent, { static: false }) componentRef?: AceComponent;

  constructor() { }

  ngOnInit() {
  }

  public onValueChange(value: string): void {
    CodeLoader.Instance.write(value);
  }

}
