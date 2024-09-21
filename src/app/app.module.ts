import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { ScrollWheelComponent } from './scroll-wheel/scroll-wheel.component';

@NgModule({
  declarations: [
    AppComponent,
    ClockComponent,
    ScrollWheelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
