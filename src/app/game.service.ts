import {Injectable, EventEmitter} from '@angular/core';
import {AngularFireDatabase, AngularFireObject, AngularFireList, SnapshotAction} from 'angularfire2/database';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/zip';
import {Observable} from "rxjs/Observable";

@Injectable() export class GameService {

  private _currentGame: AngularFireObject<any>;
  private _gameSettings: AngularFireList<any>;
  private static specialTargetId = 'watanabes';
  private _specialTarget: AngularFireObject<any>;
  private _helperEventEmitter = new EventEmitter<any>();

  constructor(private db: AngularFireDatabase) {
    this._currentGame = db.object(`currentGame`);
    this._gameSettings = db.list(`gameSettings`);
    this._specialTarget = db.object(`currentGame/targets/${GameService.specialTargetId}`);
    this.initGameEvent();
    // NOTE 開発中のみ(Productionで存在しても困ることは無い)
    this.initSchema();
  }

  private initGameEvent() {
    this._specialTarget.valueChanges()
      .filter((target: any) => target && target.plus && target.minus && target.plus + target.minus > 400)
      .filter((target: any) => target && target.score && target.score > 30000)
      .subscribe((target: any) => {
        Observable.zip(
          this.db.object('currentGame/targets').valueChanges(),
          this.db.object(`currentGame/targets/${GameService.specialTargetId}`).valueChanges(),
          this.db.object(`currentGame`).valueChanges()
        )
        .take(1)
        .subscribe((data: any) => {
          const targets =  data[0];
          const specialTarget =  data[1];
          const currentGame =  data[2];

          const worstTarget = Object.values(targets)
            .filter(spt => spt.name !== GameService.specialTargetId)
            .sort((a, b) => b.order - a.order)[0];

          const commitsRef = this.db.list(`commits/${currentGame.id}`);
          commitsRef.push({target: worstTarget.name, plus: 100000, minus: 100000})
          commitsRef.push({
            target: specialTarget.name,
            plus: specialTarget.plus * -1,
            minus: specialTarget.minus * -1
          });
          this._helperEventEmitter.emit(worstTarget);
        });
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

  // Schema作成
  initSchema() {
    this.db.object('/gameSettings/game001').set({
      name: '悪に染まったT-2020迎撃戦',
      during: '300000',
      targets: {
        fujimakis :{minus:0,name:'fujimakis',picUrl:'https://firebasestorage.googleapis.com/v0/b/e-party2017.appspot.com/o/fujimakis.jpg?alt=media&token=947fa431-bd20-420a-a1b5-f15a0befb8cd',plus:0},
        haram :{minus:0,name:'haram',picUrl:'https://firebasestorage.googleapis.com/v0/b/e-party2017.appspot.com/o/haram.jpg?alt=media&token=a05fcf05-7ec4-403a-95a5-4de6a91fcd1e',plus:0},
        matsudas :{minus:0,name:'matsudas',picUrl:'https://firebasestorage.googleapis.com/v0/b/e-party2017.appspot.com/o/matsudas.jpg?alt=media&token=3ee88df3-bb88-43d2-973a-8f797f5d7853',plus:0},
        nakanoa :{minus:0,name:'nakanoa',picUrl:'https://firebasestorage.googleapis.com/v0/b/e-party2017.appspot.com/o/nakanoa.jpg?alt=media&token=2679a29e-f546-48e1-ba69-e64be073098a',plus:0},
        okashitay :{minus:0,name:'okashitay',picUrl:'https://firebasestorage.googleapis.com/v0/b/e-party2017.appspot.com/o/okashity.jpg?alt=media&token=718bf294-47ff-4e18-ae99-08b54e68035f',plus:0},
        suzukik :{minus:0,name:'suzukik',picUrl:'https://firebasestorage.googleapis.com/v0/b/e-party2017.appspot.com/o/suzukik.jpg?alt=media&token=ed83c1e1-f196-49ca-96f7-d21c81246362',plus:0},
        teradaj :{minus:0,name:'teradaj',picUrl:'https://firebasestorage.googleapis.com/v0/b/e-party2017.appspot.com/o/teradaj.jpg?alt=media&token=620e919f-fb5b-408b-9075-6031878e5091',plus:0},
        watanaber :{minus:0,name:'watanaber',picUrl:'https://firebasestorage.googleapis.com/v0/b/e-party2017.appspot.com/o/watanaber.jpg?alt=media&token=981e860c-a14c-45c4-a15b-a0b1a107684e',plus:0},
        watanabes :{minus:0,name:'watanabes',picUrl:'https://firebasestorage.googleapis.com/v0/b/e-party2017.appspot.com/o/watanabes.jpg?alt=media&token=27ec172c-3981-405e-87df-cfa4559411cd',plus:0}
      }
    });
  }

  get gameSettings(): AngularFireList<any> {
    return this._gameSettings;
  }

  get currentGame(): AngularFireObject<any> {
    return this._currentGame;
  }

  get helperEventEmitter(): EventEmitter<any> {
    return this._helperEventEmitter;
  }

}
