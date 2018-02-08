import { UserDataProvider } from '../../providers/user-data/user-data';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DetalhePage } from './../detalhe/detalhe';


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

  public userDataSub: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userData: UserDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritosPage');
  }

  ngOnInit(){
    this.userDataSub = this.userData.getFavoritos();
  }

  goToDetalhes(item: any) {
    this.navCtrl.push(DetalhePage, { detalhes: item });
  }

}
