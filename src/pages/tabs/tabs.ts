import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { ProgramacaoPage } from './../programacao/programacao';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProgramacaoPage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
