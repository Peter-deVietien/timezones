import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-live-clock',
  templateUrl: './live-clock.component.html',
  styleUrls: ['./live-clock.component.scss']
})
export class LiveClockComponent implements OnInit, OnDestroy, OnChanges {
  @Input() city: string = '';
  @Input() timezone: string = '';

  time: string = '';
  formattedDate: string = '';
  private intervalId: any;

  ngOnInit(): void {
    this.updateTime();
    this.startClock();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // React immediately when city or timezone changes
    if (changes['city'] || changes['timezone']) {
      this.updateTime();
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startClock() {
    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 1000);
  }
  
  updateTime() {
    if (!this.timezone) {
      // Handle empty state gracefully
      this.time = '--:--:--';
      this.formattedDate = 'Enter a city above';
      return;
    }

    const now = new Date();
  
    const timeOptions: Intl.DateTimeFormatOptions = { 
      timeZone: this.timezone, 
      hour: 'numeric', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
  
    this.time = now.toLocaleTimeString('en-US', timeOptions);
  
    // Format the date
    const day = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: this.timezone });
    const month = now.toLocaleDateString('en-US', { month: 'long', timeZone: this.timezone });
    const date = now.toLocaleDateString('en-US', { day: 'numeric', timeZone: this.timezone });
    const suffix = this.getDateSuffix(+date);
  
    this.formattedDate = `${day} ${month} ${date}${suffix}`;
  }

  private getDateSuffix(date: number): string {
    if (date >= 11 && date <= 13) {
      return 'th';
    }
    switch (date % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
}
