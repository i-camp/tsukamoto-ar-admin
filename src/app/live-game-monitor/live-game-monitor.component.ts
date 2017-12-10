import { Component, OnInit } from '@angular/core';
import {GameService} from "../game.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'ta-live-game-monitor',
  templateUrl: './live-game-monitor.component.html'
})
export class LiveGameMonitorComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private gameService: GameService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gameService.replaceCurrentGame(params['id']);
    });
  }

}
