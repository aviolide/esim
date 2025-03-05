import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import {
  CommonModule,
  isPlatformBrowser,
  ViewportScroller,
} from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClientModule } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { select, Store } from '@ngrx/store';
import * as CartActions from '../redux/cart.actions';
import { CartItem, CartState } from '../redux/cart.model';
import { PlanService } from '../service/plan.service';
import { finalize, Observable } from 'rxjs';
import { CartService } from '../service/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sim-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './sim-detail.component.html',
  styleUrl: './sim-detail.component.css',
  providers: [ApiService, PlanService, Title, Meta, CartService],
})
export class SimDetailComponent implements OnInit {
  user$: Observable<CartItem[]>;

  constructor(
    @Inject(PLATFORM_ID) private _platformId: object,
    @Inject(DOCUMENT) private document: Document,
    @Inject(DOCUMENT) private dom: Document,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private apiService: ApiService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private store: Store<{ cart: CartState }>,
    private planService: PlanService,
    private cartService: CartService,
    private ngxService: NgxUiLoaderService
  ) {
    this.user$ = this.store.pipe(select((state) => state.cart.user));
  }
  private sub: any;

  childactiveButton: any;
  dataallowance: any;
  dataallowanceMonthly: any;
  vailditytype: any;
  countryname: any;
  dataallowancetype: any;
  vaildity: any;
  meta_title: any;

  sellingcost: any;
  operatername: any;
  voice_minute: any;
  Finalsellingcost: any;
  flagimage: any;
  Additional: any;
  PriceDiffernece: any;
  YearlySellingcost: any;
  pid: any;
  datanotfound: boolean = false;
  countrynotfound: boolean = false;
  monthlytab: boolean = false;
  ValidityTab: boolean = true;
  // countrynotfound: boolean = false;
  planname: any;
  database_planename: any;
  plandetails: any = [];
  supportedcountries: any = [];
  isMonthlyPlan: boolean = false;
  user: any;
  topupplan: any = [];
  userCart: any;
  isIMEIPlan: boolean = false;
  isHideAddToCartBtn: boolean = false;
  planDetails1: any;
  planType: string = 'traveller';
  eid: any = '';
  imei: any = '';
  travelDate: string = new Date().toISOString().slice(0, 10);
  isTravelDateRequired: boolean = false;


  @ViewChild('authLoginModal') authLoginModal: any;

  popularcountry: any = [];

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user && Object.keys(user).length > 0) {
        this.user = user;
        this.getCartItems();
      }
    });

    this.sub = this.route.params.subscribe((params) => {
      this.planname = params['planname'];
    
      if (isPlatformBrowser(this._platformId)) {
        window.localStorage.setItem('Pageurl', JSON.stringify(this.planname));
      }
    
      this.ngxService.start();
    
      this.apiService.get_data_byPlanName(this.planname).pipe(
        finalize(() => this.ngxService.stop()) // Ensures loader stops whether API succeeds or fails
      ).subscribe({
        next: (data) => {
        
          this.plandetails = data;
          if (!this.plandetails || this.plandetails.length === 0) {
            toast.error('Plan not found or out of stock. Redirecting to home page.');
           this.router.navigateByUrl('/');
          }
    
          let res = this.plandetails[0];
          this.updateMetaTags(res);
          this.initPlanDetails(res);
          this.updateCanonicalUrl(this.planname);
    
          this.dataallowance = res.dataallowance;
          this.countryname = res.countryname;
          this.meta_title = res.meta_title;
          this.dataallowancetype = res.dataallowancetype;
          this.vaildity = res.vaildity;
          this.database_planename = res.planename;
          this.sellingcost = res.sellingcost;
          this.Finalsellingcost = res.sellingcost;
          this.dataallowanceMonthly = res.dataallowanceMonthly;
          this.vailditytype = res.vailditytype;
          this.flagimage = res.flagimage;
          this.operatername = res.operatorname;
          this.YearlySellingcost = res.YearlySellingcost;
          this.PriceDiffernece = res.PriceDiffernece;
          this.Additional = res.addinformation;
          this.voice_minute = res.voice_minute;
          this.pid = res.P_id;
    
          this.apiService.get_Plan_Countries(this.planname).subscribe((data) => {
            this.supportedcountries = data;
    
            if (this.supportedcountries.length === 0) {
              this.countrynotfound = true;
              this.apiService.GetContryWiseJsonData(this.countryname).subscribe((data) => {
                this.popularcountry = data;
              });
            } else {
              this.apiService.RegionWiseJsonData(this.countryname).subscribe((data) => {
                this.popularcountry = data;
              });
            }
          });
    
        },
        error: (error) => {
          console.error('API Error:', error);
          this.ngxService.stop(); // Stops loader in case of API failure
        }
      });
    });
    

    if (isPlatformBrowser(this._platformId)) {
      (window as any).dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      (window as any).dataLayer.push({
        event: 'view_item',
        ecommerce: {
          currency: 'USD',
          value: this.sellingcost,
          items: [
            {
              item_id: this.pid,
              item_name: this.planname,
              affiliation: 'Google Merchandise Store',
              coupon: '',
              discount: 0,
              index: 0,
              item_brand: 'Airbub',
              item_category: 'eSim',

              item_list_id: this.pid,
              item_list_name: this.planname,

              price: this.sellingcost,
              quantity: 1,
            },
          ],
        },
      });
    }
  }

  initPlanDetails(plan: any) {
    // Remove existing plan from local storage
    if (isPlatformBrowser(this._platformId)) {
      window.localStorage.removeItem('plan');
    }

    this.apiService.get_planDetails_Id(plan.P_id).subscribe((data: any) => {
      const planDetails = data[0];

      // Handle missing plan case
      if (!planDetails) {
        this.outOfStock(plan.countryname);
        return;
      }

      // Check if the plan is an IMEI plan based on plan source
      // basically plan source is just like vendor

      if ([3, 5].includes(planDetails.Plan_Source)) {
        this.isIMEIPlan = true;
        this.isHideAddToCartBtn = true;
      }

      // check if the plan is a travel date required

      if (planDetails.is_traveldate == 'Yes') {
        this.isTravelDateRequired = true;
      }

      // check if the plan is a monthly plan

      if ([3, 4, 5, 6].includes(planDetails.DurationType)) {
        this.isHideAddToCartBtn = true;
        this.childactiveButton = '1';
        this.monthlytab = true;
        this.ValidityTab = false;
        this.planType = 'subscription';
      }

      // Assign plan details to the component property
      this.planDetails1 = planDetails;

      // Save country name in local storage for redirection
      if (isPlatformBrowser(this._platformId)) {
        window.localStorage.setItem('redircturl', planDetails.countryname);
      }
    });
  }

  outOfStock(coutryname: string) {
    toast.error('Sim is out of stock');
    this.router.navigateByUrl('/esim/' + coutryname);
  }

  DetailPopularPlan(item: any, el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
    var string = item.PlanName;
    string = string.replace(/ /g, '-');
    this.router.navigateByUrl('/esim-detail/' + string);
  }

  ischildActive(buttonName: any) {
    return this.childactiveButton == buttonName;
  }

  setChildActive(buttonName: number) {
    this.childactiveButton = buttonName;
    if (buttonName == 1) {
      this.Finalsellingcost = this.sellingcost;
      window.localStorage.setItem('pricetype', JSON.stringify('Monthly'));
    } else {
      window.localStorage.setItem('pricetype', JSON.stringify('Yearly'));
      this.Finalsellingcost = this.YearlySellingcost;
    }
  }

  PageRedirect() {
    window.localStorage.setItem('redircturl', this.countryname);

    let string = localStorage.getItem('redircturl') || '';
    string = string.replace(/ /g, '-');
    this.router.navigateByUrl('/esim/' + string);
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Restrict spaces (charCode 32) and non-numeric characters
    if (
      charCode === 32 ||
      (charCode > 31 && (charCode < 48 || charCode > 57))
    ) {
      return false;
    }
    return true;
  }

  getCartItems() {
    this.cartService.getCart().subscribe((res) => {
      this.userCart = res;
    });
  }

  validateField() {
    let isValid = true; // Assume valid initially

    if (Array.isArray(this.userCart) && this.userCart.length >= 3) {
      toast.error('You can add only 3 items in cart');
      return false;
    }

    // Validate IMEI or EID for IMEI Plan
    if (this.isIMEIPlan) {
      if (this.imei === '' && this.eid === '') {
        toast.error('Please enter IMEI or EID number');
        isValid = false; // Mark invalid
      }
    }

    // Validate travel date if required
    if (this.isTravelDateRequired) {
      if (this.travelDate === null) {
        toast.error('Please enter travel date');
        isValid = false; // Mark invalid
      }
    }

    return isValid; // Return true if all validations pass, otherwise false
  }

  buyesim(type: any) {
    if (!this.validateField()) {
      return;
    }
    this.ngxService.start();

    // format travel date to YYYY-MM-DD

    window.localStorage.setItem('route', 'checkout');
    let item = {
      ...this.plandetails[0],
      ...this.planDetails1,
      quantity: 1,
      imei: this.imei,
      eid: this.eid,
    };

    if (this.isTravelDateRequired) {
      item = {
        ...item,
        traveldate: this.travelDate,
      };
    }

    this.store.dispatch(CartActions.addToCart({ item: item }));
    this.cartService.insertCart(item);

    window.localStorage.setItem('plan', this.planType);
    window.localStorage.setItem(
      'currentPlanId',
      JSON.stringify(this.plandetails[0].P_id)
    );

    if (type == 'cart') {
      toast.success('Item added to cart');
      this.store.dispatch(CartActions.toggleCartModal({ isOpen: true }));
      this.ngxService.stop();
      const redircturl = localStorage.getItem('redircturl') || '';
      this.router.navigateByUrl('/esim/' + redircturl);
    } else if (type == 'buy') {
      this.proceedToCheckout();
    }
  }

  proceedToCheckout() {
    if (this.user) {
      this.ngxService.stop();
      this.router.navigate(['/checkout']);
    } else {
      this.store.dispatch(CartActions.toggleCartModal({ isOpen: false }));
      const redircturl = localStorage.getItem('redircturl') || '/';
      this.router.navigateByUrl('/esim/' + redircturl);
      this.authLoginModal.nativeElement.click();
      this.ngxService.stop();
    }
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
    element.setAttribute('rel', 'canonical');
    element.setAttribute(
      'href',
      'https://www.esim.su/esim-detail/' + url
    );
  }

  private updateMetaTags(plan: any): void {
    let planOperator = plan.operatername ?? 'ESimExpress';
    this.titleService.setTitle(
      plan.countryname +
        ' esim at $ ' +
        plan.sellingcost +
        ' | ' +
        plan.dataallowance +
        plan.dataallowancetype +
        ' ' +
        plan.countryname +
        ' eSIM Plan | Buy ' +
        plan.dataallowance +
        plan.dataallowancetype +
        ' ' +
        plan.countryname +
        ' eSIM for ' +
        plan.vaildity +
        ' days from ' +
        planOperator +
        ' - esim.su'
    );

    this.metaService.updateTag({
      name: 'description',
      content:
        'Looking for the best esim plans for travelling to ' +
        plan.countryname +
        '? Buy ' +
        plan.dataallowance +
        plan.dataallowancetype +
        plan.countryname +
        ' e sim for ' +
        plan.sellingcost +
        ' with ' +
        plan.vaildity +
        ' days validity. This ' +
        plan.countryname +
        ' plan provides ' +
        plan.dataallowance +
        plan.dataallowancetype +
        ' data, and unlimited voice and text from ' +
        this.operatername +
        ' for ' +
        plan.vaildity +
        ' days. Check out ESimExpress.com for latest deals, plans and offers for ' +
        plan.countryname +
        ' esim. ',
    });

    this.metaService.updateTag({
      name: 'keywords',
      content:
        `${plan.countryname} eSIM, ${plan.countryname} eSIM plans, ${plan.countryname} prepaid eSIM, ${plan.countryname} eSIM data plans, ${plan.countryname} eSIM for travel,  ${plan.countryname} virtual SIM, ${plan.countryname} electronic SIM card,  Unlimited ${plan.countryname} eSIM, Cheapest ${plan.countryname} eSIM, Best ${plan.countryname} eSIM plans,  ${plan.countryname} eSIM operators, ${plan.countryname} eSIM providers,  ${plan.countryname} eSIM validity, International eSIM for ${plan.countryname}, eSIM with 5G for ${plan.countryname}, 10GB eSIM for ${plan.countryname}, 30-day eSIM for ${plan.countryname}, eSIM for iPhone 14 in ${plan.countryname}, ESimExpress eSIM for ${plan.countryname}, eSIM for international travel, 
        Prepaid eSIM with calling in ${plan.countryname}`.trim(),
    });
    this.updateOGTags(plan);
  }

  updateOGTags(plan: any): void {
    let planName = plan.planename;
    let url = planName.replace(/ /g, '-');

    this.metaService.updateTag({
      property: 'og:title',
      content: `Buy ${plan.countryname} eSIM - Prepaid & Unlimited ${plan.countryname} Travel SIM Cards`,
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: `Travel with unlimited data with our ${plan.countryname} eSIM plans. Instant activation, no SIM card needed.`,
    });
    this.metaService.updateTag({
      property: 'og:image',
      content: 'https://esim.su/assets/icons/global-map.png',
    });

    this.metaService.updateTag({
      property: 'og:image:width',
      content: '1200',
    });

    this.metaService.updateTag({
      property: 'og:image:height',
      content: '630',
    });

    this.metaService.updateTag({
      property: 'og:type',
      content: 'Product',
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.esim.su/esim-detail/' + url,
    });
    this.metaService.updateTag({
      property: 'og:image:alt',
      content: plan.countryname + ' in Global Map',
    });
  }
}
