import { Component, OnInit } from '@angular/core';
import { GameService } from "../game.service";
import { ActivatedRoute } from "@angular/router";
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'ta-live-game-monitor',
  templateUrl: './live-game-monitor.component.html',
  animations: [
    trigger('helperEvent', [
      state('in', style({
        transform: 'translateX(calc(100vw - 1150px))'
      })),
      transition('void => in', [
        style({transform: 'translateX(100vw)'}),
        animate(800)
      ]),
      transition('in => void', [
        animate('200ms 1000ms', style({transform: 'translateX(-100vw)'}))
      ]),
    ])
  ]
})
export class LiveGameMonitorComponent implements OnInit {

  private helperEffectState: 'in';

  constructor(private route: ActivatedRoute,
              private gameService: GameService) {
  }

  ngOnInit() {
    // set current game
    this.route.params.subscribe(params => {
      this.gameService.replaceCurrentGame(params['id']);
    });

    // エフェクト設定
    this.gameService.helperEventEmitter
      .subscribe(worstTarget => {
        this.helperEffectState = 'in';
      });
  }

}
