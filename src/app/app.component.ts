import {Component, OnInit, Injectable} from '@angular/core';
import {GameService} from "./game.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [GameService]
})
export class AppComponent implements OnInit {
  title = 'app';
}
