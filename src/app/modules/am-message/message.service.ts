import {Injectable} from '@angular/core';
import {v4 as uuid} from 'uuid';
import {StompService} from "@stomp/ng2-stompjs";
import {UaaEvent, UaaEventService} from "@bi8/am-uaa";
import {EventMsg, InfoMsg, Msg, MsgType} from "./message";
import {Subject} from "rxjs/Subject";


@Injectable({providedIn: 'root'})
export class MessageService {

  clientId = uuid();
  globalEvents: Subject<EventMsg> = new Subject<EventMsg>();

  constructor(private stompService: StompService,
              private uaaEventService: UaaEventService) {

    this.globalEvents.subscribe(msg => {
      console.dir(msg);
    });

    this.uaaEventService.subscribe((event: UaaEvent) => {
      switch (event) {
        case UaaEvent.LOGIN_SUCCESS:
          this.pub(new InfoMsg('LOGIN_SUCCESS'));
          break;
        case UaaEvent.LOAD_IDENTITY_SUCCESS:
          if (!this.stompService.connected()) {
            this.pub(new InfoMsg('LOGIN_SUCCESS'));
          }
          break;
        case UaaEvent.LOGOUT_SUCCESS:
          this.pub(new InfoMsg('LOGOUT_SUCCESS'));
          break;
      }
    });

    this.sub<EventMsg>(MsgType.Event, this.globalEvents);
  }

  sub<T extends Msg>(type: MsgType, subject: Subject<T>, url?: string) {
    let dest = type as string;
    if (url) {
      dest += `/${url}`;
    }
    return this.stompService.subscribe(dest).subscribe(res => {
      let msg = JSON.parse(res.body) as T;
      if (msg.originId === this.clientId && msg.receiveOrigin) {
        subject.next(msg);
      }
    });
  }

  pub(msg: Msg, url?: string) {
    let dest = msg.type as string;
    if (url) {
      dest += `/${url}`;
    }
    msg.originId = this.clientId;

    const message = JSON.stringify(msg);
    this.stompService.publish(dest, message);
  }


}
