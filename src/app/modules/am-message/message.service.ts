import {Injectable, Inject} from '@angular/core';

import * as _ from 'lodash';

interface Wrapper {
  value: any;
}

@Injectable({providedIn: 'root'})
export class MessageService {

  constructor() {
  }

  remove(key: string){
    localStorage.removeItem(key);
  }

  exists(key) : boolean {
    let found = localStorage.getItem(key);
    return !_.isNil(found);
  }

  get(key: string, defaultValue?: any) : any {
    let found = localStorage.getItem(key);
    if (!_.isNil(found)){
      let wrapper : Wrapper = JSON.parse(found) as Wrapper;
      return wrapper && wrapper.value ? wrapper.value : defaultValue;
    } else {
      return defaultValue;
    }
  }

  set(key: string, value: any){
    let wrapper : Wrapper = { value: value };
    localStorage.setItem(key, JSON.stringify(wrapper));
  }
}
