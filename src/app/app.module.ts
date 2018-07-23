import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {AmMessageModule} from "./modules/am-message/am-message.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AmMessageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
