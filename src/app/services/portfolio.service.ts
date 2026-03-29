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
        const counts = new Map<string, number>();
        for (const p of portfolios) {
          const t = p.workTitle.trim();
          if (t) counts.set(t, (counts.get(t) ?? 0) + 1);
        }
        return Array.from(counts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([title]) => title);
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
