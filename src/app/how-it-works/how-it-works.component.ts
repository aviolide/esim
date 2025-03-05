import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css',
})
export class HowItWorksComponent {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.titleService.setTitle('How eSIM Works | ESimExpress');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Discover how eSIM works and the benefits of using a digital SIM card. Learn how to activate, manage, and switch eSIM profiles effortlessly.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'how esim works, esim setup, digital sim card activation, esim features, esim benefits, esim guide, esim tutorial, esim switching',
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: 'How eSIM Works | ESimExpress',
    });

    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Discover how eSIM works and the benefits of using a digital SIM card. Learn how to activate, manage, and switch eSIM profiles effortlessly.',
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.esim.su/info/HowItWorks',
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
      `https://www.esim.su/info/Compatibility`
    );
  }
}
