import { Component } from '@angular/core';

import { ProgramacaoPage } from './../programacao/programacao';
import { LinksPage } from './../links/links';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProgramacaoPage;
  tab2Root = LinksPage;

  constructor() {

  }
}
