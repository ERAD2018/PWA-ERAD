import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SheetProvider } from '../../providers/sheet/sheet';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private sheetProvider: SheetProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {
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
    let loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 3000
    });
    loader.present();
    this.listaProgramacao = [];
    this.sheetProvider.getProgramacao()
      .subscribe(data => {
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
            if (entrys[index] != null) {
              descricaoElement = entrys[index];
            } else {
              break;
            }

          }
          this.listaProgramacao.push(itemProgramacao);
        }
        this.listaBkp = this.listaProgramacao;
        this.setDataSelect();
        this.setLocalSelect();
        loader.dismiss();
      },
      err => {
        console.log("Erro.");
        this.listaProgramacao = [];
      }
      );
  }

  getItems(ev: any) {
    this.listaProgramacao = this.listaBkp;
    let search = ev.target.value;
    if (search && search.trim() != '') {
      this.listaProgramacao = this.listaProgramacao.filter((item) => {
        return (item.nome.toLowerCase().indexOf(search.toLowerCase()) > -1
          //|| item.gsx$palestrantesautores.$t.toLowerCase().indexOf(search.toLowerCase()) > -1 
          || item.local.toLowerCase().indexOf(search.toLowerCase()) > -1);
      })
    }
  }

  goToDetalhes(item: any) {
    this.navCtrl.push(DetalhePage, { detalhes: item });
  }

  setDataSelect() {
    this.selectDataOptions = [];
    this.listaProgramacao.forEach(element => {
      if (this.selectDataOptions.indexOf(element.data) == -1) {
        this.selectDataOptions.push(element.data);
      }
    });
    this.selectedData = 'Todos';
  }

  setLocalSelect() {
    this.selectLocalOptions = [];
    this.listaProgramacao.forEach(element => {
      if (this.selectLocalOptions.indexOf(element.local) == -1 && element.local != '') {
        this.selectLocalOptions.push(element.local);
      }
    });
    this.selectedLocal = 'Todos';
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

}



interface SheetResponse {
  feed: Object;
}

interface ItemProgramacao {
  id: number,
  nome: string,
  descricoes: Array<{ descricao: string, autor: string, arquivo: string }>,
  data: string,
  horaInicio: string,
  horaFim: string,
  local: string
}
