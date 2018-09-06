export enum MsgType {
  Event = 'event',
  Info = 'info'
}

export class Msg {
  originId: string;
  ts: Date;

  constructor(public type: string,
              public receiveOrigin: boolean) {
  }
}

export enum EventType {
  OpenedPage = 'OpenedPage',
  ClosedPage = 'ClosedPage',
  Interact = 'Interact',
  Reading = 'Reading',
  Editing = 'Editing',
  LoggedIn = 'LoggedIn',
  LoggedOut = 'LoggedOut'
}

export class EventMsg extends Msg {
  constructor(public eventType: EventType,
              public receiveOrigin: boolean = false,
              public eventDescriptor?: string,
              public eventOnId?: number) {
    super(MsgType.Event, receiveOrigin);
  }
}

export class InfoMsg extends Msg {
  constructor(public browser: string,
              public username: string) {
    super(MsgType.Info, false);
  }
}