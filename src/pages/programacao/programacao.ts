import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SheetProvider } from '../../providers/sheet/sheet';
import { DetalhePage } from './../detalhe/detalhe';

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
  listaBkp: any;

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
      this.listaBkp = this.listaProgramacao;
      console.log(this.listaProgramacao);
    },
      err => {
        console.log("Erro.");
        this.listaProgramacao = [];
      }
    );
  }

  getItems(ev: any){
    this.listaProgramacao = this.listaBkp;
    let search = ev.target.value;
    if(search && search.trim() != ''){
      this.listaProgramacao = this.listaProgramacao.filter((item) => {
        return(item.gsx$nome.$t.toLowerCase().indexOf(search.toLowerCase()) > -1);
      })
    }
  }

  goToDetalhes(item: any){
    console.log(item);
    this.navCtrl.push(DetalhePage, {detalhes: item});
  }

}

  

interface SheetResponse {
  feed: string;
}
