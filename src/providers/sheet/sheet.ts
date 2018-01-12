import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SheetProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SheetProvider {
  sheetURL: string;

  constructor(public http: HttpClient) {
    this.sheetURL = 'https://spreadsheets.google.com/feeds/list/1GaNzOyrRfdY5MIrUSBY4_TnV0oEc3nG-bNwdbzKUJu4/od6/public/values?alt=json';
  }

  getProgramacao(){
    return this.http.get(this.sheetURL);
  }

}