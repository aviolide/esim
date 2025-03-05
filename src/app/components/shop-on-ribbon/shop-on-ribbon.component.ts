import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-shop-on-ribbon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-on-ribbon.component.html',
  styleUrl: './shop-on-ribbon.component.css',
})
export class ShopOnRibbonComponent {
  activeIndex = 0;

  public data = [
    {
      logo: 'lazada.png',
      name: 'Lazada',
      tagline: '“Go Where Your Heart Beats”',
      link: 'https://www.lazada.sg/shop/esimexpress/?spm=a2o42.pdp_revamp.seller.1.3fdd1838paiE7N&itemId=3125282584&channelSource=pdp',
      color: '#f57224',
    },
  ];

  setActiveIndex(index: number) {
    this.activeIndex = index;
  }

  visit(link: string) {
    window.open(link, '_blank');
  }
}
