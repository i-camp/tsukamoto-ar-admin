import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ta-live-targets',
  templateUrl: './live-targets.component.html'
})
export class LiveTargetsComponent implements OnInit {

  private targets: any[]

  constructor() {
    this.targets = [{},{},{},{},{},{},{},{},{}]
  }

  ngOnInit() {
  }

}
