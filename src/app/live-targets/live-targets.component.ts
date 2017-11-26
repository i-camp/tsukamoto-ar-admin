import {Component, OnInit} from '@angular/core';
import {GameService} from "../game.service";
import {Observable} from "rxjs";

@Component({
  selector: 'ta-live-targets',
  templateUrl: './live-targets.component.html'
})
export class LiveTargetsComponent implements OnInit {

  private targets: Observable<any[]>;
  private game: Observable<any[]>;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.game= this.gameService.currentGame.valueChanges();
    this.targets = this.game.map((game: any) => game ? game.targets : null);
  }

}
