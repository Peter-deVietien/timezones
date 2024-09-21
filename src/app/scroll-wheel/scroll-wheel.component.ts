import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-scroll-wheel',
  templateUrl: './scroll-wheel.component.html',
  styleUrls: ['./scroll-wheel.component.scss']
})
export class ScrollWheelComponent {
  @Output() timeAdjustment = new EventEmitter<number>();

  currentOffset: number = 0;  // Start at 0hr

  adjustHour(offset: number) {
    this.currentOffset += offset;
    this.timeAdjustment.emit(this.currentOffset);
  }
}
