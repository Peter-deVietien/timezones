import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit, OnChanges {
  @Input() city: string = '';
  @Input() timezone: string = '';
  @Input() timeOffset: number = 0;  // This is the offset from the simulated "current time"
  @Output() remove = new EventEmitter<void>();

  time: string = '';
  formattedDate: string = '';
  private intervalId: any;
  private hourAdjusted: boolean = false;  // Flag to track if the hour has been adjusted

  private cityTimezones: { [key: string]: string } = {
    tokyo: 'Asia/Tokyo',
    delhi: 'Asia/Kolkata',
    shanghai: 'Asia/Shanghai',
    saopaulo: 'America/Sao_Paulo',
    mexicocity: 'America/Mexico_City',
    cairo: 'Africa/Cairo',
    mumbai: 'Asia/Kolkata',
    beijing: 'Asia/Shanghai',
    dhaka: 'Asia/Dhaka',
    osaka: 'Asia/Tokyo',
    newyork: 'America/New_York',
    karachi: 'Asia/Karachi',
    buenosaires: 'America/Argentina/Buenos_Aires',
    chongqing: 'Asia/Shanghai',
    istanbul: 'Europe/Istanbul',
    kolkata: 'Asia/Kolkata',
    lagos: 'Africa/Lagos',
    kinshasa: 'Africa/Kinshasa',
    manila: 'Asia/Manila',
    riodejaneiro: 'America/Sao_Paulo',
    guangzhou: 'Asia/Shanghai',
    losangeles: 'America/Los_Angeles',
    moscow: 'Europe/Moscow',
    shenzhen: 'Asia/Shanghai',
    lahore: 'Asia/Karachi',
    bangalore: 'Asia/Kolkata',
    paris: 'Europe/Paris',
    bogota: 'America/Bogota',
    jakarta: 'Asia/Jakarta',
    chennai: 'Asia/Kolkata',
    lima: 'America/Lima',
    bangkok: 'Asia/Bangkok',
    hyderabad: 'Asia/Kolkata',
    london: 'Europe/London',
    tehran: 'Asia/Tehran',
    chicago: 'America/Chicago',
    chengdu: 'Asia/Shanghai',
    nagoya: 'Asia/Tokyo',
    hochiminhcity: 'Asia/Ho_Chi_Minh',
    wuhan: 'Asia/Shanghai',
    hongkong: 'Asia/Hong_Kong',
    taipei: 'Asia/Taipei',
    kualalumpur: 'Asia/Kuala_Lumpur',
    hangzhou: 'Asia/Shanghai',
    rio: 'America/Sao_Paulo',
    houston: 'America/Chicago',
    seoul: 'Asia/Seoul',
    berlin: 'Europe/Berlin',
    toronto: 'America/Toronto',
    santiago: 'America/Santiago',
    madrid: 'Europe/Madrid',
    singapore: 'Asia/Singapore',
    yangon: 'Asia/Yangon',
    alexandria: 'Africa/Cairo',
    kiev: 'Europe/Kiev',
    baghdad: 'Asia/Baghdad',
    riyadh: 'Asia/Riyadh',
    saintpetersburg: 'Europe/Moscow',
    sydney: 'Australia/Sydney',
    suzhou: 'Asia/Shanghai',
    johannesburg: 'Africa/Johannesburg'
  };

  ngOnInit(): void {
    this.updateTime();
    this.startClock();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeOffset'] && !changes['timeOffset'].isFirstChange()) {
      clearInterval(this.intervalId);  // Stop the clock from updating every second
      this.hourAdjusted = true;  // Mark that an adjustment has been made
      this.updateTime(true);  // Lock the time after adjusting the hour
    }
  }

  private startClock() {
    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 1000);
  }
  
  updateTime(lockToHour: boolean = false) {
    let now = new Date();
    
    // Apply the time offset
    now.setHours(now.getHours() + this.timeOffset);

    if (this.hourAdjusted) {
      // After hour adjustment, set minutes to 00
      now.setMinutes(0, 0, 0);
    }

    const timeOptions: Intl.DateTimeFormatOptions = { 
      timeZone: this.timezone, 
      hour: '2-digit', 
      minute: '2-digit'
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: this.timezone,
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    
    this.time = now.toLocaleTimeString('en-US', timeOptions);

    // Get the date formatted as "Tuesday May 6th"
    const day = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: this.timezone });
    const month = now.toLocaleDateString('en-US', { month: 'long', timeZone: this.timezone });
    const date = now.getDate();
    const suffix = this.getDateSuffix(date);

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

  updateCityAndTimezone(city: string) {
    this.city = city.trim();  // Trim any extra spaces

    // Replace spaces with proper capitalization for matching
    const formattedCity = city.toLowerCase().replace(/\s+/g, '');
    this.timezone = this.cityTimezones[formattedCity] || '';

    if (this.timezone) {
      this.updateTime();  // Update the clock with the new timezone
    } else {
      console.warn(`Timezone not found for city: ${city}`);
    }
  }

  removeClock() {
    this.remove.emit();
  }
}
