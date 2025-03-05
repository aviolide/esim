import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ElementRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MarqueeBannerComponent } from '../marquee-banner/marquee-banner.component';
import { NgxSonnerToaster } from 'ngx-sonner';
import { CartComponent } from '../cart/cart.component';
import { CartItem, CartState } from '../../redux/cart.model';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, tap } from 'rxjs';
import { SignupModalComponent } from '../signup-modal/signup-modal.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import * as CartActions from '../../redux/cart.actions';

import SHA1 from 'crypto-js/sha1';
declare let ire: Function;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MarqueeBannerComponent,
    NgxSonnerToaster,
    CartComponent,
    SignupModalComponent,
    NgxUiLoaderModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [ApiService],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  loginDetials: any = [];
  loginguestDetials: any = [];
  response: any = [];
  status = '0';
  name = '0';
  ProfilePhoto = '';
  logoPhoto = '';
  isLoggedIn = false;
  env = environment;
  @ViewChild('cartButton') cartButton!: ElementRef;
  @ViewChild('cookieButton') cookieButton!: ElementRef;
  isClient = false;
  items$: Observable<CartItem[]>;
  user$: Observable<any>;
  user: any;
  private cartSubscription!: Subscription;
  cartItems: CartItem[] = [];
  isModalOpen$: Observable<boolean>;
  private modalSubscription!: Subscription;
  route: any;

  constructor(
    @Inject(PLATFORM_ID) private _platformId: object,
    private router: Router,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private store: Store<{ cart: CartState }>
  ) {
    this.items$ = this.store.pipe(select((state: any) => state.cart.items));
    this.user$ = this.store.pipe(select((state: any) => state.cart.user));

    this.isModalOpen$ = this.store.pipe(
      select((state: any) => state.cart.isModalOpen)
    );
  }

  logout() {
    window.localStorage.clear();
    window.location.href = '/';
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.scrollToTop();
    this.isAndroid();
    this.isiPhone();
    // this.getConsentCookies();

    this.cartSubscription = this.items$.subscribe((items) => {
      this.cartItems = items.filter((item: any) => item.DurationType != 3);
    });

    // Subscribe to modal open state
    this.modalSubscription = this.isModalOpen$
      .pipe(
        tap((isOpen) => {
          if (isOpen && this.cartButton) {
            this.renderer
              .selectRootElement(this.cartButton.nativeElement)
              .click();
          }
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    if (this.cartButton) {
      this.renderer.listen(this.cartButton.nativeElement, 'click', () => {});
    }

    if (this.cookieButton) {
      this.renderer.listen(this.cookieButton.nativeElement, 'click', () => {});
    }
  }

  getUserDetails() {
    this.cartSubscription = this.user$.subscribe((user) => {
      if (user && Object.keys(user).length > 0) {
        this.isLoggedIn = true;
        this.user = user;
        const emailsha1 = SHA1(this.user?.email);
        ire('identify', {
          customerId: this.user.customerid,
          customerEmail: emailsha1,
        });
      }
    });
  }

  isAndroid(): boolean {
    if (isPlatformBrowser(this._platformId)) {
      const userAgent = navigator.userAgent.toLowerCase();
      return userAgent.includes('android');
    }
    return false; // Return false if not in the browser
  }

  isiPhone(): boolean {
    if (isPlatformBrowser(this._platformId)) {
      const userAgent = navigator.userAgent.toLowerCase();
      return userAgent.includes('iphone') || userAgent.includes('ipad');
    }
    return false; // Return false if not in the browser
  }

  goToPage(path: string) {
    this.router.navigate([path]);
    this.store.dispatch(CartActions.toggleCartModal({ isOpen: false }));
  }

  scrollToTop() {
    this.elementRef.nativeElement.ownerDocument.body.scrollTop = 0;
  }

  handleKeydown(event: KeyboardEvent, url: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.goToPage(url);
    }
  }

  openCartModal() {
    if (this.cartButton) {
      this.renderer.selectRootElement(this.cartButton.nativeElement).click();
    }
  }

  agreeCookies() {
    this.apiService.setCookie('cookieConsent', 'true', 365);
  }

  getConsentCookies() {
    let d = this.apiService.getCookie('cookieConsent');

    if (d == '') {
      this.cookieButton &&
        this.renderer
          .selectRootElement(this.cookieButton.nativeElement)
          .click();
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  openAppStore() {
    window.open(
      'https://apps.apple.com/us/app/esimexpress-esim-call-data-plans/id6473274275',
      '_blank'
    );
  }

  openPlayStore() {
    window.open(
      'https://play.google.com/store/apps/details?id=com.esimexpress',
      '_blank'
    );
  }
}
