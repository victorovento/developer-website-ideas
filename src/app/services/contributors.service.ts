import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, catchError, of } from 'rxjs';

export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

@Injectable({ providedIn: 'root' })
export class ContributorsService {
  private http = inject(HttpClient);

  private contributors$: Observable<Contributor[]> = this.http
    .get<Contributor[]>(
      'https://api.github.com/repos/victorovento/developer-website-ideas/contributors?per_page=100'
    )
    .pipe(
      catchError(() => of([] as Contributor[])),
      shareReplay(1)
    );

  getContributors(): Observable<Contributor[]> {
    return this.contributors$;
  }
}
