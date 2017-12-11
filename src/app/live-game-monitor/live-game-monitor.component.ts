import { Component, OnInit } from '@angular/core';
import { GameService } from "../game.service";
import { ActivatedRoute } from "@angular/router";
import {trigger, state, style, transition, animate, keyframes} from '@angular/animations';

@Component({
  selector: 'ta-live-game-monitor',
  templateUrl: './live-game-monitor.component.html',
  animations: [
    trigger('helperCutin', [
      state('in', style({
        transform: 'translateX(-200vw)'
      })),
      transition('void => in', [
        animate(10000, keyframes([
          style({transform: 'translateX(100vw)', offset: 0}),
          style({transform: 'translateX(calc(100vw - 1150px))', offset: 0.05}),
          style({transform: 'translateX(calc(100vw - 1250px))', offset: 0.95}),
          style({transform: 'translateX(-200vw)', offset: 1})
        ]))
      ])
    ]),
    trigger('helperCaption', [
      state('in', style({
        transform: 'scale(0)'
      })),
      transition('void => in', [
        animate(10000, keyframes([
          style({transform: 'scale(0)', offset: 0}),
          style({transform: 'scale(1)', offset: 0.05}),
          style({transform: 'scale(1)', offset: 0.95}),
          style({transform: 'scale(0)', offset: 1})
        ]))
      ])
    ])
  ]
})
export class LiveGameMonitorComponent implements OnInit {

  private helperEffectState: 'in';
  private helpedTarget: any;

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
        this.helpedTarget = worstTarget;
        window.scrollTo(0, 0);
        new Audio('/assets/nc135367.mp3').play();
      });
  }

}
