import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ta-editable-targets',
  templateUrl: './editable-targets.component.html'
})
export class EditableTargetsComponent implements OnInit {

  private targets: any;

  constructor() {
    this.targets = [{},{},{},{},{},{},{},{},{},{}]
  }

  ngOnInit() {
  }

}
