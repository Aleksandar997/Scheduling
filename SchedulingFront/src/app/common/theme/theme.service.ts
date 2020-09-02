import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseBase } from '../models/responseBase';
import { Theme } from './themeModel';
import { ThemeManagerService } from './themeManager.service';
import { SubjectAdapter } from '../base/subjectAdapter';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  url = '/theme/';
  private _themes = new SubjectAdapter<Array<Theme>>();
  themes = this._themes.get();
  constructor(private http: HttpClient) { }

  selectAll(): void {
    this.http.get(this.url).toPromise().then((res: ResponseBase<Array<Theme>>) => {
      this.setThemeStyleSheet(res.data.find(x => x.active));
      this._themes.next(res.data);
    });
  }

  setTheme(theme: Theme) {
    this.setThemeStyleSheet(theme);
    this.http.put(this.url, theme).toPromise().then((res: ResponseBase<Theme>) => {
      this._themes.data.forEach(t => {
        if (t.themeId === res.data.themeId) {
          t.active = true;
        } else {
          t.active = false;
        }
      });
      this._themes.next(this._themes.data);
    });
  }

  setThemeStyleSheet(theme: Theme) {
    ThemeManagerService.setStyle(
      'theme',
      `./assets/themes/${theme.themeOptions.value}.css`
    );
  }
}
