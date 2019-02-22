import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { HelloIonicPage, Quote } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { LoginPage } from '../pages/login/login';
import { AngularFireDatabase } from '@angular/fire/database';
import { BaseFireService } from '../base/BaseFireService';
import { Storage } from '@ionic/storage';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import moment from 'moment';
import { QuoteCardsPage } from '../pages/quote-cards/quote-cards';


const DEFAULT_SETTINGS = {noOfNotifs: 5, frequency:60, startTime: moment({ hour:7, minute:0 }), endTime: moment({ hour:19, minute:0 })};
const ALL_DATA = 'allData';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = HelloIonicPage;
  pages: Array<{title: string, component: any}>;
  quotes: any[];

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private fireService: BaseFireService<Quote>,
    private storage: Storage,
    private localNotifications: LocalNotifications,
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Settings', component: HelloIonicPage },
      { title: 'Quotes', component: ListPage },
      { title: 'QuoteCards', component: QuoteCardsPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if(this.platform.is('android')){

        if (!this.localNotifications.hasPermission())
          this.localNotifications.requestPermission();
      
      this.localNotifications.getAll()
      .then(x => {
        console.log(x);
        console.log(x.length);
        console.log("Here we are supposed to do some shit");
        if(x && x.length) {
          console.log("We should be good, no need to do anything!");
        } else {
          let notifications = [];
          let n:number = 10; // arbitrary large number

          for (let i=0; i<n; i++){
            let morning = moment().set('hour', 10).set('minute', 0).set('second', 0);
            let noon =  moment().set('hour', 14).set('minute', 0).set('second', 0);
            let evening =  moment().set('hour', 18).set('minute', 0).set('second', 0);
            morning.add('day', i);
            noon.add('day', i);
            evening.add('day', i);
            notifications.push(
              {
                id: 1+(3*i),
                title: 'Health Advise',
                text: 'Eat your breakfast and do yoga.',
                trigger: {at: morning.toDate()},
                led: 'FFF000',
                sound: this.platform.is('android') ? 'file://assets/sounds/sound.mp3': 'file://assets/sounds/beep.caf',
                vibrate: true,
                icon: 'file://assets/imgs/icon.png',
              }
            );
            notifications.push(
              {
                id: 2+(3*i),
                title: 'Health Advise',
                text: 'Eat your lunch and have your medicines.',
                trigger: {at: noon.toDate()},
                led: 'FFF000',
                sound: this.platform.is('android') ? 'file://assets/sounds/sound.mp3': 'file://assets/sounds/beep.caf',
                vibrate: true,
                icon: 'file://assets/imgs/icon.png',
              }
            );
            notifications.push(
              {
                id: 3+(3*i),
                title: 'Health Advise',
                text: 'Time for daily meditation.',
                trigger: {at: evening.toDate()},
                led: 'FFF000',
                sound: this.platform.is('android') ? 'file://assets/sounds/sound.mp3': 'file://assets/sounds/beep.caf',
                vibrate: true,
                icon: 'file://assets/imgs/icon.png',
              }
            );
          }
          this.localNotifications.schedule(notifications);
        }
          // this.localNotifications.schedule(
          //   {
          //     id: 1,
          //     title: 'Health Advise',
          //     text: 'Eat your breakfast and do yoga.',
          //     trigger: { firstAt: new Date(), every: ELocalNotificationTriggerUnit.SECOND, count: 50},
          //     led: 'FFF000',
          //     sound: this.platform.is('android') ? 'file://assets/sounds/sound.mp3': 'file://assets/sounds/beep.caf',
          //     vibrate: true,
          //     icon: 'file://assets/imgs/icon.png',
          //   });
          //   this.localNotifications.schedule({
          //     id: 2,
          //     title: 'Health Advise',
          //     text: 'Eat your lunch and have your medicines.',
          //     trigger: { every: {minute: 4}, count: 50},
          //     led: 'FFF000',
          //     sound: this.platform.is('android') ? 'file://assets/sounds/sound.mp3': 'file://assets/sounds/beep.caf',
          //     vibrate: true,
          //     icon: 'file://assets/imgs/icon.png',
          //   });
          //   this.localNotifications.schedule({
          //     id: 3,
          //     title: 'Health Advise',
          //     text: 'Time for daily meditation.',
          //     trigger: { every: {minute: 5}, count: 50},
          //     led: 'FFF000',
          //     sound: this.platform.is('android') ? 'file://assets/sounds/sound.mp3': 'file://assets/sounds/beep.caf',
          //     vibrate: true,
          //     icon: 'file://assets/imgs/icon.png',
          //   });
        
      });
      this.localNotifications.on('click').subscribe(notif => {
        console.log(notif);
      })
    } else {
      console.log("We are on a browser!!");
    }
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
