import { Component, Renderer2 } from '@angular/core';
import { EuropeEsimComponent } from '../europe-esim/europe-esim.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-dual-banner',
  standalone: true,
  imports: [CommonModule, EuropeEsimComponent, RouterModule],
  templateUrl: './dual-banner.component.html',
  styleUrl: './dual-banner.component.css',
})
export class DualBannerComponent {

  monthlyPlans() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('activeTab', 'Monthly');
      toast.info('Please select a country to view the plans');
    }
  }
}
