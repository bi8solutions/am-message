import {Injectable} from '@angular/core';
import {v4 as uuid} from 'uuid';
import {StompService} from "@stomp/ng2-stompjs";
import {UaaEvent, UaaEventService, UaaService} from "@bi8/am-uaa";
import {EventMsg, InfoMsg, Msg, MsgType} from "./message";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";


@Injectable({providedIn: 'root'})
export class MessageService {

  clientId = uuid();

  private eventSubject: Subject<EventMsg> = new Subject<EventMsg>();
  private eventSubscription: Subscription;

  private sentInfo = false;

  constructor(private stompService: StompService,
              private uaaService: UaaService,
              private uaaEventService: UaaEventService) {

    this.uaaEventService.subscribe((event: UaaEvent) => {
      if (event == UaaEvent.LOGIN_SUCCESS || event == UaaEvent.LOAD_IDENTITY_SUCCESS) {
        if (!this.sentInfo) {
          const browser = this.detectBrowser();
          const username = this.uaaService.getIdentity().userName;
          const msg = new InfoMsg(browser, username);
          this.pub(msg);

          this.sentInfo = true;
        }
      }
    });
  }

  getEventObservable(): Observable<EventMsg> {
    return this.eventSubject;
  }

  eventSub(context?: string): Observable<EventMsg> {
    if (this.eventSubscription && !this.eventSubscription.closed) {
      this.eventSubscription.unsubscribe()
    }
    this.eventSubscription = this.sub<EventMsg>(MsgType.Event, this.eventSubject, context);
    return this.eventSubject as Observable<EventMsg>;
  }


  sub<T extends Msg>(type: MsgType, subject: Subject<T>, context?: string) {
    let dest = `/topic/${type}`;
    if (context) {
      dest += `/${context}`;
    }
    return this.stompService.subscribe(dest).subscribe(res => {
      let msg = JSON.parse(res.body) as T;
      if (msg.originId === this.clientId && msg.receiveOrigin) {
        subject.next(msg);
      }
    });
  }

  pub(msg: Msg, directToClients: boolean = false, context?: string) {
    let dest: string;
    if (directToClients === true) {
      dest = `/topic/${msg.type}`;
    } else {
      dest = `/app/${msg.type}`;
    }
    if (context) {
      dest += `/${context}`;
    }
    msg.originId = this.clientId;
    msg.ts = new Date();

    const message = JSON.stringify(msg);
    this.stompService.publish(dest, message);
  }


  private detectBrowser(): string {
    let ua = window.navigator.userAgent;
    let browser: string;
    let version: string;
    try {
      let flags = {
        isAndroid: /Android/.test(navigator.userAgent),
        isEdge: /Edge/.test(navigator.userAgent),
        isFirefox: /Firefox/.test(navigator.userAgent),
        isChrome: /Google Inc/.test(navigator.vendor),
        isChromeIOS: /CriOS/.test(navigator.userAgent),
        isIE11: /Trident/.test(navigator.userAgent),
        isIE10: false,
        isIOS: /(iPhone|iPad|iPod)/.test(navigator.platform),
        isOpera: /OPR/.test(navigator.userAgent),
        isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
      };

      let msie = ua.indexOf('MSIE ');
      if (msie > 0) {
        flags.isIE10 = true;
        version = ua.substring(msie + 5, ua.indexOf('.', msie))
      } else {
        if (flags.isChrome) {
          browser = 'Chrome';
          let chrome = ua.indexOf('Chrome/');
          version = ua.substring(chrome + 7, ua.indexOf('.', chrome));

        } else if (flags.isIE11) {
          browser = 'IE11';
          let rv = ua.indexOf('rv:');
          version = ua.substring(rv + 3, ua.indexOf('.', rv));

        } else if (flags.isEdge) {
          browser = 'Edge';
          let edge = ua.indexOf('Edge/');
          version = ua.substring(edge + 5, ua.indexOf('.', edge));

        } else if (flags.isSafari) {
          browser = 'Safari';
          let safari = ua.indexOf('Safari/');
          version = ua.substring(safari + 7, ua.indexOf('.', safari));
        }
      }
    } catch (err){
      console.error("Error while detecting browser type and version", err);
    }
    return `${browser} ${version}`
  }


}
