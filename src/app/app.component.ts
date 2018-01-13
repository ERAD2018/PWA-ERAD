import { Component } from '@angular/core';
import { Platform, App, IonicApp } from 'ionic-angular';
//import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(public platform: Platform, private app: App, private ionicApp: IonicApp) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      window.onpopstate = (evt) => {
        let activePortal = this.ionicApp._loadingPortal.getActive() ||
          this.ionicApp._modalPortal.getActive() ||
          this.ionicApp._toastPortal.getActive() ||
          this.ionicApp._overlayPortal.getActive();

        if (activePortal) {
          activePortal.dismiss();
          return;
        }

        if (this.app.getActiveNavs()[this.app.getActiveNavs().length-1].canGoBack()){
          this.app.getActiveNavs()[this.app.getActiveNavs().length-1].pop();
        }else{
          window.history.back();
        }
      };

      this.app.viewDidEnter.subscribe((app) => {
        history.pushState (null, null, "");
      });
    });
  }
}
