import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SheetProvider } from '../../providers/sheet/sheet';

/**
 * Generated class for the ProgramacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-programacao',
  templateUrl: 'programacao.html',
})
export class ProgramacaoPage {
  
  listaProgramacao: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sheetProvider: SheetProvider) {
  }

  ngOnInit(){
    this.getProgramacao();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgramacaoPage');
  }

  getProgramacao(){
    this.sheetProvider.getProgramacao()
    .subscribe(data => {
      console.log(data);
      var dataResponse = <SheetResponse>data;
      this.listaProgramacao = dataResponse.feed['entry'];
      console.log(this.listaProgramacao);
    },
      err => {
        console.log("Erro.");
        this.listaProgramacao = [];
      }
    );
  }

}

interface SheetResponse {
  feed: string;
}
