import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SheetProvider } from '../../providers/sheet/sheet';
import { UserDataProvider } from './../../providers/user-data/user-data';
import { DetalhePage } from './../detalhe/detalhe';
import { ModalController } from 'ionic-angular';
import { ProgramacaoFilterPage } from './../programacao-filter/programacao-filter';
import { LoadingController } from 'ionic-angular';

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
    private userProvider: UserDataProvider,
    private modalCtrl: ModalController, 
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.getProgramacao();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgramacaoPage');
  }

  doRefresh(refresher){
    this.sheetProvider.loadProgramacao();
    refresher.complete();
  }

  getProgramacao() {
    let t0 = performance.now();
    let loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 10000
    });
    loader.present();
    this.sheetProvider.getProgramacao().subscribe(programacao => {
      this.listaProgramacao = programacao;
      this.listaBkp = this.listaProgramacao;
      if(!this.selectDataOptions && this.listaProgramacao.length > 0){
        this.setSelects();
        this.segmentDate = this.selectDataOptions[0]; 
        loader.dismiss().catch(() => {});
      }  
      let t1 = performance.now();
      console.log("Tempo total de carregamento: " + (t1-t0) + " ms");    
    }, error => {
      console.log(error);
    });

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
    this.segmentDate = "Todos";
    let t1 = performance.now();
    console.log("A busca levou: " + (t1-t0) + " ms");
  }

  goToDetalhes(item: any) {
    this.navCtrl.push(DetalhePage, { detalhes: item });
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
      });
    }
    if (this.selectedLocal != 'Todos') {
      this.listaProgramacao = this.listaProgramacao.filter((item) => {
        return (item.local.toLowerCase().indexOf(this.selectedLocal.toLowerCase()) > -1);
      });
    }
  }

  setFavorite(item: any, event: Event){
    event.stopPropagation();
     item.favorito = !item.favorito;
     let message = "";
     if(item.favorito){
       message = "Adicionado aos favoritos.";
       this.userProvider.setFavorito(item.id);
     }else{
       message = "Removido dos favoritos.";
       this.userProvider.removeFavorito(item.id);
     }
     let toast = this.toastCtrl.create({
       message: message,
       duration: 1000
     });
     toast.present();
  }

  getDates(){
    let dateList = [];
    this.listaProgramacao.forEach(element => {
      if (dateList.indexOf(element.data) == -1) {
        dateList.push(element.data);
      }
    });
    return dateList;
  }


}
