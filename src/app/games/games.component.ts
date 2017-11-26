import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ta-games',
  templateUrl: './games.component.html'
})
export class GamesComponent implements OnInit {

  private games: any[];

  constructor() {
    this.games = [{}, {}, {}, {}, {}];
  }

  ngOnInit() {
  }

}
