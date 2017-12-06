import {Component, OnInit} from '@angular/core';
import {GameService} from "../game.service";
import {Observable} from "rxjs";

@Component({
  selector: 'ta-live-targets',
  templateUrl: './live-targets.component.html'
})
export class LiveTargetsComponent implements OnInit {

  targets: Observable<any[]>;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.targets = this.gameService.currentGame
      .valueChanges()
      .map((game: any) => game ? game.targets : null);
  }

}
