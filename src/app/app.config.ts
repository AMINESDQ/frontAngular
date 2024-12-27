import {ApplicationConfig, Provider} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors} from "@angular/common/http";
import {httpAppInterceptor} from "./interceptors/http-app.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(withInterceptors([httpAppInterceptor]))]
};
