import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { ProgramacaoPage } from './../pages/programacao/programacao';
import { DetalhePage } from './../pages/detalhe/detalhe';
import { ProgramacaoFilterPage } from '../pages/programacao-filter/programacao-filter';

import { SheetProvider } from '../providers/sheet/sheet';
import { HttpClientModule } from '@angular/common/http';

//import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    ProgramacaoPage,
    DetalhePage,
    ProgramacaoFilterPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    ProgramacaoPage,
    DetalhePage,
    ProgramacaoFilterPage
  ],
  providers: [
    //StatusBar,
    //SplashScreen,
    SheetProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
