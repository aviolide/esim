import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [],
  templateUrl: './terms-of-use.component.html',
  styleUrl: './terms-of-use.component.css',
})
export class TermsOfUseComponent implements OnInit {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom: Document
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Terms of Use | ESimExpress');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Read the Terms of Use for ESimExpress, outlining the rules and guidelines for using our eSIM solutions and services. Ensure you understand the conditions before using our services.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'ESimExpress Terms of Use, eSIM terms, ESimExpress service guidelines, user agreement, ESimExpress policies, eSIM usage terms, terms and conditions',
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: 'Terms of Use | ESimExpress',
    });

    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Read the Terms of Use for ESimExpress, outlining the rules and guidelines for using our eSIM solutions and services. Ensure you understand the conditions before using our services.',
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.esim.su/info/terms',
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
    element.setAttribute('href', `https://www.esim.su/info/terms`);
  }
}
