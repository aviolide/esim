import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.css',
})
export class SitemapComponent {
  countries: any[] = [];
  blogs: any[] = [];
  urls: any[] = [];

  public pages = [
    { url: 'home', pageName: 'Home' },
    { url: 'blogs', pageName: 'Blogs' },
    // { url: 'info/sign-in', pageName: 'Sign In' },
    // { url: 'info/sign-up', pageName: 'Sign Up' },
    { url: 'partners', pageName: 'Become an Enterprise' },
    { url: 'partner-with-us/affiliate-partner', pageName: 'Affiliate Partner' },
    { url: 'partner-with-us/voucher-program', pageName: 'Voucher Program' },
    { url: 'partner-with-us/wholesale-program', pageName: 'Wholesale Program' },
    {
      url: 'partner-with-us/esimexpress-partner-hub',
      pageName: 'ESimExpress Partner Hub',
    },
    { url: 'partner-with-us/api-partner', pageName: 'API Partner' },
    { url: 'esim-api', pageName: 'ESIM API' },
    {
      url: 'partner-with-us/white-label-partner-program',
      pageName: 'White Label Partner Program',
    },
    { url: 'esim-white-label', pageName: 'White Label Partner Program' },
    { url: 'info/Aboutus', pageName: 'About Us' },
    { url: 'info/contactus', pageName: 'Contact Us' },
    { url: 'info/terms', pageName: 'Terms of Use' },
    { url: 'info/policy', pageName: 'Privacy Policy' },
    { url: 'sitemap', pageName: 'Sitemap' },
    { url: 'info/Installation', pageName: 'ESIM Installation' },
    { url: 'info/faq', pageName: 'FAQs' },
    {
      url: 'esim-cards-discount-coupons-codes',
      pageName: 'Discount Coupons & Codes',
    },
    { url: 'free-esim', pageName: 'Free ESIM' },
    { url: 'info/Compatibility', pageName: 'Compatibility' },
    { url: 'info/compatibilityCheck', pageName: 'Compatibility Check' },
    { url: 'info/hub', pageName: 'Hub' },
  ];

  constructor(
    private apiService: ApiService,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom: Document
  ) {}

  ngOnInit(): void {
    this.getCountries();
    this.getBlogs();
    this.titleService.setTitle('Sitemap | ESimExpress');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Explore the sitemap of ESimExpress to easily navigate and discover all our web pages and services, including eSIM solutions and resources.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'ESimExpress sitemap, eSIM solutions, ESimExpress navigation, website sitemap, explore ESimExpress, ESimExpress services, eSIM resources, website structure',
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
    element.setAttribute('href', `https://www.esim.su/sitemap`);
  }

  getCountries() {
    this.apiService.getcountrydata().subscribe((data: any) => {
      this.countries = data;
    });
  }

  getBlogs() {
    this.apiService.get_blog('All', 1).subscribe((data: any) => {
      this.blogs = data;
    });
  }

}
