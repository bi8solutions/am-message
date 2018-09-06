import {Component, OnInit} from '@angular/core';
import {MessageService} from './modules/am-message/message.service';
import {UaaEvent, UaaEventService} from '@bi8/am-uaa';
import {EventMsg, EventType, MsgType} from './modules/am-message/message';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private messageService: MessageService,
              private uaaEventService: UaaEventService) {
  }

  ngOnInit(): void {
    this.messageService.eventSub('home').subscribe(msg => console.dir(msg));

    const msg = new EventMsg(EventType.OpenedPage,true, 'home');
    this.messageService.pub(msg);
  }

  broadcastLogin() {
    this.uaaEventService.broadcast(UaaEvent.LOGIN_SUCCESS);
  }

  sendEvent() {
    const msg = new EventMsg(EventType.Interact, true, `'Interact' Button`);
    this.messageService.pub(msg, true, 'home');
  }
}
