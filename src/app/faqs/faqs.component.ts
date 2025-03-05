import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../service/api.service';
import { SearchFaqsComponent } from '../search-faqs/search-faqs.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [SearchFaqsComponent, CommonModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.css',
})
export class FaqsComponent {
  public faqs: any[] | undefined;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private apiService: ApiService,
        @Inject(DOCUMENT) private dom: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.getAllFaqsList();

    this.titleService.setTitle(
      'Frequently Asked Questions (FAQ) | ESimExpress eSIM'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Find answers to all your questions about ESimExpress eSIM. Learn about eSIM compatibility, installation, activation, data plans, and more.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'ESimExpress eSIM FAQ, eSIM questions, eSIM answers, eSIM guide, eSIM compatibility FAQ, eSIM installation FAQ, eSIM activation questions, ESimExpress eSIM help',
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: 'Frequently Asked Questions (FAQ) | ESimExpress eSIM',
    });

    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Find answers to all your questions about ESimExpress eSIM. Learn about eSIM compatibility, installation, activation, data plans, and more.',
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.esim.su/info/faq',
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
    element.setAttribute('href', 'https://www.esim.su/info/faq');
  }

  getAllFaqsList() {
    this.apiService.getAllFaqs().subscribe((res: any) => {
      let data = res.data;
      this.faqs = data.filter((item: any) => {
        return item.category == 'Faq';
      });
    });
  }
}
