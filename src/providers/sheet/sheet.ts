import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForage } from "@ngforage/ngforage-ng5";
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

/*
  Generated class for the SheetProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SheetProvider {
  private sheetURL: string;
  private listaProgramacao: Subject<Array<ItemProgramacao>>;

  constructor(public http: HttpClient, private ngforage: NgForage) {
    this.sheetURL = 'https://spreadsheets.google.com/feeds/list/1GaNzOyrRfdY5MIrUSBY4_TnV0oEc3nG-bNwdbzKUJu4/od6/public/values?alt=json';
    this.listaProgramacao = new Subject();
  }

  private loadProgramacao(){
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
      if(programacao === null){
        this.listaProgramacao.next([]);
      }else{
        this.listaProgramacao.next(this.orderByDate(programacao));
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
      programacao.push(itemProgramacao);
    }
    programacao = this.orderByDate(programacao);
    this.listaProgramacao.next(programacao);
    this.setProgramacaoDB(programacao);
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

  public getProgramacao(){
    this.loadProgramacao();
    return this.listaProgramacao.asObservable();
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