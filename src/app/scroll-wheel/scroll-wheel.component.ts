import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-scroll-wheel',
  templateUrl: './scroll-wheel.component.html',
  styleUrls: ['./scroll-wheel.component.scss']
})
export class ScrollWheelComponent implements OnInit, OnDestroy {
  @Output() timeAdjustment = new EventEmitter<number>();

  currentOffset: number = 0;  // Start at 0hr
  shimmerClass: string = '';
  private shimmerTimeouts: any[] = [];

  ngOnInit(): void {
    this.scheduleShimmers();
  }

  ngOnDestroy(): void {
    this.shimmerTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private scheduleShimmers(): void {
    // Shimmer velocity: Controls how fast the shine sweeps across the button
    const shimmerSweepDurationMs = 9000; // 9 seconds for slow, luxurious gem-like effect
    
    // Timing configuration
    const initialDelayMs = 3000; // First shimmer starts 3 seconds after page load
    let gapBetweenShimmers = 5000; // Initial gap between shimmers (will double each time)
    
    // First shimmer (most dramatic with bulge and bright glow)
    const firstTimeout = setTimeout(() => {
      this.shimmerClass = 'shimmer-first';
      setTimeout(() => {
        this.shimmerClass = '';
      }, shimmerSweepDurationMs);
    }, initialDelayMs);
    this.shimmerTimeouts.push(firstTimeout);
    
    // Subsequent shimmers with exponentially increasing delays
    let currentDelay = initialDelayMs + shimmerSweepDurationMs + gapBetweenShimmers;
    
    for (let i = 0; i < 10; i++) { // Schedule 10 additional shimmers
      const timeout = setTimeout(() => {
        this.shimmerClass = 'shimmer-repeat';
        setTimeout(() => {
          this.shimmerClass = '';
        }, shimmerSweepDurationMs);
      }, currentDelay);
      this.shimmerTimeouts.push(timeout);
      
      gapBetweenShimmers *= 2; // Double the gap for next shimmer
      currentDelay += shimmerSweepDurationMs + gapBetweenShimmers;
    }
  }

  get formattedOffset(): string {
    if (this.currentOffset > 0) {
      return `+${this.currentOffset}`;
    }
    return `${this.currentOffset}`;
  }

  adjustHour(offset: number) {
    this.currentOffset += offset;
    this.timeAdjustment.emit(this.currentOffset);
  }

  reset() {
    this.currentOffset = 0;
    this.timeAdjustment.emit(this.currentOffset);
  }
}
