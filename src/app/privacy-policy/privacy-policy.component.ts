import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css',
})
export class PrivacyPolicyComponent implements OnInit {
  constructor(
    private titleService: Title,
    private metaService: Meta,
     @Inject(DOCUMENT) private dom: Document,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Privacy Policy | ESimExpress');
    this.metaService.updateTag({
      name: 'description',
      content:
        'View ESimExpress’s Privacy Policy to understand how we handle your personal data, ensure your privacy, and comply with data protection regulations.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'ESimExpress Privacy Policy, data protection, personal data security, ESimExpress privacy practices, GDPR compliance, eSIM privacy, data usage terms',
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: 'Privacy Policy | ESimExpress',
    });

    this.metaService.updateTag({
      property: 'og:description',
      content:
        'View ESimExpress’s Privacy Policy to understand how we handle your personal data, ensure your privacy, and comply with data protection regulations.',
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.esim.su/info/policy',
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
    element.setAttribute('href', `https://www.esim.su/info/policy`);
  }

     
}
