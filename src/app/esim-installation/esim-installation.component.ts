import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-esim-installation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './esim-installation.component.html',
  styleUrl: './esim-installation.component.css',
})
export class EsimInstallationComponent {
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  selectedtab: any = 'one';

  ngOnInit() {
    this.titleService.setTitle(
      'ESimExpress eSIM Installation Guide for iOS, Android, and iPad'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Learn how to install ESimExpress eSIM on your iOS, Android, or iPad device. Step-by-step instructions to activate your eSIM and enjoy seamless connectivity.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'ESimExpress eSIM installation guide, iOS eSIM setup, Android eSIM installation, iPad eSIM activation, eSIM how-to, activate eSIM on iPhone, install eSIM on Android, eSIM for iPad',
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: 'ESimExpress eSIM Installation Guide for iOS, Android, and iPad',
    });

    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Learn how to install ESimExpress eSIM on your iOS, Android, or iPad device. Step-by-step instructions to activate your eSIM and enjoy seamless connectivity.',
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.esim.su/info/Installation',
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
    element.setAttribute('href', 'https://www.esim.su/info/Installation');
  }

  tabclick(tab: string) {
    this.selectedtab = tab;
  }
  scrollToIPad() {
    const element = this.elementRef.nativeElement.querySelector('#ipad_view');

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
