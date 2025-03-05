import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-marquee-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './marquee-banner.component.html',
  styleUrl: './marquee-banner.component.css'
})
export class MarqueeBannerComponent {
  isShowHeader: boolean = true;

  close(){
    this.isShowHeader = false;
  }
}
