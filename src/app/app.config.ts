import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

// Define your social login configuration here
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

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideClientHydration(),
    provideHttpClient(),
    provideToastr(),
    provideAnimations(),
    importProvidersFrom(SocialLoginModule),
        // Provide the config using the exact string token
        {
          provide: 'SocialAuthServiceConfig',
          useValue: socialLoginConfig,
        }
  ]
};
