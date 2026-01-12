import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

export interface Portfolio {
  name: string;
  url: string;
  owner: string;
  workTitle: string;
  sourceCode?: string;
}

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private http = inject(HttpClient);

  private portfolios$: Observable<Portfolio[]> = this.http
    .get('/WEBSITES.md', { responseType: 'text' })
    .pipe(
      map((raw) => this.parse(raw)),
      shareReplay(1)
    );

  getPortfolios(): Observable<Portfolio[]> {
    return this.portfolios$;
  }

  getWorkTitles(): Observable<string[]> {
    return this.portfolios$.pipe(
      map((portfolios) => {
        const titles = new Set(portfolios.map((p) => p.workTitle.trim()));
        return Array.from(titles).sort();
      })
    );
  }

  private parse(raw: string): Portfolio[] {
    return raw
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith('#');
      })
      .map((line) => {
        const parts = line.split('|').map((p) => p.trim());
        if (parts.length < 4) return null;
        return {
          name: parts[0],
          url: parts[1],
          owner: parts[2],
          workTitle: parts[3],
          sourceCode: parts[4] || undefined,
        } as Portfolio;
      })
      .filter((p): p is Portfolio => p !== null && p.name !== '' && p.url !== '');
  }
}
