import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-esim-compatible-devices',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './esim-compatible-devices.component.html',
  styleUrl: './esim-compatible-devices.component.css',
})
export class EsimCompatibleDevicesComponent {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom: Document,
  ) {}

  public phones: { [company: string]: string[] } = {
    Apple: [
      'iPhone 16',
      'iPhone 16 Plus',
      'iPhone 16 Pro',
      'iPhone 16 Pro Max',
      'iPhone 15',
      'iPhone 15 Plus',
      'iPhone 15 Pro',
      'iPhone 15 Pro Max',
      'iPhone 14',
      'iPhone 14 Plus',
      'iPhone 14 Pro',
      'iPhone 14 Pro Max',
      'iPhone SE3 (2022)',
      'iPhone 13',
      'iPhone 13 Pro',
      'iPhone 13 Pro Max',
      'iPhone 13 Mini',
      'iPhone 12',
      'iPhone 12 Pro',
      'iPhone 12 Pro Max',
      'iPhone 12 Mini',
      'iPhone 11',
      'iPhone 11 Pro',
      'iPhone 11 Pro Max',
      'iPhone SE2 (2020)',
      'iPhone XR',
      'iPhone XS',
      'iPhone XS Max',
      'iPhone SE (2022)',
      'iPhone 13 mini',
      'iPhone 12 mini',
      'iPhone XRx',
      'iPhone SE 2 (2020)',
      'iPad Pro (2018 and onwards)',
      'iPad Air',
      'Apple Watch series 3',
      'Apple Watch series 4',
      'Apple Watch series 5',
      'Apple Watch series 6',
      'iPad Pro 11" (model A2068, from 2020)',
      'iPad Pro 12.9" (model A2069, from 2020)',
      'iPad (model A2198, from 2019)',
      'iPad Mini (model A2124, from 2019)',
      '(Recommended iOS version: iOS 13.3 or later)',
    ],
    Samsung: [
      'Samsung Galaxy S23 5G',
      'Samsung Galaxy S23 Ultra 5G',
      'Samsung Galaxy S23+ 5G',
      'Samsung Galaxy S22 5G',
      'Samsung Galaxy S22 Ultra 5G',
      'Samsung Galaxy S22+ 5G',
      'Samsung Galaxy S21 5G',
      'Samsung Galaxy S21 Ultra 5G',
      'Samsung Galaxy S21+ 5G',
      'Samsung Galaxy S20',
      'Samsung Galaxy S20+',
      'Samsung Galaxy S20 Ultra 5G',
      'Samsung Galaxy Note 20',
      'Samsung Galaxy Note 20+',
      'Samsung Galaxy Note 20 Ultra',
      'Samsung Galaxy Note 20 FE',
      'Samsung Galaxy Note 20 FE 5G',
      'Samsung Galaxy Note 20 Ultra',
      'Samsung Galaxy Note 20 Ultra 5G',
      'Samsung Galaxy Fold',
      'Samsung Galaxy Z Fold 2',
      'Samsung Galaxy Z Fold 3',
      'Samsung Galaxy Z Fold 4',
      'Samsung Galaxy Z Fold 5',
      'Samsung Galaxy Z Flip',
      'Samsung Galaxy Z Flip 3 5G',
      'Samsung Galaxy Z Flip 4',
      'Samsung Galaxy Z Flip 5',
      'Samsung Galaxy Z Flip',
      'Galaxy Z Flip 5G',
      'Samsung Galaxy Z Flip3 5G',
      'Samsung Galaxy Z Flip4',
      'Samsung Galaxy Fold',
      'Samsung Galaxy Z Fold2 5G',
      'Samsung Galaxy Z Fold3 5G',
      'Samsung Galaxy Z Fold4',
      'Samsung Galaxy S20',
      'Samsung Galaxy S21',
      'Samsung Galaxy S22',
      'Galaxy S22+',
      'Samsung Galaxy S22 Ultra',
      'Samsung Galaxy Note 20 Ultra 5G',
      'Samsung galaxy A54 5g',
      'Samsung galaxy S20+ 5G',
      'Samsung S20 ultra',
      'Samsung S20 ultra 5G',
      'Samsung S21 +5G',
      'Samsung S21 ultra 5g',
      'Samsung galaxy note 20',
      'Samsung galaxy S23',
      'Samsung S23+',
      'Samsung galaxy S23ultra',
    ],
    Google: [
      'Google Pixel 7',
      'Google Pixel 7a',
      'Google Pixel 7 Pro',
      'Google Pixel 6',
      'Google Pixel 6a',
      'Google Pixel 6 Pro',
      'Google Pixel 5',
      'Google Pixel 5a',
      'Google Pixel 4',
      'Google Pixel 4a',
      'Google Pixel 4XL',
      'Google Pixel 3',
      'Google Pixel 3XL',
      'Google Pixel 3a',
      'Google Pixel 3aXL',
      'Google Pixel 7 Pro',
      'Google Pixel 7',
      'Google Pixel 6 Pro',
      'Google Pixel 6a',
      'Google Pixel 6',
      'Google Pixel 5',
      'Google Pixel 4',
      'Google Pixel 4a',
      'Google Pixel 4 XL',
      'Google Pixel 3',
      'Google Pixel 3 XL',
      'Google Pixel 3a',
      'Google Pixel 3a XL',
    ],
    Huawei: ['Huawei Mate 40 Pro', 'Huawei P40', 'Huawei P40 Pro'],
    Motorola: [
      'Motorola Razr 5G',
      'Motorola Razr',
      'Motorola edge ++',
      'Motorola edge 40 pro',
    ],
    NuuMobile: ['Nuu Mobile X5'],
    Planet: ['Planet Computers Gemini PDA'],
    Rakuten: [
      'Rakuten Mobile Big-S',
      'Rakuten Mobile Rakuten Mini',
      'Rakuten Mobile Big',
      'Rakuten Mobile Hand 5G',
    ],
    Honor: ['Honor Magic 4 Pro'],
    Xiaomi: ['Xiaomi 12T Pro', 'Xiaomi Xiomi 13', 'Xiaomi Xiomi 13 Lite'],
    Sharp: ['Sharp Aquos Sense6s', 'Sharp Aquos Wish'],
    HAMMER: ['HAMMER Blade 3', 'Hammer Blade 5G', 'HAMMER Explorer Pro'],
    Nokia: ['Nokia XR 21', 'Nokia X30'],

    Oppo: [
      'Oppo Find X3 Pro',
      'Oppo Reno 5 A',
      'Oppo Reno6 Pro 5G',
      'Oppo Find X5',
      'Oppo Find X5 Pro',
      'Oppo A55s 5G',
    ],
    Sony: [
      'Sony Xperia 10 III Lite',
      'Sony Xperia 10 IV',
      'Sony Xperia 1 IV',
      'Sony Xperia 5 IV',
      'Sony Xperia 1V',
    ],
    Others: [
      'Surface Duo',
      'Gemini PDA',
      'Android Tablets',
      'DOOGEE V30',
      'One plus 11',
      'myPhone NoweSIM',
    ],
  };

  public carrierLockedDevices = [
    'Huawei P30 series',
    'Huawei Mate series (10, 20 Pro etc)',
    'Xiaomi Redmi Note series (9 Pro, 9T etc)',
    'Xiaomi Devices (Poco F3, 12T etc)',
    'Oppo Devices',
    'Surface Duo Devices',
    'OnePlus Nord',
    'Sony Xperia',
    'Asus Rog',
  ];

  public samsungCarrierLockedDevices = [
    'All Samsung S20 FE/S21 FE models (Other S20 & S21 models can be compatible with eSIM.)',
    'USA versions of Samsung S20/S21 and Galaxy Z Flip 5G',
    'USA and Hong Kong versions of Samsung Note 20 Ultra and Samsung Galaxy Z Fold 2',
    'South Korea versions of most Samsung devices (Released after Samsung Galaxy Z Flip 4 and Samsung Galaxy Z Fold 4 are eSIM compatible.)',
    'Canada and USA version of Samsung S21 series devices (except for FE models) may have eSIM capability as long as the One UI 4 update is installed.',
    'Samsung Galaxy Note 9, Note 10, Note 10+ or Note Lite',
    'Samsung Galaxy S10, S10e, S10 Lite or S10+',
    'Samsung S9 or S9+',
    'Samsung S8 or S8+',
    'Samsung S7',
    'Samsung A series (A20, A21, A22, A23, A30, A52)',
    'Samsung Note 20 Ultra and Samsung Galaxy Z Fold 2 from USA and Hong Kong',
  ];

  public iphoneCarrierLockedModels = [
    'iPhone Purchased from Mainland China, Hong Kong, Macao',
    '(Hong Kong and Macao versions have exceptions that support eSIM such as iPhone XS, iPhone SE (2nd and 3rd generation only), iPhone 12 mini, and iPhone 13 mini.)',
    'iPhone 6',
    'iPhone 7 series',
    'iPhone 8 series',
    'iPhone X',
    'iPhone SE 1st Generation',
  ];

  public googlePixelCarrierLockedModels = [
    'Pixel 3 models manufactured from Australia, Taiwan, and Japan',
    'Pixel 3 models bought from US or Canadian carriers other than Sprint and Google Fi',
    'Pixel 3a models bought in South East Asia and with Verizon service',
  ];

  public recommendedIOSVersion = 'iOS 13.3 or later';

  searchText: string = '';
  searchResults: any[] = [];

  ngOnInit() {
    this.titleService.setTitle(
      'ESimExpress eSIM Compatible Devices | Check Your Device Compatibility'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Find out if your smartphone or device is compatible with ESimExpress eSIMs. Check the list of supported devices and start enjoying seamless connectivity.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'ESimExpress eSIM compatible devices, supported eSIM devices, eSIM phone compatibility, ESimExpress eSIM smartphones, eSIM-ready devices, check eSIM compatibility',
    });

    this.metaService.updateTag({
      property: 'og:title',
      content:
        'ESimExpress eSIM Compatible Devices | Check Your Device Compatibility',
    });

    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Find out if your smartphone or device is compatible with ESimExpress eSIMs. Check the list of supported devices and start enjoying seamless connectivity.',
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.esim.su/info/compatibilityCheck',
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
      'https://www.esim.su/info/compatibilityCheck'
    );
  }

}
