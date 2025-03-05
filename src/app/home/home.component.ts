import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { HeroBannerComponent } from '../components/hero-banner/hero-banner.component';
import { WhyESimExpressComponent } from '../components/why-esimexpress/why-esimexpress.component';
import { AppWidgetComponent } from '../components/app-widget/app-widget.component';
// import { VideoTestimonialComponent } from '../components/video-testimonial/video-testimonial.component';
import { HowItWorksComponent } from '../components/how-it-works/how-it-works.component';
import { EsimCountriesComponent } from '../components/esim-countries/esim-countries.component';
// import { FeatureComponent } from '../components/feature/feature.component';
import { DualBannerComponent } from '../components/dual-banner/dual-banner.component';
import { TestimonialsComponent } from '../components/testimonials/testimonials.component';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ShopOnRibbonComponent } from "../components/shop-on-ribbon/shop-on-ribbon.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroBannerComponent,
    // FeatureComponent,
    DualBannerComponent,
    HowItWorksComponent,
    TestimonialsComponent,
    WhyESimExpressComponent,
    AppWidgetComponent,
    EsimCountriesComponent,
    ShopOnRibbonComponent,
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  ngOnInit() {
    this.titleService.setTitle('Buy eSIM Plans Online | ESimExpress');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Explore ESimExpress for the best eSIM plans with regional and local coverage. Get affordable eSIM solutions for your travel and data needs with a seamless experience.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'eSIM, buy eSIM, regional eSIM, local eSIM, purchase eSIM, eSIM plan, cheapest eSIM data plan, travel eSIM, ESimExpress eSIM, SIM-free solutions',
    });
    this.updateCanonicalLink();
  }


  updateCanonicalLink(): void {
    const head = this.dom.getElementsByTagName('head')[0];
    var element: HTMLLinkElement | null = this.dom.querySelector(
      `link[rel='canonical']`
    );
    if (element == null) {
      element = this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(element);
    }
    element.setAttribute('rel', 'canonical');
    element.setAttribute(
      'href',
      'https://www.esim.su'
    );
  }
  
}

