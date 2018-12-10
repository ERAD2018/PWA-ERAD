import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { NgForageModule } from "ngforage";

import { TabsPage } from '../pages/tabs/tabs';
import { ProgramacaoPage } from './../pages/programacao/programacao';
import { DetalhePage } from './../pages/detalhe/detalhe';
import { ProgramacaoFilterPage } from '../pages/programacao-filter/programacao-filter';
import { LinksPage } from '../pages/links/links';
import { FavoritosPage } from './../pages/favoritos/favoritos';

import { SheetProvider } from '../providers/sheet/sheet';
import { HttpClientModule } from '@angular/common/http';
import { UserDataProvider } from '../providers/user-data/user-data';

//import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    ProgramacaoPage,
    DetalhePage,
    ProgramacaoFilterPage,
    LinksPage,
    FavoritosPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgForageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    ProgramacaoPage,
    DetalhePage,
    ProgramacaoFilterPage,
    LinksPage,
    FavoritosPage
  ],
  providers: [
    //StatusBar,
    //SplashScreen,
    SheetProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserDataProvider
  ]
})
export class AppModule {}
