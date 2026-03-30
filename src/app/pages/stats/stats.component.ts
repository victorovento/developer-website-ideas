import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { PortfolioService, Portfolio } from '../../services/portfolio.service';

interface WorkTitleStat {
  title: string;
  count: number;
  pct: number;
}

interface DomainStat {
  domain: string;
  count: number;
  pct: number;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private titleService = inject(Title);
  private meta = inject(Meta);

  total = 0;
  withSourceCode = 0;
  uniqueRoles = 0;
  topWorkTitles: WorkTitleStat[] = [];
  topDomains: DomainStat[] = [];

  ngOnInit(): void {
    this.titleService.setTitle('Stats — Developer Website Ideas');
    this.meta.updateTag({
      name: 'description',
      content: 'Directory statistics: breakdown by role, hosting platforms, and open source contributions.',
    });

    this.portfolioService.getPortfolios().subscribe((portfolios) => {
      this.computeStats(portfolios);
    });
  }

  private computeStats(portfolios: Portfolio[]): void {
    this.total = portfolios.length;
    this.withSourceCode = portfolios.filter((p) => !!p.sourceCode).length;

    const titleCounts = new Map<string, number>();
    const domainCounts = new Map<string, number>();

    for (const p of portfolios) {
      const t = p.workTitle.trim();
      if (t) titleCounts.set(t, (titleCounts.get(t) ?? 0) + 1);

      try {
        const host = new URL(p.url).hostname.replace('www.', '');
        const parts = host.split('.');
        const platform = parts.length >= 2 ? parts.slice(-2).join('.') : host;
        domainCounts.set(platform, (domainCounts.get(platform) ?? 0) + 1);
      } catch {
        // ignore malformed URLs
      }
    }

    this.uniqueRoles = titleCounts.size;

    const sortedTitles = Array.from(titleCounts.entries()).sort((a, b) => b[1] - a[1]);
    const maxTitle = sortedTitles[0]?.[1] ?? 1;
    this.topWorkTitles = sortedTitles.slice(0, 20).map(([title, count]) => ({
      title,
      count,
      pct: Math.round((count / maxTitle) * 100),
    }));

    const sortedDomains = Array.from(domainCounts.entries()).sort((a, b) => b[1] - a[1]);
    const maxDomain = sortedDomains[0]?.[1] ?? 1;
    this.topDomains = sortedDomains.slice(0, 10).map(([domain, count]) => ({
      domain,
      count,
      pct: Math.round((count / maxDomain) * 100),
    }));
  }

  get sourceCodePct(): number {
    if (!this.total) return 0;
    return Math.round((this.withSourceCode / this.total) * 100);
  }
}
