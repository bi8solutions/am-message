import {Component, OnInit} from '@angular/core';
import {MessageService} from "./modules/am-message/message.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
  }
}
