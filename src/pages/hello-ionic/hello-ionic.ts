import { Component } from '@angular/core';
import { Observable} from 'rxjs'
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform, NavController } from 'ionic-angular';
import * as moment from 'moment';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { BaseEntity } from '../../base/base-entity';
import { BaseFireService } from '../../base/BaseFireService';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SettingsProvider } from '../../providers/settings/settings';


export interface Quote extends BaseEntity{
  text:string
}

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {

  items: any[];
  public settingsForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    private fireService :BaseFireService<Quote>,
    private localNotifications: LocalNotifications,
    public plt: Platform,
    private fb: FormBuilder,
    private settings:SettingsProvider
  ) {
    this.plt.ready().then(x => {
      this.getNots();
    })
    this.fireService.getRecords()
    .subscribe(
      x => this.items = x);
  }

  save(){
    this.settings.setSettings(this.settingsForm.value())
  }

  schedule() {
    //this.localNotifications.hasPermission().then(x => alert(x))
    if (!this.localNotifications.hasPermission())
      this.localNotifications.requestPermission();
    this.localNotifications.schedule({
      id: 1,
      text: 'Single ILocalNotification',
      // sound: this.plt.is('android')? 'file://sound.mp3':
      //  'file://beep.caf',
      data: { secret: "xcxcxc" }
    });
    let end = 19
    let start = moment()//.startOf('hour').fromNow();
    console.log(start.toDate())
    for (let i = 1; i < 12; i++) {
      let dt = moment(start).add(i, 'hour'); 
      let hr = dt.format("HH")
       if(parseInt(hr) >= end)
         break
      //console.log
      console.log( dt.toDate() , dt.format("HH"))
      this.localNotifications.schedule({
        id:i,
        text: 'Gurmat Tuk ' + this.items[i].text,
        //trigger: { every: 'minute', count: 15 },
        trigger: { at: dt.toDate() },
        led: 'FF0000',
        sound: this.plt.is('android')? 'file://sound.mp3':
         'file://beep.caf',
      });
    }

   

    //this.getNots();
  }

  nots: any

  getNots() {
    this.localNotifications.getAllScheduled()
      .then(x => {
        this.nots = x
        this.nots.map( n => 
          console.log(n)
        )
      })
    //return this.nots;
  }

 

  private createForm(): void {
    this.settingsForm = this.fb.group({
      start: ['9', []],
      end: ['7', []],
      freq: ['60', [Validators.required]],
      
    });
  }


}
