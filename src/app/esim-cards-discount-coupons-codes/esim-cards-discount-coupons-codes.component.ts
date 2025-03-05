import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-esim-cards-discount-coupons-codes',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './esim-cards-discount-coupons-codes.component.html',
  styleUrl: './esim-cards-discount-coupons-codes.component.css',
})
export class EsimCardsDiscountCouponsCodesComponent {
  public faqs = [
    {
      qns: 'How to Apply coupon code?',
      ans: "Just click on 'Reveal CODE,' and you will be redirected to the eSIM plan's page. From there, choose your eSIM plan, and when you proceed to payment, you'll find an option to enter a coupon code. The code will be automatically copied when you click 'Reveal CODE.' Simply paste it into the payment field to apply your discount.",
    },
    {
      qns: 'Can I use 1 coupon two times?',
      ans: 'Yes, you can use the same coupon code multiple times.',
    },
    {
      qns: 'Can I use multiple coupon codes on a single order?',
      ans: 'Generally you can use any one coupon code for eSIM.',
    },
    {
      qns: 'Do coupon codes have an expiration date?',
      ans: 'Yes, each coupon has an expiration date which is mentioned with every code.',
    },
    {
      qns: 'What should I do if my eSIM coupon code isn’t working?',
      ans: 'Ensure that you are trying to use coupon which hasn’t expired and If you’re still having trouble, contact our customer support for assistance at support@esim.su',
    },
  ];

  public couponsList = [
    {
      country: 'Brazil',
      code: 'CARNIVAL2025',
      page: '/esim/Brazil',
      percent: '5%',
    },
    {
      country: 'Albania',
      code: 'ALBANIAESIM5',
      page: '/esim/albania',
      percent: '5%',
    },
    {
      country: 'Brazil',
      code: 'BRAZILESIM5',
      page: '/esim/brazil',
      percent: '5%',
    },
    {
      country: 'Egypt',
      code: 'EGYPTESIM4',
      page: '/esim/egypt',
      percent: '4%',
    },
    {
      country: 'North America',
      code: 'NAMERICA4',
      page: '/esim/North-America',
      percent: '4%',
    },
    {
      country: 'South Africa',
      code: 'SAFRESIM5',
      page: '/esim/south-africa',
      percent: '5%',
    },
    {
      country: 'All countries',
      code: 'ESIMOFFER5',
      page: '/esim/global',
      percent: '5%',
    },

    {
      country: 'USA',
      code: 'USAESIM5',
      page: '/esim/usa',
      percent: '5%',
    },
    {
      country: 'Japan',
      code: 'JPESIM5',
      page: '/esim/japan',
      percent: '5%',
    },
  ];

  selectedCoupon = null as any;

  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.titleService.setTitle(
      'ESimExpress Active eSIM Coupon Codes | Save on Your eSIM Plans'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Discover the latest active ESimExpress eSIM coupon codes and discounts. Save on your eSIM plans with exclusive offers and promotions.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'ESimExpress eSIM coupon codes, active eSIM discounts, ESimExpress promo codes, eSIM offers, save on eSIM, eSIM plans discounts, ESimExpress eSIM deals, latest ESimExpress coupons',
    });

    this.metaService.updateTag({
      property: 'og:title',
      content:
        'ESimExpress Active eSIM Coupon Codes | Save on Your eSIM Plans',
    });

    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Discover the latest active ESimExpress eSIM coupon codes and discounts. Save on your eSIM plans with exclusive offers and promotions.',
    });

    this.metaService.updateTag({
      property: 'og:url',
      content:
        'https://www.esim.su/esim-cards-discount-coupons-codes',
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
      'https://www.esim.su/esim-cards-discount-coupons-codes'
    );
  }

  revealCode(coupon: any) {
    this.clipboard.copy(coupon.code);
    window.open('https://esim.su' + coupon.page, '_blank');
  }

  copyToClipboard(coupon: any) {
    this.clipboard.copy(coupon);
    window.alert('Coupon code copied');
  }

  selectCoupon(coupon: any) {
    this.selectedCoupon = coupon;
  }
}
