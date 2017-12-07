import { Component, OnInit } from '@angular/core';
import {GameService} from "../game.service";
import {Observable} from "rxjs";

@Component({
  selector: 'ta-game-launcher',
  templateUrl: './game-launcher.component.html'
})
export class GameLauncherComponent implements OnInit {

  private game: Observable<any>;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.game = this.gameService.currentGame.valueChanges();
    // TODO トリガーDebugコード
    setTimeout(this.openGame.bind(this), 1000);
  }

  openGame() {
    this.gameService.openCurrentGame();
  }

  closeGame() {
    this.gameService.closeCurrentGame();
  }

}
