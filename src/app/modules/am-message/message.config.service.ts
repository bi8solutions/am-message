import {Inject, Injectable} from "@angular/core";

export interface MessageConfig {
  url: string
  topics: {}
  dest: {}
}

@Injectable({providedIn: 'root'})
export class MessageConfigService implements MessageConfig {
  url: string;
  topics: {};
  dest: {};

  constructor(@Inject('MessageConfig') config: MessageConfig) {
    this.url = config.url;
    this.topics = config.topics;
    this.dest = config.dest;
  }

}