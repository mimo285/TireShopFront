import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HeroComponent } from './hero/hero.component';
import { ProductdetailsComponent } from './productdetails/productdetails.component';
import { ShopComponent } from './shop/shop.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { HttpClientModule } from '@angular/common/http';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';


export const appRoutes: Routes = [
  { path: '', redirectTo: '/hero', pathMatch: 'full' }, 
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'hero', component: HeroComponent },
  //{ path: 'product-details', component: ProductdetailsComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'searchbar', component: SearchbarComponent},
  { path: 'cart', component: CartComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: 'order-confirmation', component: OrderConfirmationComponent},
  { path: 'product-details/:id', component: ProductdetailsComponent },
  { path: 'purchase-history', component: PurchaseHistoryComponent },
  { path: 'admin-dashboard', component: AdmindashboardComponent },

  { path: '**', redirectTo: '/hero' }, 
];


@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
    SocialLoginModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('16451055425-k42ku1i3r718ciqpkuuuf572tg65bupg.apps.googleusercontent.com'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [],
})
export class AppModule {}