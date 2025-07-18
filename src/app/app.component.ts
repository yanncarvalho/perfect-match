import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  private touchStartY = 0;

  touchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
  }

  touchEnd() {
    this.touchStartY = 0;
  }

  preventPullToRefresh(event: TouchEvent) {
    if (window.scrollY === 0 && event.touches[0].clientY > this.touchStartY) {
      event.preventDefault();
    }
  }
}
