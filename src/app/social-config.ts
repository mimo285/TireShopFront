// src/app/social-config.ts
import { InjectionToken } from '@angular/core';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

export const SOCIAL_AUTH_CONFIG = new InjectionToken<SocialAuthServiceConfig>('social-auth-config');

export const socialAuthConfig: SocialAuthServiceConfig = {
  autoLogin: false,
  providers: [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider('16451055425-k42ku1i3r718ciqpkuuuf572tg65bupg.apps.googleusercontent.com'),
    },
  ],
};
