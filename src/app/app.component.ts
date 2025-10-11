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
    { city: 'Beijing', timezone: 'Asia/Shanghai' },
    { city: 'London', timezone: 'Europe/London' },
    { city: 'New York', timezone: 'America/New_York' },
    { city: 'Los Angeles', timezone: 'America/Los_Angeles' }
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

  sortTimezones() {
    // Sort clocks by their actual datetime (considering timezone, date, and offset)
    this.clocks.sort((a, b) => {
      if (!a.timezone || !b.timezone) return 0;
      
      // Get current time with the offset applied
      const now = new Date();
      const offsetMs = this.timeOffset * 60 * 60 * 1000;
      const adjustedTime = new Date(now.getTime() + offsetMs);
      
      // Get the full datetime string in each timezone
      const dateTimeA = adjustedTime.toLocaleString('en-US', { 
        timeZone: a.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const dateTimeB = adjustedTime.toLocaleString('en-US', { 
        timeZone: b.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      // Parse the datetime strings to create Date objects for comparison
      // Format is typically: "MM/DD/YYYY, HH:mm"
      const parseDateTime = (dateTimeStr: string) => {
        const [datePart, timePart] = dateTimeStr.split(', ');
        const [month, day, year] = datePart.split('/').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes);
      };
      
      const dateA = parseDateTime(dateTimeA);
      const dateB = parseDateTime(dateTimeB);
      
      // Sort descending (furthest ahead in time first)
      return dateB.getTime() - dateA.getTime();
    });
  }
}
