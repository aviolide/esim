import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../service/api.service';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
  FacebookLoginProvider,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { CartState } from '../../redux/cart.model';
import * as CartActions from '../../redux/cart.actions';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.css'],
  standalone: true,
  providers: [
    ApiService,
    SocialAuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '413656158270-67r1lg9bs30p1ug96qbhpnbs3ccvi4oc.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('494174595057014'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class SignupModalComponent implements OnInit {
  isGuestForm = false;
  guestForm!: FormGroup;
  isLoading: boolean = false;
  socialUser!: SocialUser;
  isSignUpFailed = false;
  errorMessage: string | null = null;
  logindata: any;
  loginDetials: any;
  response: any;
  isLoggedIn: boolean = false;

  @ViewChild('closebutton') closebutton: any;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService,
    private router: Router,
    private store: Store<{ cart: CartState }>,
    private ngxLoader: NgxUiLoaderService,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID to check environment
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      const Refsiteurl = localStorage.getItem('Refsite');
      let Refsite;
      if (Refsiteurl) {
        Refsite = JSON.parse(localStorage.getItem('Refsite') || '{}');
      } else {
        Refsite = 'ESimExpress';
      }
      this.ngxLoader.start();
      this.apiService
        .CusotmerSocial_Login(
          this.socialUser.firstName,
          this.socialUser.email,
          this.socialUser.photoUrl,
          Refsite
        )
        .subscribe({
          next: (data) => {
            this.logindata = data;
            if (this.logindata.status == 0 || this.logindata.status == 2) {
              this.errorMessage = this.logindata.message;
              this.isSignUpFailed = true;
            } else if (this.logindata.status == 1) {
              this.procceedToCheckout(this.logindata, 'register');
            }
          },
        });
    });
  }

  initForm() {
    this.guestForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      },
      { validator: this.emailMatchValidator }
    );
  }

  emailMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const email = group.get('email')?.value;
    const confirmEmail = group.get('confirmEmail')?.value;

    return email === confirmEmail ? null : { emailMismatch: true };
  }

  /* Guest Signup Process */

  guestCheckout() {
    this.isLoading = true;
    const email = this.guestForm.value.email;
    this.ngxLoader.start();

    this.apiService
      .Singup_guest('Guest', 'User', email, '', 'ESimExpress')
      .subscribe((res: any) => {
        if (res.status === 1) {
          window.localStorage.setItem('guestUser', JSON.stringify(res));
          this.procceedToCheckout(res, 'guest');
        } else {
          this.ngxLoader.stop();
          toast.error('Invalid email or user does not exist');
        }
      });
  }

  login() {
    if (this.closebutton && this.closebutton.nativeElement) {
      this.closebutton.nativeElement.click();
    }
    this.savePageUrl();
    // this.router.navigate(['/info/sign-in']);
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.savePageUrl();
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  savePageUrl() {
    localStorage.setItem('Pageurl', JSON.stringify('checkout'));
  }

  pushLoginEvent(customerId: string) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'login',
      userId: customerId, // This number must be replaced with an actual User ID
    });
  }

  procceedToCheckout(res: any, type?: string) {
    this.store.dispatch(CartActions.setUser({ user: { ...res, accountType: type } }));
    this.ngxLoader.stop();
    this.closebutton.nativeElement.click();
    this.pushLoginEvent(res.customerid);
    this.router.navigate(['/cart-sync']);
  }
}
