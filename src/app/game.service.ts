import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireObject, AngularFireList, SnapshotAction} from 'angularfire2/database';
import 'rxjs/add/operator/take';

@Injectable()
export class GameService {

  private _currentGame: AngularFireObject<any>;
  private _gameSettings: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
    this._currentGame = db.object(`currentGame`);
    this._gameSettings = db.list(`gameSettings`);
  }

  static createGameFromSetting(setting: SnapshotAction) {
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
    refRoot.set(
      {
        gameSettings: {
          game001: {
            name: '-審判の日- 個人用核シェルター争奪戦 予選',
            during: '60000',
            targets: {
              tsukamotota01: {name: 'tsukamotota01', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              tsukamotota02: {name: 'tsukamotota02', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              tsukamotota03: {name: 'tsukamotota03', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'}
            }
          },
          game002: {
            name: '-審判の日- 個人用核シェルター争奪戦 前哨戦',
            during: '60000',
            targets: {
              tsukamotota01: {name: 'tsukamotota01', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              tsukamotota02: {name: 'tsukamotota02', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              tsukamotota03: {name: 'tsukamotota03', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              tsukamotota04: {name: 'tsukamotota02', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              tsukamotota05: {name: 'tsukamotota03', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              tsukamotota06: {name: 'tsukamotota02', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              tsukamotota07: {name: 'tsukamotota03', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'}
            }
          },
          game003: {
            name: '-審判の日- 個人用核シェルター争奪戦',
            during: '60000',
            targets: {
              tsukamotota01: {name: 'tsukamotota01', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              tsukamotota02: {name: 'tsukamotota02', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              tsukamotota03: {name: 'tsukamotota03', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'},
              tsukamotota04: {name: 'tsukamotota02', plus: 0, minus: 0, picUrl: 'http://placehold.jp/80x80.png'}
            }
          }
        },
        gameHistories: {},
        currentGame: {},
        commits: {
          game001: [
            {target: 'tsukamotota01', plus: 10, minus: 10},
            {target: 'tsukamotota01', plus: 10, minus: 10},
            {target: 'tsukamotota01', plus: 10, minus: 10},
            {target: 'tsukamotota01', plus: 10, minus: 10},
            {target: 'tsukamotota01', plus: 10, minus: 10},
            {target: 'tsukamotota01', plus: 10, minus: 10},
            {target: 'tsukamotota01', plus: 10, minus: 10},
            {target: 'tsukamotota01', plus: 10, minus: 10},
            {target: 'tsukamotota01', plus: 10, minus: 10},
            {target: 'tsukamotota01', plus: 10, minus: 10},
            {target: 'tsukamotota02', plus: 10, minus: 10},
            {target: 'tsukamotota02', plus: 10, minus: 10},
            {target: 'tsukamotota02', plus: 10, minus: 10},
            {target: 'tsukamotota02', plus: 10, minus: 10},
            {target: 'tsukamotota02', plus: 10, minus: 10},
            {target: 'tsukamotota02', plus: 10, minus: 10},
            {target: 'tsukamotota02', plus: 10, minus: 10},
            {target: 'tsukamotota02', plus: 10, minus: 10},
            {target: 'tsukamotota02', plus: 10, minus: 10},
            {target: 'tsukamotota02', plus: 10, minus: 10},
            {target: 'tsukamotota03', plus: 10, minus: 10},
            {target: 'tsukamotota03', plus: 10, minus: 10},
            {target: 'tsukamotota03', plus: 10, minus: 10},
            {target: 'tsukamotota03', plus: 10, minus: 10},
            {target: 'tsukamotota03', plus: 10, minus: 10},
            {target: 'tsukamotota03', plus: 10, minus: 10},
            {target: 'tsukamotota03', plus: 10, minus: 10},
            {target: 'tsukamotota03', plus: 10, minus: 10},
            {target: 'tsukamotota03', plus: 10, minus: 10},
            {target: 'tsukamotota03', plus: 10, minus: 10}
          ]
        }
      }
    );
  }

  get gameSettings(): AngularFireList<any> {
    return this._gameSettings;
  }

  get currentGame(): AngularFireObject<any> {
    return this._currentGame;
  }

}
