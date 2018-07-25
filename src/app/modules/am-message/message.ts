export enum MsgType {
  Event = '/topic/event',
  Info = '/app/info'
}

export enum EventType {
  OpenedPage,
  ClosedPage,
  Interact
}

export class Msg {
  originId: string;

  constructor(public type: string,
              public receiveOrigin: boolean) {
  }
}

export class EventMsg extends Msg {
  constructor(public eventType: EventType,
              public receiveOrigin: boolean = false,
              public eventDescriptor?: string[] | string,
              public eventOnId?: number) {
    super(MsgType.Event, receiveOrigin);
  }
}

export class InfoMsg extends Msg {
  constructor(public msg: string,
              public receiveOrigin: boolean = true,
              public browser?: string,
              public username?: string) {
    super(MsgType.Info, receiveOrigin);
  }
}