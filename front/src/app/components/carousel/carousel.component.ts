import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef;
  @ViewChild('list') list!: ElementRef;
  @ViewChild('nextBtn') nextBtn!: ElementRef;
  @ViewChild('prevBtn') prevBtn!: ElementRef;
  @ViewChild('runningTime') runningTime!: ElementRef;

  timeRunning: number = 3000;
  timeAutoNext: number = 7000;
  runNextAuto: any;
  runTimeOut: any;

  ngAfterViewInit() {
    this.resetTimeAnimation();
    this.runNextAuto = setTimeout(() => {
      this.nextBtn.nativeElement.click();
    }, this.timeAutoNext);

    this.nextBtn.nativeElement.onclick = () => this.showSlider('next');
    this.prevBtn.nativeElement.onclick = () => this.showSlider('prev');
  }

  resetTimeAnimation() {
    const runningTimeEl = this.runningTime.nativeElement;
    runningTimeEl.style.animation = 'none';
    runningTimeEl.offsetHeight; // Trigger reflow
    runningTimeEl.style.animation = null;
    runningTimeEl.style.animation = 'runningTime 7s linear 1 forwards';
  }

  showSlider(type: string) {
    const sliderItemsDom = this.list.nativeElement.querySelectorAll('.item');
    if (type === 'next') {
      this.list.nativeElement.appendChild(sliderItemsDom[0]);
      this.carousel.nativeElement.classList.add('next');
    } else {
      this.list.nativeElement.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
      this.carousel.nativeElement.classList.add('prev');
    }

    clearTimeout(this.runTimeOut);

    this.runTimeOut = setTimeout(() => {
      this.carousel.nativeElement.classList.remove('next');
      this.carousel.nativeElement.classList.remove('prev');
    }, this.timeRunning);

    clearTimeout(this.runNextAuto);
    this.runNextAuto = setTimeout(() => {
      this.nextBtn.nativeElement.click();
    }, this.timeAutoNext);

    this.resetTimeAnimation();
  }
}
