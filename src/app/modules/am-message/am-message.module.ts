import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as SockJS from 'sockjs-client';
import {StompConfig, StompService} from "@stomp/ng2-stompjs";
import {AmUaaModule} from "@bi8/am-uaa";
import {HttpClient, HttpClientModule} from "@angular/common/http";

export function socket() {
  return new SockJS('/api/stomp');
}

const stompConfig: StompConfig = {
  url: socket(),
  headers: {},
  heartbeat_in: 25000,
  heartbeat_out: 0,
  reconnect_delay: 5000,

  debug: true
};

@NgModule({
  providers: [
    StompService,
    {provide: StompConfig, useValue: stompConfig},
  ],
  imports: [
    CommonModule,
  ],
  declarations: []
})
export class AmMessageModule {
}
