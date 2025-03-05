import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'esimexpress';
  name = 'esimexpress';
  showHeader: boolean = true;
  private hiddenRoutes: string[] = [
    '/free-esim',
    '/partners',
    '/checkout-esim',
  ];

  constructor(private router: Router) {
    this.title = 'esimexpress';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !this.hiddenRoutes.includes(event.url);
      }
    });
  }


  ngOnInit() {}
}
