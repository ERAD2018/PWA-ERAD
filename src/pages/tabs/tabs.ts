import { Component } from '@angular/core';

import { ProgramacaoPage } from './../programacao/programacao';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProgramacaoPage;

  constructor() {

  }
}
