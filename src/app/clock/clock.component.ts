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
  suggestions: string[] = [];
  showSuggestions: boolean = false;

  private cityTimezones: { [key: string]: string } = {
    // North America - US
    newyork: 'America/New_York',
    losangeles: 'America/Los_Angeles',
    chicago: 'America/Chicago',
    houston: 'America/Chicago',
    phoenix: 'America/Phoenix',
    philadelphia: 'America/New_York',
    sanantonio: 'America/Chicago',
    sandiego: 'America/Los_Angeles',
    dallas: 'America/Chicago',
    sanjose: 'America/Los_Angeles',
    austin: 'America/Chicago',
    jacksonville: 'America/New_York',
    fortworth: 'America/Chicago',
    columbus: 'America/New_York',
    charlotte: 'America/New_York',
    sanfrancisco: 'America/Los_Angeles',
    indianapolis: 'America/Indiana/Indianapolis',
    seattle: 'America/Los_Angeles',
    denver: 'America/Denver',
    washington: 'America/New_York',
    boston: 'America/New_York',
    elpaso: 'America/Denver',
    nashville: 'America/Chicago',
    detroit: 'America/Detroit',
    portland: 'America/Los_Angeles',
    lasvegas: 'America/Los_Angeles',
    memphis: 'America/Chicago',
    baltimore: 'America/New_York',
    milwaukee: 'America/Chicago',
    albuquerque: 'America/Denver',
    tucson: 'America/Phoenix',
    fresno: 'America/Los_Angeles',
    mesa: 'America/Phoenix',
    sacramento: 'America/Los_Angeles',
    atlanta: 'America/New_York',
    kansascity: 'America/Chicago',
    miami: 'America/New_York',
    raleigh: 'America/New_York',
    omaha: 'America/Chicago',
    minneapolis: 'America/Chicago',
    tulsa: 'America/Chicago',
    cleveland: 'America/New_York',
    neworleans: 'America/Chicago',
    
    // North America - Canada
    toronto: 'America/Toronto',
    montreal: 'America/Toronto',
    vancouver: 'America/Vancouver',
    calgary: 'America/Edmonton',
    edmonton: 'America/Edmonton',
    ottawa: 'America/Toronto',
    winnipeg: 'America/Winnipeg',
    quebec: 'America/Toronto',
    hamilton: 'America/Toronto',
    halifax: 'America/Halifax',
    
    // North America - Mexico
    mexicocity: 'America/Mexico_City',
    guadalajara: 'America/Mexico_City',
    monterrey: 'America/Monterrey',
    puebla: 'America/Mexico_City',
    tijuana: 'America/Tijuana',
    cancun: 'America/Cancun',
    
    // Central America
    guatemala: 'America/Guatemala',
    sanjosecr: 'America/Costa_Rica',
    costarica: 'America/Costa_Rica',
    panama: 'America/Panama',
    sansalvador: 'America/El_Salvador',
    managua: 'America/Managua',
    
    // Caribbean
    havana: 'America/Havana',
    kingston: 'America/Jamaica',
    sanjuan: 'America/Puerto_Rico',
    
    // South America
    saopaulo: 'America/Sao_Paulo',
    buenosaires: 'America/Argentina/Buenos_Aires',
    riodejaneiro: 'America/Sao_Paulo',
    lima: 'America/Lima',
    bogota: 'America/Bogota',
    santiago: 'America/Santiago',
    caracas: 'America/Caracas',
    brasilia: 'America/Sao_Paulo',
    quito: 'America/Guayaquil',
    montevideo: 'America/Montevideo',
    asuncion: 'America/Asuncion',
    lapaz: 'America/La_Paz',
    
    // Europe - Western
    london: 'Europe/London',
    paris: 'Europe/Paris',
    madrid: 'Europe/Madrid',
    barcelona: 'Europe/Madrid',
    lisbon: 'Europe/Lisbon',
    dublin: 'Europe/Dublin',
    brussels: 'Europe/Brussels',
    amsterdam: 'Europe/Amsterdam',
    
    // Europe - Central
    berlin: 'Europe/Berlin',
    rome: 'Europe/Rome',
    vienna: 'Europe/Vienna',
    zurich: 'Europe/Zurich',
    prague: 'Europe/Prague',
    budapest: 'Europe/Budapest',
    warsaw: 'Europe/Warsaw',
    munich: 'Europe/Berlin',
    milan: 'Europe/Rome',
    hamburg: 'Europe/Berlin',
    copenhagen: 'Europe/Copenhagen',
    stockholm: 'Europe/Stockholm',
    oslo: 'Europe/Oslo',
    
    // Europe - Eastern
    moscow: 'Europe/Moscow',
    istanbul: 'Europe/Istanbul',
    kiev: 'Europe/Kiev',
    bucharest: 'Europe/Bucharest',
    athens: 'Europe/Athens',
    helsinki: 'Europe/Helsinki',
    saintpetersburg: 'Europe/Moscow',
    sofia: 'Europe/Sofia',
    minsk: 'Europe/Minsk',
    
    // Middle East
    dubai: 'Asia/Dubai',
    riyadh: 'Asia/Riyadh',
    tehran: 'Asia/Tehran',
    baghdad: 'Asia/Baghdad',
    jerusalem: 'Asia/Jerusalem',
    telaviv: 'Asia/Tel_Aviv',
    beirut: 'Asia/Beirut',
    damascus: 'Asia/Damascus',
    doha: 'Asia/Qatar',
    kuwait: 'Asia/Kuwait',
    muscat: 'Asia/Muscat',
    amman: 'Asia/Amman',
    
    // Africa
    cairo: 'Africa/Cairo',
    lagos: 'Africa/Lagos',
    kinshasa: 'Africa/Kinshasa',
    johannesburg: 'Africa/Johannesburg',
    nairobi: 'Africa/Nairobi',
    casablanca: 'Africa/Casablanca',
    addisababa: 'Africa/Addis_Ababa',
    accra: 'Africa/Accra',
    daressalaam: 'Africa/Dar_es_Salaam',
    capetown: 'Africa/Johannesburg',
    tunis: 'Africa/Tunis',
    algiers: 'Africa/Algiers',
    alexandria: 'Africa/Cairo',
    khartoum: 'Africa/Khartoum',
    abidjan: 'Africa/Abidjan',
    
    // Asia - East
    tokyo: 'Asia/Tokyo',
    seoul: 'Asia/Seoul',
    beijing: 'Asia/Shanghai',
    shanghai: 'Asia/Shanghai',
    hongkong: 'Asia/Hong_Kong',
    taipei: 'Asia/Taipei',
    osaka: 'Asia/Tokyo',
    guangzhou: 'Asia/Shanghai',
    shenzhen: 'Asia/Shanghai',
    chengdu: 'Asia/Shanghai',
    chongqing: 'Asia/Shanghai',
    tianjin: 'Asia/Shanghai',
    wuhan: 'Asia/Shanghai',
    hangzhou: 'Asia/Shanghai',
    nanjing: 'Asia/Shanghai',
    nagoya: 'Asia/Tokyo',
    sapporo: 'Asia/Tokyo',
    fukuoka: 'Asia/Tokyo',
    busan: 'Asia/Seoul',
    
    // Asia - South
    delhi: 'Asia/Kolkata',
    mumbai: 'Asia/Kolkata',
    bangalore: 'Asia/Kolkata',
    kolkata: 'Asia/Kolkata',
    chennai: 'Asia/Kolkata',
    hyderabad: 'Asia/Kolkata',
    pune: 'Asia/Kolkata',
    ahmedabad: 'Asia/Kolkata',
    karachi: 'Asia/Karachi',
    lahore: 'Asia/Karachi',
    dhaka: 'Asia/Dhaka',
    islamabad: 'Asia/Karachi',
    kathmandu: 'Asia/Kathmandu',
    colombo: 'Asia/Colombo',
    
    // Asia - Southeast
    bangkok: 'Asia/Bangkok',
    singapore: 'Asia/Singapore',
    jakarta: 'Asia/Jakarta',
    manila: 'Asia/Manila',
    hanoi: 'Asia/Bangkok',
    hochiminhcity: 'Asia/Ho_Chi_Minh',
    kualalumpur: 'Asia/Kuala_Lumpur',
    yangon: 'Asia/Yangon',
    phnompenh: 'Asia/Phnom_Penh',
    vientiane: 'Asia/Vientiane',
    
    // Asia - Central
    tashkent: 'Asia/Tashkent',
    almaty: 'Asia/Almaty',
    bishkek: 'Asia/Bishkek',
    
    // Oceania
    sydney: 'Australia/Sydney',
    melbourne: 'Australia/Melbourne',
    brisbane: 'Australia/Brisbane',
    perth: 'Australia/Perth',
    adelaide: 'Australia/Adelaide',
    auckland: 'Pacific/Auckland',
    wellington: 'Pacific/Auckland',
    fiji: 'Pacific/Fiji',
    
    // Aliases and common variations
    newyorkcity: 'America/New_York',
    nyc: 'America/New_York',
    la: 'America/Los_Angeles',
    sf: 'America/Los_Angeles',
    dc: 'America/New_York',
    hk: 'Asia/Hong_Kong',
    rio: 'America/Sao_Paulo',
    suzhou: 'Asia/Shanghai',
    saltlakecity: 'America/Denver'
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
      hour: '2-digit', 
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

  onCityInput(city: string) {
    this.city = city;
    
    if (!city || city.length < 1) {
      this.suggestions = [];
      this.showSuggestions = false;
      return;
    }

    // Filter cities that start with the input
    const searchTerm = city.toLowerCase().replace(/\s+/g, '');
    this.suggestions = Object.keys(this.cityTimezones)
      .filter(cityKey => cityKey.startsWith(searchTerm))
      .map(cityKey => this.formatCityName(cityKey))
      .slice(0, 10); // Limit to 10 suggestions
    
    this.showSuggestions = this.suggestions.length > 0;
  }

  selectCity(selectedCity: string) {
    this.city = selectedCity;
    this.showSuggestions = false;
    this.updateCityAndTimezone(selectedCity);
  }

  formatCityName(cityKey: string): string {
    // Convert city key back to a readable format
    // Simple capitalization for display
    return cityKey
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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

  hideSuggestions() {
    // Delay hiding to allow click events to register
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  removeClock() {
    this.remove.emit();
  }
}
