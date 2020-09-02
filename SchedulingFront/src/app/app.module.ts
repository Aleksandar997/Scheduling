import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
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
import './common/extensions/FormGroupExtensions';
import { MatPaginatorIntl } from '@angular/material';
import { MatPaginatorIntlLocalized } from './common/adapters/matPaginatorIntlLocalized';
import { RegisterModule } from './register/register.module';
import { ToasterModule } from './common/components/toaster/toaster.module';
import { RouterModule } from '@angular/router';
import { CalendarModule } from './common/components/calendar/calendar.module';
import { ThemeService } from './common/theme/theme.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    LoginModule,
    AppLayoutModule,
    RegisterModule,
    ToasterModule
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
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig },
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
