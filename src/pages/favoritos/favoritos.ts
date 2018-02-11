import { UserDataProvider } from '../../providers/user-data/user-data';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DetalhePage } from './../detalhe/detalhe';
import * as moment from 'moment';

/**
 * Generated class for the FavoritosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-favoritos',
  templateUrl: 'favoritos.html',
})
export class FavoritosPage {

  public favoritosList: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userData: UserDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritosPage');
  }

  ngOnInit(){
    this.userData.getFavoritos().subscribe(favoritos => {
      this.favoritosList = favoritos.sort((a, b) => {
        return moment(a.data+a.horaInicio, "DD/MM/YYYYHH:mm").valueOf() - (moment(b.data+b.horaInicio, "DD/MM/YYYYHH:mm").valueOf());
      });
    });
  }

  goToDetalhes(item: any) {
    this.navCtrl.push(DetalhePage, { detalhes: item });
  }

}
