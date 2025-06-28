/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  HttpInterceptorFn,
} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  SocialLoginModule,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';

// HTTP interceptor to add JWT to all requests
const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const newReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  return next(newReq);
};

// Social login config
const socialLoginConfig: SocialAuthServiceConfig = {
  autoLogin: false,
  providers: [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        '16451055425-k42ku1i3r718ciqpkuuuf572tg65bupg.apps.googleusercontent.com'
      ),
    },
  ],
  onError: (err) => console.error('Social login error:', err),
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptorFn])),
    provideToastr(),
    provideAnimations(),
    // Import the SocialLoginModule so SocialAuthService is present
    importProvidersFrom(SocialLoginModule),
    // Provide the config using the exact string token
    {
      provide: 'SocialAuthServiceConfig',
      useValue: socialLoginConfig,
    },
  ],
}).catch((err) => console.error(err));
