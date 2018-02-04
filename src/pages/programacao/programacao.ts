import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SheetProvider } from '../../providers/sheet/sheet';
import { DetalhePage } from './../detalhe/detalhe';
import { ModalController } from 'ionic-angular';
import { ProgramacaoFilterPage } from './../programacao-filter/programacao-filter';
import { LoadingController } from 'ionic-angular';
import * as moment from 'moment';
import { NgForage } from "@ngforage/ngforage-ng5";

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
  segmentDate: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private sheetProvider: SheetProvider, 
    private modalCtrl: ModalController, 
    private loadingCtrl: LoadingController,
    private ngforage: NgForage) {
  }

  ngOnInit() {
    this.getProgramacao();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgramacaoPage');
  }

  doRefresh(refresher){
    this.getProgramacao();
    refresher.complete();
  }

  getProgramacao() {
    let t0 = performance.now();
    let loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 3000
    });
    loader.present();
    this.listaProgramacao = [];
    this.sheetProvider.getProgramacao()
      .subscribe(data => {   
        let dataResponse = <SheetResponse>data;
        let updateSheet = dataResponse.feed['updated'].$t;
        this.getUpdateDB().then(updateDB => {
          console.log("update planilha: " + updateSheet + " | update db: " + updateDB);
          if(updateSheet === updateDB){
            this.loadDataFromDB();   
          }else{
            let entry = dataResponse.feed['entry'];
            this.loadDataFromSheet(entry, updateSheet); 
          }
          loader.dismiss();
          let t1 = performance.now();
          console.log("O processamento da planilha levou: " + (t1-t0) + " ms");
        });    
      },
      err => {
        console.log("Erro. Acesso offline.");
        this.loadDataFromDB();
        loader.dismiss();
      }
      );
  }

  loadDataFromDB(){
    console.log("Dados carregados da indexedDB.");
    this.getProgramacaoDB().then(programacao => {
      this.listaProgramacao = programacao;
      if(this.listaProgramacao === null){
        this.listaProgramacao = [];
      }else{
        this.orderByDate();
        this.listaBkp = this.listaProgramacao;
        this.setSelects();
        this.segmentDate = this.selectDataOptions[0];
      }
    });   
  }

  loadDataFromSheet(entry: any, update: string){
    console.log("Dados carregados da planilha.");
    for (let index = 0; index < entry.length;) {
      const element = entry[index];
      let itemProgramacao = <ItemProgramacao>{};
      itemProgramacao.id = element.gsx$id.$t;
      itemProgramacao.nome = element.gsx$nome.$t;
      itemProgramacao.data = element.gsx$data.$t;
      itemProgramacao.horaInicio = element.gsx$horainicio.$t;
      itemProgramacao.horaFim = element.gsx$horafim.$t;
      itemProgramacao.local = element.gsx$local.$t;
      itemProgramacao.descricoes = [];
      let descricaoElement = element;
      while (descricaoElement.gsx$id.$t == element.gsx$id.$t) {
        if (descricaoElement.gsx$descricao.$t != '' || descricaoElement.gsx$palestrantesautores.$t != '' || descricaoElement.gsx$arquivo.$t != '') {
          itemProgramacao.descricoes.push({
            descricao: descricaoElement.gsx$descricao.$t,
            autor: descricaoElement.gsx$palestrantesautores.$t,
            arquivo: descricaoElement.gsx$arquivo.$t
          });
        }
        index++;
        if (entry[index] != null) {
          descricaoElement = entry[index];
        } else {
          break;
        }

      }
      this.listaProgramacao.push(itemProgramacao);
    }
    this.orderByDate();
    this.listaBkp = this.listaProgramacao;
    this.setSelects();
    this.segmentDate = this.selectDataOptions[0];
    this.setProgramacaoDB(this.listaProgramacao);
    this.setUpdateDB(update);
  }

  getItems(ev: any) {
    console.log("Buscando...");
    let t0 = performance.now();
    this.listaProgramacao = this.listaBkp;
    let search = ev.target.value;
    if (search && search.trim() != '') {
      let searchLC = search.toLowerCase();
      this.listaProgramacao = this.listaProgramacao.filter((item) => {
        return (item.nome.toLowerCase().indexOf(searchLC) > -1
          || item.local.toLowerCase().indexOf(searchLC) > -1
          || item.descricoes.filter((descricao)=> {
            return descricao.descricao.toLowerCase().indexOf(searchLC) > -1
              || descricao.autor.toLowerCase().indexOf(searchLC) > -1
          }).length > 0);
      });
    }
    let t1 = performance.now();
    console.log("A busca levou: " + (t1-t0) + " ms");
  }

  goToDetalhes(item: any) {
    this.navCtrl.push(DetalhePage, { detalhes: item });
  }

  orderByDate(){
    this.listaProgramacao.sort(function(a, b){
      return moment(a.data+a.horaInicio, "DD/MM/YYYYHH:mm").valueOf() - (moment(b.data+b.horaInicio, "DD/MM/YYYYHH:mm").valueOf());
    });
  }

  setSelects() {
    this.selectDataOptions = [];
    this.selectLocalOptions = [];
    this.listaProgramacao.forEach(element => {
      if (this.selectDataOptions.indexOf(element.data) == -1) {
        this.selectDataOptions.push(element.data);
      }
      if (this.selectLocalOptions.indexOf(element.local) == -1 && element.local != '') {
        this.selectLocalOptions.push(element.local);
      }
    });
    this.selectedData = 'Todos';
    this.selectedLocal = 'Todos';
  }

  getInitialTimes(data:string){
    let initialTimes = [];
    this.listaProgramacao.forEach(element => {
      if (initialTimes.indexOf(element.horaInicio) == -1 && element.data === data) {
        initialTimes.push(element.horaInicio);
      }
    });
    return initialTimes;
  }

  showFilter() {
    let modal = this.modalCtrl.create(ProgramacaoFilterPage, { datas: this.selectDataOptions, locais: this.selectLocalOptions, default: 'Todos' });
    modal.present();

    modal.onWillDismiss((data: any) => {
      if (data) {
        this.selectedData = data.data;
        this.selectedLocal = data.local;
        this.filterProgramacao();
      }
    });
  }

  filterProgramacao() {
    this.listaProgramacao = this.listaBkp;
    if (this.selectedData != 'Todos') {
      this.listaProgramacao = this.listaProgramacao.filter((item) => {
        return (item.data.toLowerCase().indexOf(this.selectedData.toLowerCase()) > -1);
      })
    }
    if (this.selectedLocal != 'Todos') {
      this.listaProgramacao = this.listaProgramacao.filter((item) => {
        return (item.local.toLowerCase().indexOf(this.selectedLocal.toLowerCase()) > -1);
      })
    }
  }

  async setProgramacaoDB(lista: Array<ItemProgramacao>) {
    await this.ngforage.setItem('programacao', lista);
  }

  async getProgramacaoDB(){
    let programacao = await this.ngforage.getItem<Array<ItemProgramacao>>('programacao');
    return programacao;
  }

  async setUpdateDB(update: string){
    await this.ngforage.setItem('update', update);
  }

  async getUpdateDB(){
    let update = await this.ngforage.getItem<string>('update');
    return update;
  }

}

interface SheetResponse {
  feed: Object;
}

interface ItemProgramacao {
  id: string,
  nome: string,
  descricoes: Array<{ descricao: string, autor: string, arquivo: string }>,
  data: string,
  horaInicio: string,
  horaFim: string,
  local: string
}
