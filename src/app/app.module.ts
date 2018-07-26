import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AmMessageModule} from "./modules/am-message/am-message.module";
import {AmUaaModule, UaaConfig} from "@bi8/am-uaa";
import {HttpClientModule} from "@angular/common/http";

const uaaConfig: UaaConfig = {};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AmMessageModule,
    AmUaaModule,
    HttpClientModule
  ],
  providers: [
    { provide: 'UaaConfig', useValue: uaaConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
