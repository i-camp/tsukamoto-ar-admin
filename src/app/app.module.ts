import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { AppComponent } from './app.component';
import { GameLauncherComponent } from './game-launcher/game-launcher.component';
import { GamesComponent } from './games/games.component';
import { LiveGameMonitorComponent } from './live-game-monitor/live-game-monitor.component';
import { LiveTargetsComponent } from './live-targets/live-targets.component';
import { GameEditorComponent } from './game-editor/game-editor.component';
import { EditableTargetsComponent } from './editable-targets/editable-targets.component';
import { GameSelectorComponent } from './game-selector/game-selector.component';
import { GaugePipe } from './gauge.pipe';
import { ScorePipe } from './score.pipe';

const appRoutes: Routes = [
  {path: 'new-game', component: EditableTargetsComponent},
  {path: 'games/:id', component: LiveGameMonitorComponent},
  {path: '**', redirectTo: '/games/0'}
];

@NgModule({
  declarations: [
    AppComponent,
    GameLauncherComponent,
    GamesComponent,
    LiveGameMonitorComponent,
    LiveTargetsComponent,
    GameEditorComponent,
    EditableTargetsComponent,
    GameSelectorComponent,
    GaugePipe,
    ScorePipe
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ProgressbarModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
