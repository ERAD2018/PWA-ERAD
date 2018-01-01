import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetalhePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detalhe',
  templateUrl: 'detalhe.html',
})
export class DetalhePage {

  detalhes:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.navParams.data.detalhes);
    this.detalhes = this.navParams.data.detalhes;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalhePage');
  }

 /* ionViewWillEnter(){
    console.log(this.navParams.data.detalhes);
    this.detalhes = this.navParams.data.detalhes;
  }*/

}
