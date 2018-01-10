import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SheetProvider } from '../../providers/sheet/sheet';
import { DetalhePage } from './../detalhe/detalhe';
import { ModalController } from 'ionic-angular';
import { ProgramacaoFilterPage } from './../programacao-filter/programacao-filter';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private sheetProvider: SheetProvider, public modalCtrl: ModalController) {
  }

  ngOnInit(){
    this.getProgramacao();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgramacaoPage');
  }

  getProgramacao(){
    this.listaProgramacao = [];
    this.sheetProvider.getProgramacao()
    .subscribe(data => {
      console.log(data);
      let dataResponse = <SheetResponse>data;
      let entrys = dataResponse.feed['entry'];
      for (let index = 0; index < entrys.length;) {
        const element = entrys[index];
        let itemProgramacao = <ItemProgramacao>{};
        itemProgramacao.nome = element.gsx$nome.$t;
        itemProgramacao.data = element.gsx$data.$t;
        itemProgramacao.horaInicio = element.gsx$horainicio.$t;
        itemProgramacao.horaFim = element.gsx$horafim.$t;
        itemProgramacao.local = element.gsx$local.$t;
        itemProgramacao.descricoes = [];
        console.log(element);
        let descricaoElement = element;
        console.log(descricaoElement);
        while(descricaoElement.gsx$id.$t == element.gsx$id.$t){
          itemProgramacao.descricoes.push({
            descricao: descricaoElement.gsx$descricao.$t,
            autor: descricaoElement.gsx$palestrantesautores.$t,
            arquivo: descricaoElement.gsx$arquivo.$t
          }); 
          index++;
          if(entrys[index] != null){
            descricaoElement = entrys[index];
          }else{
            break;
          }
          
        }
        this.listaProgramacao.push(itemProgramacao);
      }
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
        return(item.nome.toLowerCase().indexOf(search.toLowerCase()) > -1 
        //|| item.gsx$palestrantesautores.$t.toLowerCase().indexOf(search.toLowerCase()) > -1 
        || item.local.toLowerCase().indexOf(search.toLowerCase()) > -1 );
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
      if(this.selectDataOptions.indexOf(element.data) == -1){
        console.log(element.data);
        this.selectDataOptions.push(element.data);
      }
    });
    this.selectedData = 'Todos';
    console.log(this.selectDataOptions);
  }

  setLocalSelect(){
    this.selectLocalOptions = [];
    this.listaProgramacao.forEach(element => {
      if(this.selectLocalOptions.indexOf(element.local) == -1 && element.local != ''){
        console.log(element.local);
        this.selectLocalOptions.push(element.local);
      }
    });
    this.selectedLocal = 'Todos';
    console.log(this.selectLocalOptions);
  }

  showFilter(){
    console.log('showFilter');
    let modal = this.modalCtrl.create(ProgramacaoFilterPage, {datas: this.selectDataOptions, locais: this.selectLocalOptions, default: 'Todos'});
    console.log(modal);
    modal.present();

    modal.onWillDismiss((data: any) => {
      if (data) {
        this.selectedData = data.data;
        this.selectedLocal = data.local;
        this.filterProgramacao();
      }
    });
  }

  filterProgramacao(){
    console.log('Data:' + this.selectedData + ' - Local: ' + this.selectedLocal);   
    this.listaProgramacao = this.listaBkp;
    if(this.selectedData != 'Todos'){
      this.listaProgramacao = this.listaProgramacao.filter((item) => {
        return(item.data.toLowerCase().indexOf(this.selectedData.toLowerCase()) > -1);
      })
    }
    if(this.selectedLocal != 'Todos'){
      this.listaProgramacao = this.listaProgramacao.filter((item) => {
        return(item.local.toLowerCase().indexOf(this.selectedLocal.toLowerCase()) > -1);
      })
    }
  }

}

  

interface SheetResponse {
  feed: Object;
}

interface ItemProgramacao{
  id: number,
  nome: string,
  descricoes: Array<{descricao: string, autor: string, arquivo: string}>,
  data: string,
  horaInicio: string,
  horaFim: string,
  local: string
}
