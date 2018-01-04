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
  selectDataOptions: any;
  selectLocalOptions: any;
  selectedData: string;
  selectedLocal: string;

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
      this.setDataSelect();
      this.setLocalSelect();
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

  setDataSelect(){
    this.selectDataOptions = [];
    this.listaProgramacao.forEach(element => {
      if(this.selectDataOptions.indexOf(element.gsx$data.$t) == -1){
        console.log(element.gsx$data.$t);
        this.selectDataOptions.push(element.gsx$data.$t);
      }
    });
    this.selectedData = 'Todos';
    console.log(this.selectDataOptions);
  }

  setLocalSelect(){
    this.selectLocalOptions = [];
    this.listaProgramacao.forEach(element => {
      if(this.selectLocalOptions.indexOf(element.gsx$local.$t) == -1 && element.gsx$local.$t != ''){
        console.log(element.gsx$local.$t);
        this.selectLocalOptions.push(element.gsx$local.$t);
      }
    });
    this.selectedLocal = 'Todos';
    console.log(this.selectLocalOptions);
  }

  showFilter(){

  }

  filterProgramacao(ev: any){
    console.log('Data:' + this.selectedData + ' - Local: ' + this.selectedLocal);   
    this.listaProgramacao = this.listaBkp;
    if(this.selectedData != 'Todos'){
      this.listaProgramacao = this.listaProgramacao.filter((item) => {
        return(item.gsx$data.$t.toLowerCase().indexOf(this.selectedData.toLowerCase()) > -1);
      })
    }
    if(this.selectedLocal != 'Todos'){
      this.listaProgramacao = this.listaProgramacao.filter((item) => {
        return(item.gsx$local.$t.toLowerCase().indexOf(this.selectedLocal.toLowerCase()) > -1);
      })
    }
  }

}

  

interface SheetResponse {
  feed: Object;
}
