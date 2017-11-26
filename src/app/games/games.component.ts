import {Component, OnInit} from '@angular/core';
import {GameService} from "../game.service";
import {Observable} from "rxjs";

@Component({
  selector: 'ta-games',
  templateUrl: './games.component.html'
})
export class GamesComponent implements OnInit {

  private gameSettings: Observable<any[]>;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.gameSettings = this.gameService.gameSettings
      .snapshotChanges()
      .map(actions =>
        actions.map(action => ( {key: action.payload.key, ...action.payload.val()}))
      );
  }

}
