import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sitemap-generator',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  providers:[ApiService],
  templateUrl: './sitemap-generator.component.html',
  styleUrl: './sitemap-generator.component.css',
})
export class SitemapGeneratorComponent {
 
  urls: any[] = [];
  isLoading = false;

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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getAllUrls();
  }

  getAllUrls() {
    let urls: any = [];
    this.apiService.GetAllPlanJsonData().subscribe((data: any) => {
      let r = data.map((x: any) => ({
        url: 'https://www.esim.su/esim-detail/' + x.planename,
      }));
      urls.push(r);
    });

    this.apiService.getcountrydata().subscribe((data: any) => {
      let r = data.map((x: any) => ({
        url:
          'https://www.esim.su/esim/' + x.CountryName.replace(/ /g, '-'),
      }));
      urls.push(r);
    });

    this.apiService.getregionaldata().subscribe((data: any) => {
      let r = data.map((x: any) => ({
        url:
          'https://www.esim.su/esim/' + x.regionName.replace(/ /g, '-'),
      }));
      urls.push(r);
    });

    this.apiService.get_blog('All', 1).subscribe((data: any) => {
      let r = data.map((x: any) => ({
        url: 'https://www.esim.su/blogs/' + x.Slug,
      }));
      urls.push(r);
    });

    this.apiService.getAllFaqs().subscribe((data: any) => {
      let r = data.data.map((x: any) => ({
        url: 'https://www.esim.su/info/faq/' + x.slug,
      }));
      urls.push(r);
    });

    this.urls = urls;
  }

  generateSitemap() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    this.pages.forEach((page) => {
      xml += `\n<url><loc>https://www.esim.su/${page.url}</loc></url>`;
    });
    this.urls.forEach((url) => {
      url.forEach((u: any) => {
        xml += `\n<url><loc>${u.url}</loc></url>`;
      });
    });
    xml += `\n</urlset>`;
    return xml;
  }

  downloadSitemap() {
    this.isLoading = true;
    const xml = this.generateSitemap();
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    window.URL.revokeObjectURL(url);
    this.isLoading = false;
  }
}
