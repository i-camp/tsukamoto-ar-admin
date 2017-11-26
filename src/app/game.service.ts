import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireObject, AngularFireList} from 'angularfire2/database';
import 'rxjs/add/operator/mergeMap';
@Injectable()
export class GameService {

  private _currentGame: AngularFireObject<any>;
  private _gameSettings: AngularFireList<any>;
  private gameHistories: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
    this._currentGame = db.object(`currentGame`);
    this._gameSettings = db.list(`gameSettings`);
    this.gameHistories = db.list(`gameHistories`);
  }

  openCurrentGame(): void {
    this._currentGame.update({openedAt: new Date()});
  }

  closeCurrentGame(): void {
    this._currentGame.update({closedAt: new Date()})
      .then(this.createHistoryFromCurrentGame.bind(this)); // XXX bindが必要なのちょっと納得いかない
  }

  replaceCurrentGame(id: string) {
      this.db.list('gameSettings', ref => ref.orderByKey().equalTo(id))
        .snapshotChanges()
        .map(actions => this.db.object(`/gameSettings/${actions[0].key}`))
        .mergeMap(gameRef => gameRef.snapshotChanges())
        .map(action => ({key: action.payload.key, ...action.payload.val()}))
        .map(GameService.createLiveGameFromSetting)// TODO 現状履歴の表示には未対応
        .subscribe(gameVal => this._currentGame.set(gameVal));
  }

  private createHistoryFromCurrentGame() {
    this._currentGame.snapshotChanges().subscribe(action => {
      const game = action.payload.val();
      const historyRef = this.db.object(`gameHistories/${game.id}`);
      delete game.id;
      historyRef.set(game);
    })
  };

  private static createLiveGameFromSetting(gameSetting: any) {
    const game = {
      id: gameSetting.key,
      name: gameSetting.name,
      targets: []
    };
    game.targets = gameSetting.targets.map(target => ({
      name: target.name,
      liveHp: target.initHp,
      picUrl: target.picUrl
    }));
    return game;
  }

  get gameSettings(): AngularFireList<any> {
    return this._gameSettings;
  }

  get currentGame(): AngularFireObject<any> {
    return this._currentGame;
  }

}
