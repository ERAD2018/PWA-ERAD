import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ProgramacaoFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-programacao-filter',
  templateUrl: 'programacao-filter.html',
})
export class ProgramacaoFilterPage {

  datas: Array<string> = [];
  locais: Array<string> = [];
  selectedData: string;
  selectedLocal:string;
  selectDefault;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.datas = this.navParams.data.datas;
    this.locais = this.navParams.data.locais;
    this.selectDefault = this.navParams.data.default;
    this.selectedData = this.navParams.data.default;
    this.selectedLocal = this.navParams.data.default;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgramacaoFilterPage');
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    let backData = {data: this.selectedData, local: this.selectedLocal};
    this.dismiss(backData);
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }

}
