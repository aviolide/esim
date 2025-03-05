import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ApiService } from '../service/api.service';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CountriesDialogComponent } from '../components/countries-dialog/countries-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { CartState } from '../redux/cart.model';
import { Store } from '@ngrx/store';
import { select } from '@ngrx/store';
import { Meta, Title } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-free-esim',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    CountriesDialogComponent,
    CarouselModule,
    HttpClientModule,
    NgxUiLoaderModule,
    NgxSonnerToaster,
  ],
  providers: [ApiService],
  templateUrl: './free-esim.component.html',
  styleUrl: './free-esim.component.css',
})
export class FreeEsimComponent implements OnInit {
  tab: string = 'world';
  dialog: boolean = false;
  isLoggedIn: boolean = false;
  user: any = {};
  topupsPlans: any[] = [];
  isValidUser: boolean = false;
  error: any = false;
  isLoading: boolean = false;
  customerId: string | undefined;
  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  otp: FormControl = new FormControl('', [Validators.required]);
  isToggle: boolean = false;
  sourceOfAcquisition: string = '';

  @ViewChild('countryDialog') countryDialog!: ElementRef;
  @ViewChild('howToInstallEsims') howToInstallEsims!: ElementRef;
  @ViewChild('topUpsPlan') topUpsPlan!: ElementRef;
  @ViewChild('hero') hero!: ElementRef;
  @ViewChild('openModal') openModal!: ElementRef;
  @ViewChild('confirmationModal') confirmationModal!: ElementRef;
  @ViewChild('qrModal') qrModal!: ElementRef;

  user$: Observable<any>;
  countries = [
    { id: 1, name: 'Albania' },
    { id: 2, name: 'Algeria' },
    { id: 3, name: 'Andorra' },
    { id: 4, name: 'Armenia' },
    { id: 511, name: 'Austria' },
    { id: 6, name: 'Australia' },
    { id: 7, name: 'Azerbaijan' },
    { id: 8, name: 'Bosnia and Herzegovina' },
    { id: 192, name: 'Brazil' },
    { id: 10, name: 'Belarus' },
    { id: 11, name: 'Belgium' },
    { id: 12, name: 'Bulgaria' },
    { id: 13, name: 'Canada' },
    { id: 144, name: 'China' },
    { id: 15, name: 'Croatia' },

    { id: 16, name: 'Cyprus' },
    { id: 171, name: 'Czech Republic' },
    { id: 18, name: 'Denmark' },
    { id: 19, name: 'Estonia' },

    { id: 21, name: 'Egypt' },
    { id: 20, name: 'Faroe Islands' },
    { id: 22, name: 'Finland' },
    { id: 2311, name: 'France' },
    { id: 24, name: 'French Guiana' },
    { id: 25, name: 'Georgia' },
    { id: 26, name: 'Ghana' },
    { id: 27, name: 'Gibraltar' },
    { id: 28, name: 'Germany' },
    { id: 29, name: 'Greece' },
    { id: 30, name: 'Hungary' },
    { id: 31, name: 'Hong Kong' },
    { id: 32, name: 'Iceland' },
    { id: 33, name: 'Ireland' },
    { id: 23, name: 'India' },
    { id: 101, name: 'Italy' },
    { id: 36, name: 'Israel' },

    { id: 37, name: 'Kazakhstan' },
    { id: 107, name: 'Kuwait' },
    { id: 39, name: 'Kyrgyzstan' },
    { id: 40, name: 'Kenya' },
    { id: 41, name: 'Kosovo' },
    { id: 42, name: 'Latvia' },
    { id: 43, name: 'Lesotho' },
    { id: 44, name: 'Liechtenstein' },
    { id: 45, name: 'Lithuania' },
    { id: 46, name: 'Luxembourg' },
    { id: 47, name: 'Macedonia' },
    { id: 48, name: 'Malta' },
    { id: 49, name: 'Moldova' },
    { id: 17, name: 'Malaysia' },
    { id: 51, name: 'Monaco' },
    { id: 52, name: 'Montenegro' },
    { id: 53, name: 'Morocco' },
    { id: 54, name: 'Nigeria' },
    { id: 130, name: 'Netherlands' },
    { id: 56, name: 'New Zealand' },
    { id: 57, name: 'Norway' },
    { id: 142, name: 'Poland' },
    { id: 59, name: 'Portugal' },
    { id: 60, name: 'Pakistan' },
    { id: 14, name: 'Qatar' },
    { id: 62, name: 'Romania' },
    { id: 63, name: 'Reunion' },
    { id: 64, name: 'Russian Federation' },
    { id: 5, name: 'South Korea' },
    { id: 66, name: 'Serbia' },

    { id: 67, name: 'Slovakia' },
    { id: 68, name: 'Slovenia' },
    { id: 69, name: 'Singapore' },
    { id: 162, name: 'Spain' },
    { id: 71, name: 'Sri Lanka' },

    { id: 72, name: 'Sweden' },
    { id: 73, name: 'Switzerland' },
    { id: 74, name: 'Taiwan' },
    { id: 75, name: 'Thailand' },
    { id: 76, name: 'Tunisia' },
    { id: 77, name: 'Tanzania' },
    { id: 78, name: 'Turkey' },
    { id: 79, name: 'Ukraine' },
    { id: 80, name: 'United Kingdom' },
    { id: 81, name: 'United States' },
    { id: 82, name: 'Uzbekistan' },
    { id: 203, name: 'United Arab Emirates' },
  ];

  test = [];
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private store: Store<{ cart: CartState }>,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.user$ = this.store.pipe(select((state) => state.cart.user));
  }

  update(e: any) {
    this.getTopUpsPlan('2', e.target.value);
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user && user.customerid) {
        this.isLoggedIn = true;
        this.user = user;
        this.customerId = user.customerid;
      }
    });
    this.getTopUpsPlan('1', '0');
    this.saveDefaultGlobalTopupsPlans();
    this.titleService.setTitle('Free eSIM | ESimExpress');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Get your free eSIM now and enjoy the benefits of a digital SIM card. No more physical SIM cards. No more roaming charges. No more hassle.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'free esim, digital sim card, esim, esim card, esim plans, esim data plans, esim top ups',
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: 'Free eSIM | ESimExpress',
    });

    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Get your free eSIM now and enjoy the benefits of a digital SIM card. No more physical SIM cards. No more roaming charges. No more hassle.',
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.esim.su/free-esim',
    });

    const Refsiteurl =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('Refsite')
        : null;
    this.sourceOfAcquisition = Refsiteurl ? JSON.parse(Refsiteurl) : 'ESimExpress';

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
    element.setAttribute('href', `https://www.esim.su/free-esim`);
  }


  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['dialog'] == 'true') {
        this.countryDialog.nativeElement.click();
        this.router.navigate([], {
          queryParams: { dialog: null },
          queryParamsHandling: 'merge',
        });
      }

      if (params['topUp'] == 'true') {
        this.navigateTopupsPlan();
      }
    });
  }

  toggle() {
    this.isToggle = !this.isToggle;
  }

  getQRCode(): void {
    this.email.markAsTouched();

    if (this.email.value === '') {
      return; // Exit without returning a value
    }
    this.ngxLoader.start();
    this.apiService
      .checkFreeEsimUser(this.email.value, this.sourceOfAcquisition)
      .subscribe((res: any) => {
        if (res.status === 2) {
          this.isValidUser = true;
          this.customerId = res.customerid;
          this.error = '';
          toast.success(
            'OTP has been sent to the email. Please check your email.'
          );
        } else {
          this.isValidUser = false;
          this.error = res.message;
        }
        this.ngxLoader.stop();
      });
  }

  confirmOTP(): void {
    this.error = '';
    this.otp.markAsTouched();
    if (this.otp.value === '') {
      return; // Simply exit the function, no need to return a value
    }
    this.ngxLoader.start();

    this.apiService
      .OTPfreVerify(
        this.otp.value,
        this.customerId,
        this.sourceOfAcquisition
      )
      .subscribe((res: any) => {
        if (res.status == 2) {
          toast.error(res.message);
        } else if (
          res.status == 1 &&
          toast.success('Order completed. Please check your email.')
        ) {
          this.qrModal.nativeElement.click();
        } else {
          toast.error(res.message);
        }
        this.ngxLoader.stop();
        this.otp.reset();
      });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      580: {
        items: 3,
      },
      768: {
        items: 4,
      },
    },
    nav: false,
  };

  customOptions2: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    margin: 30,
    center: true,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      580: {
        items: 2,
      },
      768: {
        items: 3.3,
      },
    },
    nav: false,
  };

  handleTabChange = (type: string) => {
    this.tab = type;
  };

  getTopUpsPlan = (flag: string, countryId: string) => {
    this.apiService
      .getTopUpsPlansList(flag, countryId)
      .subscribe((res: any) => {
        this.topupsPlans = res.Table;
        if (res.Table.length === 0) {
          const topupsPlans = localStorage.getItem('topupsPlans');
          this.topupsPlans = topupsPlans ? JSON.parse(topupsPlans) : [];
        }
      });
  };

  saveDefaultGlobalTopupsPlans = () => {
    this.apiService.getTopUpsPlansList('1', '0').subscribe((res: any) => {
      localStorage.setItem('topupsPlans', JSON.stringify(res.Table));
    });
  };

  scrollToSection() {
    this.howToInstallEsims.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  navigateTopupsPlan() {
    this.topUpsPlan.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  navigateHeroSection() {
    this.hero.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  buyNow(item: any) {
    window.localStorage.setItem('selectedTopups', JSON.stringify(item));
    this.router.navigate(['/checkout-esim']);
  }

  handleOpenDialog(plan: any) {
    this.openModal.nativeElement.click();
    window.localStorage.setItem('selectedTopups', JSON.stringify(plan));
  }

  logout() {
    localStorage.removeItem('Guestlogdetails');
    localStorage.removeItem('cusemail');
    this.isLoggedIn = false;
    this.user = {};
    window.location.reload();
  }
}
