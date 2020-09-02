import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Settings } from '../settings/settings';
import { LocalData } from '../data/localData';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  signalReceived = new EventEmitter<any>();
  apiurl: string = Settings.serverUrl;

  constructor() {
  }

  buildConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiurl + 'signal?access-token=' + LocalData.getToken().replace('bearer ', '').trim())
      .build();
  }

  startConnection = () => {
    this.hubConnection.stop().then(() => {
      this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started...')
        this.registerSignalEvents();
      })
      .catch(err => {
        console.log(err);

        setTimeout(() => {
          this.buildConnection();
          this.startConnection();
        }, 3000);
      });
    });
  }

  registerSignalEvents() {
    this.hubConnection.on('AddedScheduleForEmployee', (data: any) => {
      this.signalReceived.emit(data);
    });
  }
}
