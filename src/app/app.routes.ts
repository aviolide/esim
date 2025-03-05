import { Routes } from '@angular/router';
import { EsimComponent } from './esim/esim.component';
import { HomeComponent } from './home/home.component';
import { SimDetailComponent } from './sim-detail/sim-detail.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutEsimComponent } from './checkout-esim/checkout-esim.component';
import { OrderHistoryComponent } from './Account/order-history/order-history.component';
import { TicketsComponent } from './Account/tickets/tickets.component';
import { TicketProcessComponent } from './Account/ticket-process/ticket-process.component';
import { MyEsimsComponent } from './Account/my-esims/my-esims.component';
import { MyESimDetailsComponent } from './Account/my-sim-detail/my-sim-detail.component';
import { TopUpsHistoryComponent } from './Account/top-ups/top-ups.component';
import { InviteFriendComponent } from './Account/invite-friend/invite-friend.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { EsimInstallationComponent } from './esim-installation/esim-installation.component';
import { FaqsComponent } from './faqs/faqs.component';
import { EsimCardsDiscountCouponsCodesComponent } from './esim-cards-discount-coupons-codes/esim-cards-discount-coupons-codes.component';
import { FreeEsimComponent } from './free-esim/free-esim.component';
import { CartSyncComponent } from './cart-sync/cart-sync.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { EsimCompatibleDevicesComponent } from './esim-compatible-devices/esim-compatible-devices.component';
import { PaymentSuccessComponent } from './Account/payment-success/payment-success.component';
import { FaqDetailsComponent } from './faqs/faq-details/faq-details.component';
import { GuestEsimComponent } from './Account/guest-esim/guest-esim.component';
import { Error404Component } from './error-404/error-404.component';
import { SitemapGeneratorComponent } from './sitemap-generator/sitemap-generator.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'esim/:countryname',
    component: EsimComponent,
  },
  {
    path: 'esim-detail/:planname',
    component: SimDetailComponent,
  },
  {
    path: 'checkout',
    component: CheckoutEsimComponent,
  },
  {
    path: 'checkout-esim',
    component: CheckoutComponent,
  },
  {
    path: 'blogs',
    component: BlogsComponent
  },
  {
    path: 'blogs/:slug',
    component: BlogDetailsComponent,
  },
  {
    path: 'info/OrderDetils',
    component: OrderHistoryComponent,
  },
  {
    path: 'info/Ticket',
    component: TicketsComponent,
  },
  {
    path: 'info/ticketprocess',
    component: TicketProcessComponent,
  },
  {
    path: 'info/myesim',
    component: MyEsimsComponent,
  },
  {
    path: 'info/myesimdetail',
    component: MyESimDetailsComponent,
  },
  {
    path: 'info/top-ups',
    component: TopUpsHistoryComponent,
  },
  { path: 'info/guestorder', 
    component: GuestEsimComponent 
  } ,
  {
    path: 'info/Invitefriends',
    component: InviteFriendComponent,
  },
  // {
  //   path: 'esim-api',
  //   component: ApiPartnerComponent
  // },
  {
    path: 'info/contactus',
    component: ContactUsComponent
  },
  {
    path: 'info/terms',
    component: TermsOfUseComponent
  },
  {
    path: 'info/policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'sitemap',
    component: SitemapComponent
  },
  {
    path: 'info/Installation',
    component: EsimInstallationComponent
  },
  {
    path: 'info/faq',
    component: FaqsComponent
  },
  {
    path: 'info/faq/:slug',
    component: FaqDetailsComponent
  },
  {
    path: 'esim-cards-discount-coupons-codes',
    component: EsimCardsDiscountCouponsCodesComponent
  },
  {
    path : 'free-esim',
    component: FreeEsimComponent
  },
  {
    path:'cart-sync',
    component: CartSyncComponent
  },
 
  {
    path: 'info/Compatibility',
    component: HowItWorksComponent
  },
  { 
    path: 'info/compatibilityCheck', 
    component: EsimCompatibleDevicesComponent 
  },
  { 
    path: 'info/paymentsucsess',
     component: PaymentSuccessComponent 
 },
 {
  path: 'sitemap-generator',
  component: SitemapGeneratorComponent
 },
 {
  path: '**',
  component: Error404Component
 }

];
