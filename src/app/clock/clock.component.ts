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
  @Output() cityChange = new EventEmitter<string>();
  @Output() timezoneChange = new EventEmitter<string>();

  time: string = '';
  formattedDate: string = '';

  private cityTimezones: { [key: string]: string } = {
    tokyo: 'Asia/Tokyo',
    delhi: 'Asia/Kolkata',
    shanghai: 'Asia/Shanghai',
    saopaulo: 'America/Sao_Paulo',
    mexicocity: 'America/Mexico_City',
    denver: 'America/Denver',
    phoenix: 'America/Phoenix',
    saltlakecity: 'America/Denver',
    calgary: 'America/Edmonton',
    albuquerque: 'America/Denver',
    elpaso: 'America/Denver',
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeOffset'] || changes['timezone']) {
      this.updateTime();
    }
  }
  
  updateTime() {
    if (!this.timezone) {
      this.time = '--:--';
      this.formattedDate = 'Enter a city';
      return;
    }

    // Create a base time where New York shows 12:00 PM (noon)
    // We'll use today's date for reference
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    
    // Create a string representing today at noon in ISO format (local)
    // Then interpret it as being in the New York timezone
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Parse this as noon in New York time and convert to UTC
    // We create a date that when formatted in NY timezone shows 12:00 PM
    // October 11, 2025: NY is in EDT (UTC-4), so 12:00 PM EDT = 16:00 UTC
    // We need to determine the UTC hour dynamically
    
    // Create reference: what UTC time shows as noon in NY?
    // Test by creating dates and checking
    const testDateUTC = new Date(`${dateStr}T16:00:00Z`); // Try 16:00 UTC (EDT guess)
    const nyTimeStr = testDateUTC.toLocaleString('en-US', { 
      timeZone: 'America/New_York', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    // If it's not 12:00, adjust
    let utcHour = 16;
    if (nyTimeStr.startsWith('13:')) utcHour = 17; // was 1PM, so EST (UTC-5)
    else if (nyTimeStr.startsWith('11:')) utcHour = 15; // was 11AM, adjust up
    
    // Create the base time with correct UTC hour for NY noon
    const baseTime = new Date(`${dateStr}T${String(utcHour).padStart(2, '0')}:00:00Z`);
    
    // Apply the user's time offset (from scroll wheel)
    baseTime.setUTCHours(baseTime.getUTCHours() + this.timeOffset);
  
    const timeOptions: Intl.DateTimeFormatOptions = { 
      timeZone: this.timezone, 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    };
  
    this.time = baseTime.toLocaleTimeString('en-US', timeOptions);
  
    // Handle date change correctly across timezones
    const day2 = baseTime.toLocaleDateString('en-US', { weekday: 'long', timeZone: this.timezone });
    const month2 = baseTime.toLocaleDateString('en-US', { month: 'long', timeZone: this.timezone });
    const date2 = baseTime.toLocaleDateString('en-US', { day: 'numeric', timeZone: this.timezone });
    const suffix = this.getDateSuffix(+date2);
  
    this.formattedDate = `${day2} ${month2} ${date2}${suffix}`;
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

    // Emit the changes back to parent component
    this.cityChange.emit(this.city);
    this.timezoneChange.emit(this.timezone);

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
