import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireObject, AngularFireList, SnapshotAction} from 'angularfire2/database';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class GameService {

  private _currentGame: AngularFireObject<any>;
  private _gameSettings: AngularFireList<any>;
  private static specialTargetId = 'watanabes';
  private _specialTarget: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {
    this._currentGame = db.object(`currentGame`);
    this._gameSettings = db.list(`gameSettings`);
    this._specialTarget = db.object(`currentGame/targets/${GameService.specialTargetId}`);
    this.initGameEvent();
  }

  private initGameEvent() {
    this._specialTarget.valueChanges()
      .filter((target: any) => target && target.score && target.score < 1000)
      .mergeMap((target: any) => this.db.list('currentGame/targets').snapshotChanges().take(1))
      // ↑ 要テスト対象
      .subscribe((targets: any[]) => {
        const worstTarget = targets
          .filter(target => target !== GameService.specialTargetId)
          .sort((a, b) => a.order - b.order)[0];
        this.db.list(`commits`).push({target: worstTarget.name, plus: 100000, minus: 100000});
        this._specialTarget.update({plus: 0, minus: 0, score: 0});
      });
  };

  private static createGameFromSetting(setting: SnapshotAction) {
    return ({id: setting.payload.key, ...setting.payload.val()});
  }

  openCurrentGame(): void {
    this._currentGame.update({openedAt: new Date()});
  }

  closeCurrentGame(): void {
    this._currentGame.update({closedAt: new Date()})
      .then(this.createHistoryFromCurrentGame.bind(this)); // XXX bindが必要なのちょっと納得いかない
  }

  replaceCurrentGame(id: string) {
    this.db.object(`gameHistories`)
      .snapshotChanges()
      .map(action => action.payload)
      .take(1)
      .subscribe(historiesSnapShot => {
        this.createGameFromSettingIfnotExistHistory.bind(this)(historiesSnapShot, id);
      });
  }

  private createGameFromSettingIfnotExistHistory(historiesSnapShot, id) {
    // create game form history
    const historySnapShot = historiesSnapShot.child(id);
    if (historySnapShot.exists()) {
      this._currentGame.set({id: historySnapShot.key, ...historySnapShot.val()});
      return;
    }

    // create game form setting
    this.db.object(`gameSettings/${id}`)
      .snapshotChanges()
      .map(GameService.createGameFromSetting)
      .take(1)
      .subscribe(gameVal => this._currentGame.set(gameVal));
  }

  private createHistoryFromCurrentGame() {
    this._currentGame.snapshotChanges()
      .take(1)
      .subscribe(action => {
        const game = action.payload.val();
        const history = this.db.object(`gameHistories/${game.id}`);
        delete game.id;
        history.set(game);
      });
  }

  // NOTE 開発用コード
  // Schema作成
  initSchema() {
    const refRoot = this.db.object('/');
    const dummyData = {
        gameSettings: {
          game001: {
            name: '悪に染まったT-800迎撃戦',
            during: '300000',
            targets: {
              haram: {name: 'haram', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              teradaj: {name: 'teradaj', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              fujimakis: {name: 'fujimakis', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              okashitay: {name: 'okashitay', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              suzukik: {name: 'suzukik', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              matsudas: {name: 'matsudas', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              watanaber: {name: 'watanaber', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              nakanoa: {name: 'nakanoa', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              watanabes: {name: 'watanabes', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'}
            }
          },
        },
        gameHistories: {},
        currentGame: {},
        commits: {
          game001: []
        }
      };
    // 負荷試験用
    for (let i = 0; i < 1000; i++) {
      dummyData.commits.game001 = dummyData.commits.game001.concat([
        {target: 'haram', plus: 15, minus: 10},
        {target: 'teradaj', plus: 20, minus: 30},
        {target: 'fujimakis', plus: 30, minus: 10},
        {target: 'okashitay', plus: 15, minus: 10},
        {target: 'suzukik', plus: 20, minus: 30},
        {target: 'matsudas', plus: 30, minus: 10},
        {target: 'nakanoa', plus: 15, minus: 10},
        {target: 'watanaber', plus: 20, minus: 30}
      ]);
    }
    refRoot.set(dummyData);
  }

  get gameSettings(): AngularFireList<any> {
    return this._gameSettings;
  }

  get currentGame(): AngularFireObject<any> {
    return this._currentGame;
  }

}
