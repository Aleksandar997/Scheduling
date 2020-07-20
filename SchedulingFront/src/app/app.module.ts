import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginModule } from './login/login.module';
import { AppLayoutModule } from './common/layout/appLayout/appLayout.module';
import { AuthGuard } from './common/guards/auth.guard';
import { TranslatePipe } from './common/pipes/translate/translatePipe';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Interceptor } from './common/http/interceptor';

import './common/extensions/ArrayExtensions';
import './common/extensions/StringExtensions';
import { GestureConfig, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorIntlLocalized } from './common/adapters/matPaginatorIntlLocalized';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LoginModule,
    AppLayoutModule
  ],
  providers: [
    AuthGuard,
    TranslatePipe,
    HttpClientModule,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlLocalized
    },
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
