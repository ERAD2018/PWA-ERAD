import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForage } from "@ngforage/ngforage-ng5";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SheetProvider } from '../../providers/sheet/sheet';

/*
  Generated class for the UserDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserDataProvider {

  private listaFavoritosObs: BehaviorSubject<Array<ItemProgramacao>>;
  private listaFavoritosID: Array<string>;
  private listaFavoritos: Array<ItemProgramacao>

  constructor(public http: HttpClient, private ngforage: NgForage, private sheetProvider: SheetProvider) {
    console.log('Hello UserDataProvider Provider');
    this.listaFavoritosObs = new BehaviorSubject([]);
    this.loadFavoritos();
  }

  

  private loadFavoritos(){
    this.getFavoritosFromDB().then(favoritosIds => {
      if(favoritosIds){
        this.listaFavoritosID = favoritosIds;
        this.sheetProvider.getProgramacao().subscribe(programacao => {
          this.listaFavoritos = programacao.filter(item => {
            return this.listaFavoritosID.indexOf(item.id) > -1
          });
          this.listaFavoritosObs.next(this.listaFavoritos);
        });
      }else{
        this.listaFavoritosID = [];
        this.listaFavoritos  = [];
        this.listaFavoritosObs.next(this.listaFavoritos);
      }
    });
  }

  private async getFavoritosFromDB(){
    let favoritosIds = await this.ngforage.getItem<Array<string>>('favoritos');
    return favoritosIds;
  }

  public async setFavorito(id: string){
    this.listaFavoritosID.push(id);
    this.sheetProvider.getProgramacao().subscribe(programacao => {
      programacao.forEach(item => {
        if(item.id === id){
          this.listaFavoritos.push(item);
          this.listaFavoritosObs.next(this.listaFavoritos);
        }
      });
    });
    await this.ngforage.setItem('favoritos', this.listaFavoritosID);
  }

  public async removeFavorito(id: string){
    let index = this.listaFavoritosID.indexOf(id);
    if(index > -1){
      this.listaFavoritosID.splice(index, 1);  
    }
    index = this.listaFavoritos.findIndex((item, index) =>{
      if(item.id === id){
        return true;
      }
    });
    if(index > -1){
      this.listaFavoritos.splice(index, 1);
    }
    this.listaFavoritosObs.next(this.listaFavoritos);
    await this.ngforage.setItem('favoritos', this.listaFavoritosID);
  }

  public getFavoritos(){
    return this.listaFavoritosObs.asObservable();
  }

}

interface ItemProgramacao {
  id: string,
  nome: string,
  descricoes: Array<{ descricao: string, autor: string, arquivo: string }>,
  data: string,
  horaInicio: string,
  horaFim: string,
  local: string,
  favorito: boolean
}
