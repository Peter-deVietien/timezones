import { Component, ViewChild } from '@angular/core';
import { ScrollWheelComponent } from './scroll-wheel/scroll-wheel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('scrollWheel') scrollWheel!: ScrollWheelComponent;
  title = 'timezones';
  clocks: Array<{ city: string, timezone: string }> = [
    { city: 'New York', timezone: 'America/New_York' },
    { city: 'Houston', timezone: 'America/Chicago' },
    { city: 'Los Angeles', timezone: 'America/Los_Angeles' },
    { city: 'Beijing', timezone: 'Asia/Shanghai' }
  ];
  timeOffset = 0;

  addClock() {
    this.clocks.push({ city: '', timezone: '' });
  }

  removeClock(index: number) {
    this.clocks.splice(index, 1);
  }

  adjustTime(hours: number) {
    this.timeOffset = hours;
  }

  resetTime() {
    this.scrollWheel.reset();
  }
}
