import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
  FacebookLoginProvider,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { HttpClientModule } from '@angular/common/http';
import { CartState } from '../../redux/cart.model';
import { Store } from '@ngrx/store';
import * as CartActions from '../../redux/cart.actions';
import { toast } from 'ngx-sonner';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
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
            provider: new FacebookLoginProvider('909052724362759'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
})
export class LoginFormComponent implements OnInit {
  provider: string = '';
  id: string = '';
  email: string = '';
  name: string = '';
  image: string = '';
  token?: string;
  idToken?: string;
  isLoggedin?: boolean;
  socialUser!: SocialUser;
  loading: boolean = false;
  form: any = {
    username: null,
    password: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  isSignUpFailed = false;
  errorMessage = '';
  roles: string[] = [];
  logindata: any = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private store: Store<{ cart: CartState }>,
    private ngxLoader: NgxUiLoaderService
  ) {}

  loginDetials: any = [];
  response: any = [];

  ngOnInit(): void {
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
              this.ngxLoader.stop();
            } else if (this.logindata.status == 1) {
              this.store.dispatch(
                CartActions.setUser({ user: {...this.logindata, accountType: 'register'} })
              );
              this.ngxLoader.stop();
              this.router.navigate(['/cart-sync']);
              this.pushLoginEvent(this.logindata.customerid);
            }
          },
        });
    });
  }

  pushLoginEvent(customerId: string) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'login',
      userId: customerId, // This number must be replaced with an actual User ID
    });
  }

  onSubmit(): void {
    this.loading = true;
    const { username, password } = this.form;
    this.ngxLoader.start();
    this.apiService.get_login_data(username, password).subscribe({
      next: (data) => {
        this.loading = false;
        this.logindata = data;
        if (this.logindata.status == 2) {
          this.errorMessage = this.logindata.message;
          this.isSignUpFailed = true;
          this.ngxLoader.stop();
        } else if (this.logindata.status == 1) {
          this.store.dispatch(CartActions.setUser({ user: {...this.logindata, accountType: 'register'} }));
          this.ngxLoader.stop();
          this.router.navigate(['/cart-sync']);

          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
            event: 'login',
            userId: this.logindata.customerid, //this number must be replaced with an actual User ID
          });
        } else {
          window.localStorage.setItem(
            'logdetails_reg',
            JSON.stringify(this.logindata)
          );
          localStorage.setItem('otpflag', JSON.stringify(1));
          localStorage.setItem('loginpage', JSON.stringify(2));
          toast.error(this.logindata.message);
          this.ngxLoader.stop();
          this.router.navigateByUrl('info/otp');
        }

        // this.reloadPage();
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.ngxLoader.stop();
      },
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
