import { UserDataProvider } from './../../providers/user-data/user-data';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

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

  detalhes: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, private userProvider: UserDataProvider) {
    this.detalhes = this.navParams.data.detalhes;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalhePage');
  }

  goBack() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    }
  }

  openFile(url: string) {
    window.open(url);
  }

  setFavorite(item: any) {
    item.favorito = !item.favorito;
    let message = "";
    if (item.favorito) {
      message = "Adicionado aos favoritos.";
      this.userProvider.setFavorito(item.id);
    } else {
      message = "Removido dos favoritos.";
      this.userProvider.removeFavorito(item.id);
    }
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }
}
