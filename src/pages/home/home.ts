import { Component } from '@angular/core';
import {BLE} from 'ionic-native';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public deviceAddress:string;
  public deviceData:string;

  constructor(public navCtrl: NavController) {
  }
  funcionou(){
    BLE.connect(this.deviceAddress).subscribe(peripheralData => {
      console.log(peripheralData);
    },error => {
      console.log('disconnected');
    });
  }
  bleConnect(){
    BLE.scan([], 5).subscribe(device => {
      console.log(JSON.stringify(device));
      this.deviceAddress = device.id.toString();
      BLE.connect(device.id).subscribe(peripheralData => {
        console.log("Deu certo=>"+JSON.stringify(peripheralData.services[2]));
        this.deviceData = JSON.stringify(peripheralData);
        BLE.startNotification(device.id, peripheralData.services[2], "2a37").subscribe(buffer => {
          console.log("BPM: "+String.fromCharCode.apply(null, new Uint8Array(buffer)));
          this.deviceData = String.fromCharCode.apply(null, new Uint8Array(buffer));
        },error =>{
          console.log("Deu ruim=>  "+ error.toString());
        });
      },error => {
        console.log("Deu ruim=>   " + error.toString());
      });
    }, error => {
      console.log(error);
    });
  }
}
