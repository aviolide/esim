/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-var */
/* eslint-disable id-length */

import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../service/api.service';
import { Title, Meta } from '@angular/platform-browser';
import { Options } from '@angular-slider/ngx-slider';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EsimCountryContentComponent } from '.././components/esim-country-content/esim-country-content.component';
import { SearchComponent } from '.././components/search2/search2.component';

@Component({
  selector: 'app-esim',
  standalone: true,
  imports: [
    RouterModule,
    SearchComponent,
    CommonModule,
    FormsModule,
    HttpClientModule,
    EsimCountryContentComponent,
  ],
  templateUrl: './esim.component.html',
  styleUrl: './esim.component.css',
  providers: [ApiService, Title, Meta],
})
export class EsimComponent implements OnInit {
  countryName: string | undefined;
  plans: any;
  allPlans: any;
  jsonData: any;
  operatorLogo = 'assets/operator-logos/';
  eSimExpressLogo = 'assets/operator-logos/esimexpress.png';
  planType = 'Data & Voice';
  activeFilter = '';
  value = 0;
  highValue = 200;
  options: Options = {
    floor: 0,
    ceil: 200,
  };
  minValue = 0;
  maxValue = 200;
  isMonthlyPlan = false;
  activeTab: any = 'All';
  esimCategory: string = 'country';

  public periodToDays: any = {
    'Monthly ': 31,
    Monthly: 31,
    '30 Days': 30,
    '180 Days': 180,
    '5 Days': 5,
    '7 Days': 7,
    '14 Days': 14,
    '10 Days': 10,
    '15 Days': 15,
    '90 Days': 90,
    '60 Days': 60,
    '3 Month': 90,
    '6 Month': 180,
    '1 Year': 365,
    '2 Year': 730,
  };

  public regional = [
    'Africa',
    'Global',
    'Arab-States',
    'Asia-Pacific',
    'Europe',
    'Middle-east',
    'North-America',
    'South-Latin-America',
    'Regional-eSIMs',
    'Eurasia',
    'Caribbean',
    'Balkans',
  ];
  
  public expandPriceRange = false;

  public dataOnlyTooltip =
    'Stay connected with our eSIM plan offering generous data allowances, perfect for browsing, streaming, and staying online without voice call limits.';
  public dataAndVoiceTooltip =
    'Enjoy the best of both worlds with our eSIM plan, offering substantial data and voice allowances for seamless connectivity and communication.';
  public monthlyTooltip =
    'Opt for our flexible monthly eSIM plan, featuring comprehensive data and voice packages, ideal for those who need consistent connectivity with the freedom to change plans.';
  public familyTooltip =
    'Keep the whole family connected with our eSIM family plan, offering shared data and voice allowances to meet everyone’s needs, ensuring optimal connectivity for all.';
  public studentTooltip =
    'Our student eSIM plan is tailored for academic life, providing generous data and voice allowances to support both study and social activities, ensuring you stay connected on and off campus.';
  public globalTooltip =
    'Stay connected wherever you go with our global eSIM plan, offering comprehensive data and voice packages for international travel, ensuring seamless connectivity and communication worldwide.';

  parentCloseSearch: boolean = false; // Parent's tracking of search state

  constructor(
    private apiService: ApiService,
    private router: ActivatedRoute,
    @Inject(PLATFORM_ID) private _platformId: object,
    // @Inject(DOCUMENT) private dom,

    private titleService: Title,
    private metaService: Meta,
    private el: ElementRef,
    private renderer: Renderer2,
    private route: Router,
    private ngxService: NgxUiLoaderService,
    @Inject(DOCUMENT) private dom: Document
  ) {}

  ngOnInit(): void {
    this.getCountryName();
  }

  getCountryName() {
    this.router.params.subscribe((params) => {
      const countryName = params['countryname'];

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('redircturl', countryName);
      }

      if (this.regional.includes(countryName)) {
        this.esimCategory = 'region';
        this.getRegionalPlans(countryName);
      } else {
        let country = countryName.split('-').join(' ');
        this.getCountryWisePlans(country);
        this.esimCategory = 'country';
      }
      this.countryName = countryName;
      this.updateCanonicalUrl(countryName);
      this.updateMetaTags(countryName);
      this.updateOGTags(countryName);
    });
  }

  getCountryWisePlans(countryName: string) {
    this.ngxService.start();
    this.apiService
      .GetContryWiseJsonData(countryName)
      .subscribe((data: any) => {
        this.jsonData = data['Plans'];
        const plans = data['Plans'];
        this.allPlans = plans;
        this.convertArray(plans);
      });
  }

  getRegionalPlans(region: string) {
    this.ngxService.start();
    this.apiService.RegionWiseJsonData(region).subscribe((data: any) => {
      const plans = data['Plans'];

      this.jsonData = plans;
      this.allPlans = plans;
      this.convertArray(plans);
    });
  }

  convertArray(plans: any[]) {
    const dataAndVoice = plans.filter((x) => x['PlanClass'] == 'voicedata');
    const dataOnly = plans.filter((x) => x['PlanClass'] == 'data');
    const monthly = plans.filter(
      (x) =>
        x['Vaildity'].trim() === 'Monthly' ||
        x['Vaildity'].trim() === 'Monthly Rolling'
    );
    const family = plans.filter((x) => x['DurationSubType'] == '1');
    const student = plans.filter((x) => x['DurationSubType'] == '3');
    const globalPlans = plans.filter(
      (x) => x.PlanSource == '11' && x.Recharge == '2'
    );
    this.plans = [
      { title: 'Data & Voice', data: dataAndVoice },
      { title: 'Global', data: globalPlans },
      { title: 'Data Only', data: dataOnly },
      { title: 'Monthly', data: monthly },
      { title: 'Family', data: family },
      { title: 'Student', data: student },
    ];
    this.setActiveTab();
    this.ngxService.stop();
  }

  setActiveTab() {
    // Retrieve the stored active tab from localStorage, if it exists
    const storedTab =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('activeTab')
        : null;

    // Check if the stored tab exists in plans
    const storedTabData = this.plans.find(
      (plan: any) => plan.title === storedTab
    );

    // If the stored tab is 'Monthly' and its data array is empty, set to 'Data Only'
    if (
      storedTab === 'Monthly' &&
      storedTabData &&
      storedTabData.data.length === 0
    ) {
      this.activeTab = 'Data Only';
    }
    // If the stored tab is valid and has data, set it as active
    else if (storedTabData && storedTabData.data.length > 0) {
      this.activeTab = storedTab;
    }
    // If 'Data & Voice' exists and has data, set it as active
    else if (
      this.plans.some(
        (plan: any) => plan.title === 'Data & Voice' && plan.data.length > 0
      )
    ) {
      this.activeTab = 'Data & Voice';
    }
    // If 'Data Only' exists and has data, set it as active
    else if (
      this.plans.some(
        (plan: any) => plan.title === 'Data Only' && plan.data.length > 0
      )
    ) {
      this.activeTab = 'Data Only';
    }
    // If none of the above conditions are met, set to 'All' or handle as needed
    else {
      this.activeTab = 'All';
    }
  }

  cheapest(filter: string) {
    if (filter == this.activeFilter) {
      this.activeFilter == '';
      this.resetFilter();
    } else {
      this.activeFilter = filter;
      const a = this.allPlans.sort(
        (a: { SellingCost: number }, b: { SellingCost: number }) =>
          a.SellingCost - b.SellingCost
      );
      this.convertArray(a);
    }
  }

  longestValidity(filter: string) {
    if (filter == this.activeFilter) {
      this.activeFilter = '';
      this.resetFilter();
    } else {
      const a = this.allPlans.sort(
        (
          a: { Vaildity: string | number },
          b: { Vaildity: string | number }
        ) => {
          const validityA: any = this.periodToDays[a.Vaildity];
          const validityB: any = this.periodToDays[b.Vaildity];

          return validityB - validityA;
        }
      );
      this.activeFilter = filter;
      this.convertArray(a);
    }
  }

  largetGB(filter: string) {
    if (filter == this.activeFilter) {
      this.activeFilter = '';
      this.resetFilter();
    } else {
      const a = this.allPlans.sort((a: any, b: any) => {
        const dataA = parseInt(a.DataAllowance) || Infinity;
        const dataB = parseInt(b.DataAllowance) || Infinity;

        return dataB - dataA;
      });
      this.activeFilter = filter;
      this.convertArray(a);
    }
  }

  resetFilter() {
    this.activeFilter = '';
    this.options = {
      floor: 0,
      ceil: 200,
    };
    this.minValue = 0;
    this.maxValue = 200;
    if (this.esimCategory == 'country') {
      if (this.countryName) {
        this.getCountryWisePlans(this.countryName);
      }
    } else {
      if (this.countryName) {
        this.getRegionalPlans(this.countryName);
      }
    }
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      this.removeActiveClassFromButtons();
      const offset = element.offsetTop;
      this.renderer.setProperty(document.documentElement, 'scrollTop', offset);
      const buttonId = 'button' + sectionId.slice(-1); // Assuming 'sectionId' follows the format 'sectionX'
      this.renderer.addClass(document.getElementById(buttonId), 'active');
    }
  }

  private removeActiveClassFromButtons() {
    const buttons = document.querySelectorAll('.plan-types button');
    buttons.forEach((button) => {
      this.renderer.removeClass(button, 'active');
    });
  }

  applyFilter() {
    const a = this.allPlans.filter(
      (x: any) =>
        x.SellingCost >= this.minValue && x.SellingCost <= this.maxValue
    );
    this.convertArray(a);
  }

  goToDetails(string: string) {
    const telegramBotUrl = `https://t.me/eSIMExpressBot?start=${encodeURIComponent(string)}`;
    window.open(telegramBotUrl, '_blank');
    // if (string == 'Global Free esim 200MB')
    //   this.route.navigateByUrl('/free-esim');
    // else {
    //   string = string.replace(/ /g, '-');
    //   window.localStorage.setItem('activeTab', this.activeTab);

    //   this.route.navigateByUrl('/esim-detail/' + string);
    // }
  }

  // Function to determine if the tooltip should be visible
  isTooltipVisible(title: string): boolean {
    return [
      'Data & Voice',
      'Data Only',
      'Monthly',
      'Family',
      'Student',
    ].includes(title);
  }

  // Function to get the correct tooltip text based on the title
  getTooltipText(title: string): string {
    switch (title) {
      case 'Data & Voice':
        return this.dataAndVoiceTooltip;
      case 'Data Only':
        return this.dataOnlyTooltip;
      case 'Monthly':
        return this.monthlyTooltip;
      case 'Family':
        return this.familyTooltip;
      case 'Student':
        return this.studentTooltip;
      case 'Global':
        return this.globalTooltip;
      default:
        return '';
    }
  }

  handleTabChange(tab: string): void {
    this.activeTab = tab;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('activeTab', tab);
    }
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/assets/images/esim.png';
  }

  onSearchClosed() {
    this.parentCloseSearch = true;
  }

  updateCanonicalUrl(url: string) {
    const head = this.dom.getElementsByTagName('head')[0];

    var element: HTMLLinkElement | null = this.dom.querySelector(
      `link[rel='canonical']`
    );
    if (element == null) {
      element = this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(element);
    }

    if (element) {
      element.setAttribute('rel', 'canonical');
      element.setAttribute('href', 'https://www.esim.su/esim/' + url);
    }
  }

  private updateMetaTags(countryName: string): void {
    this.titleService.setTitle(
      'Buy eSIM for ' +
        countryName +
        ' - Online Cheapest Unlimited Data Plans Provider - eSIM ' +
        countryName +
        ' Prepaid Plans for Business, Leisure & Study Abroad From $2 | ESimExpress'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Enjoy eSim Data Plans by ESimExpress for ' +
        countryName +
        ' to choose from our Newly launched Monthly Subscription Plans for your long term needs, besides local ' +
        countryName +
        ' eSim Plans for local travel needs in ' +
        countryName +
        '.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'eSim data plan ' +
        countryName +
        ', ESimExpress eSim data plan ' +
        countryName +
        ', esim prepaid plans ' +
        countryName +
        ', esim for ' +
        countryName +
        ' travel esim card ' +
        countryName +
        ', esim ' +
        countryName +
        ', Best esim plan for ' +
        countryName +
        ', buy esim plan in ' +
        countryName +
        ' ',
    });
  }
  updateOGTags(countryName: string): void {
    const title =
      'Buy ' +
      countryName +
      ' eSIM - Prepaid & Unlimited ' +
      countryName +
      ' Travel SIM Cards';
    const description =
      'Travel with unlimited data with our ' +
      countryName +
      ' eSIM plans. Instant activation, no SIM card needed.';

    this.metaService.updateTag({
      property: 'og:title',
      content: title,
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });
    this.metaService.updateTag({
      property: 'og:image',
      content: 'https://www.esim.su/assets/flags/' + countryName + '.svg',
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.esim.su/esim/' + countryName,
    });
    this.metaService.updateTag({
      property: 'og:image:alt',
      content: countryName + ' Flag',
    });
    this.metaService.updateTag({
      property: 'og:type',
      content: 'Product',
    });
    this.metaService.updateTag({
      property: 'og:image:width',
      content: '512',
    });

    this.metaService.updateTag({
      property: 'og:image:height',
      content: '512',
    });
  }
}
