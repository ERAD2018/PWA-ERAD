import { Component } from '@angular/core';

import { ProgramacaoPage } from './../programacao/programacao';
import { LinksPage } from './../links/links';
import { FavoritosPage } from './../favoritos/favoritos';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProgramacaoPage;
  tab2Root = FavoritosPage;
  tab3Root = LinksPage;

  constructor() {

  }
}
