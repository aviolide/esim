import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SearchFaqsComponent } from '../../search-faqs/search-faqs.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-faq-details',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, SearchFaqsComponent],
  providers: [ApiService],
  templateUrl: './faq-details.component.html',
  styleUrl: './faq-details.component.css',
})
export class FaqDetailsComponent {
  public faq: any;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let slug = params['slug'];
      if (slug) {
        this.getFAQ(slug);
        this.updateCanonicalLink(slug);
      }
    });
  }

  updateCanonicalLink(slug: string): void {
    const head = this.dom.getElementsByTagName('head')[0];
    var element: HTMLLinkElement | null = this.dom.querySelector(
      `link[rel='canonical']`
    );
    if (element == null) {
      element = this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(element);
    }
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', `https://www.esim.su/info/faq/${slug}`);
  }

  getFAQ(slug: any) {
    this.apiService.getAllFaqs().subscribe((res: any) => {
      let data = res['data'];
      let r = data.filter((item: any) => {
        return item.slug == slug;
      });
      this.faq = r[0];
      this.titleService.setTitle(this.faq.qns + ' | ESimExpress eSIM');
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
        content: this.faq.qns + ' | ESimExpress eSIM',
      });

      this.metaService.updateTag({
        property: 'og:description',
        content: this.faq.ans,
      });

      this.metaService.updateTag({
        property: 'og:url',
        content: `https://www.esim.su/info/faq/${slug}`,
      });
      
    });
  }
}
