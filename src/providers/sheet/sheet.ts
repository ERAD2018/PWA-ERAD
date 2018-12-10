import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForage } from "ngforage";
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/*
  Generated class for the SheetProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SheetProvider {
  private sheetURL: string;
  private programacao: Array<ItemProgramacao>;
  private listaObs: BehaviorSubject<Array<ItemProgramacao>>;

  constructor(public http: HttpClient, private ngforage: NgForage) {
    this.sheetURL = 'https://spreadsheets.google.com/feeds/list/1GaNzOyrRfdY5MIrUSBY4_TnV0oEc3nG-bNwdbzKUJu4/od6/public/values?alt=json';
    this.listaObs = new BehaviorSubject([]);
    this.loadProgramacao();
  }

  public loadProgramacao(){
    this.http.get(this.sheetURL).subscribe(data => {   
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
      });    
    },
    err => {
      console.log("Erro. Acesso offline.");
      this.loadDataFromDB();
    }
    );;
  }

  private loadDataFromDB(){
    console.log("Dados carregados da indexedDB.");
    this.getProgramacaoDB().then(programacao => {
      if(!programacao){
        this.programacao = [];
        this.listaObs.next(programacao);
      }else{
        this.programacao = this.orderByDate(programacao);
        this.getFavoritosFromDB().then(favoritos => {
          if(favoritos){
            this.programacao.forEach(element =>  {
              if(favoritos.indexOf(element.id) > -1){
                element.favorito = true;
              }
            });
          }
          this.listaObs.next(this.programacao);
        });
        
      }
    });   
  }

  private loadDataFromSheet(entry: any, update: string){
    console.log("Dados carregados da planilha.");
    let programacao = [];
    for (let index = 0; index < entry.length;) {
      const element = entry[index];
      let itemProgramacao = <ItemProgramacao>{};
      itemProgramacao.id = element.gsx$id.$t;
      itemProgramacao.nome = element.gsx$nome.$t;
      itemProgramacao.chair = element.gsx$chair.$t
      itemProgramacao.data = element.gsx$data.$t;
      itemProgramacao.horaInicio = element.gsx$horainicio.$t;
      itemProgramacao.horaFim = element.gsx$horafim.$t;
      itemProgramacao.local = element.gsx$local.$t;
      itemProgramacao.favorito = false;
      itemProgramacao.descricoes = [];
      let descricaoElement = element;
      while (descricaoElement.gsx$id.$t == element.gsx$id.$t) {
        if(descricaoElement.gsx$horafim.$t != '' && (moment(descricaoElement.gsx$horafim.$t, "HH:mm").valueOf() > moment(element.gsx$horafim.$t, "HH:mm").valueOf())){
          itemProgramacao.horaFim = descricaoElement.gsx$horafim.$t;
        }
        if (descricaoElement.gsx$descricao.$t != '' || descricaoElement.gsx$palestrantesautores.$t != '' || descricaoElement.gsx$arquivo.$t != '' || descricaoElement.gsx$arquivohtml.$t != '') {
          itemProgramacao.descricoes.push({
            descricao: descricaoElement.gsx$descricao.$t,
            autor: descricaoElement.gsx$palestrantesautores.$t,
            arquivo: descricaoElement.gsx$arquivo.$t,
            arquivoHTML: descricaoElement.gsx$arquivohtml.$t
          });
        }
        index++;
        if (entry[index] != null) {
          descricaoElement = entry[index];
        } else {
          break;
        }

      }
      programacao.push(itemProgramacao);
    }
    this.programacao = this.orderByDate(programacao);
    this.listaObs.next(this.programacao);
    this.setProgramacaoDB(this.programacao);
    this.setUpdateDB(update);
  }

  private orderByDate(programacao: Array<ItemProgramacao>){
    programacao.sort(function(a, b){
      return moment(a.data+a.horaInicio, "DD/MM/YYYYHH:mm").valueOf() - (moment(b.data+b.horaInicio, "DD/MM/YYYYHH:mm").valueOf());
    });
    return programacao;
  }

  private async setProgramacaoDB(lista: Array<ItemProgramacao>) {
    await this.ngforage.setItem('programacao', lista);
  }

  private async getProgramacaoDB(){
    let programacao = await this.ngforage.getItem<Array<ItemProgramacao>>('programacao');
    return programacao;
  }

  private async setUpdateDB(update: string){
    await this.ngforage.setItem('update', update);
  }

  private async getUpdateDB(){
    let update = await this.ngforage.getItem<string>('update');
    return update;
  }

  private async getFavoritosFromDB(){
    let favoritosIds = await this.ngforage.getItem<Array<string>>('favoritos');
    return favoritosIds;
  }

  public getProgramacao(){
    //Se os dados já foram carregados na memória retorna a lista já processada
    /*if(this.programacao != null){
      this.listaObs.next(this.programacao);
    }else{ // carrega os dados da planilha ou indexedDB.
      this.loadProgramacao();
    }*/
    return this.listaObs.asObservable();
  }


}

interface SheetResponse {
  feed: Object;
}

interface ItemProgramacao {
  id: string,
  nome: string,
  chair: string,
  descricoes: Array<{ descricao: string, autor: string, arquivo: string, arquivoHTML: string }>,
  data: string,
  horaInicio: string,
  horaFim: string,
  local: string,
  favorito: boolean
}