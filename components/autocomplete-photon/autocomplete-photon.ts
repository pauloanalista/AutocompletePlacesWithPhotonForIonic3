import { Component, Input, EventEmitter, Output } from '@angular/core';

import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'autocomplete-photon',
  templateUrl: 'autocomplete-photon.html'
})
export class AutocompletePhotonComponent {

  @Input("label")
  label: string;

  //Expoe variavel do pai para o filho
  @Input("placeholder")
  placeholder: string;

  @Input("icon")
  icone: string = 'md-locate';

  localCollection: any[] = [];
  digitando: boolean = false;
  localSelecionado: string;

  //Expoe a variavel do filho para o pai
  @Output() onCoordinate = new EventEmitter<any>();
  coordinate = { latitude: 0, longitude: 0 };


  @Output() onClickIcon = new EventEmitter<any>();
  constructor(public http: Http, private toastCtrl: ToastController) {

  }

  listar(local: string): Promise<Response> {
    let url = 'http://photon.komoot.de/api/?q=' + local + '&lang=de&limit=5';

    //let headers = new Headers();
    //headers.append('Content-Type' , 'application/json');
    //headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    //return this.http.get(url, { headers: headers }).toPromise();
    return this.http.get(url).toPromise();
  }

  filtrar(criterio: string) {
    this.digitando = true;

    if (criterio.length < 3) {
      return;
    }

    this.listar(criterio).then((response: any) => {
      this.localCollection = response.json().features;

      if (this.localCollection.length < 1) {
        this.toastCtrl.create({
          message: 'Endereço não encontrado',
          duration: 3000
        }).present();
      }
    });
  }

  selecionar(local: any) {
    this.localSelecionado = local.properties.name;
    
    this.coordinate.latitude = local.geometry.coordinates[1];
    this.coordinate.longitude = local.geometry.coordinates[0];
    
    this.onCoordinate.emit(this.coordinate);
    
    this.digitando = false;
  }

  clickIcon(){
    this.onClickIcon.emit();
  }
  
  onFocus(){
    this.digitando=true;
  }

  onBlur(){
    setTimeout(() => {
      if (this.digitando==true){
        this.digitando=false;
      }
    }, 1500);
  }
}
