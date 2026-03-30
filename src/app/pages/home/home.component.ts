import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { PortfolioService, Portfolio } from '../../services/portfolio.service';
import { PortfolioCardComponent } from '../../components/portfolio-card/portfolio-card.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { ContributorsComponent } from '../../components/contributors/contributors.component';

const PAGE_SIZE = 100;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PortfolioCardComponent, FilterBarComponent, ContributorsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private meta = inject(Meta);
  private titleService = inject(Title);
  private platformId = inject(PLATFORM_ID);

  portfolios: Portfolio[] = [];
  workTitles: string[] = [];
  filtered: Portfolio[] = [];
  recommended: Portfolio[] = [];
  page = 1;

  private searchQuery = '';
  private activeFilters: string[] = [];

  get paged(): Portfolio[] {
    const start = (this.page - 1) * PAGE_SIZE;
    return this.filtered.slice(start, start + PAGE_SIZE);
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / PAGE_SIZE);
  }

  get displayCount(): string {
    const n = this.portfolios.length;
    if (!n) return '';
    return `${Math.floor(n / 50) * 50}+`;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Developer Website Ideas — Open Source Directory');
    this.meta.updateTag({
      name: 'description',
      content: 'Browse and discover developer portfolios from talented engineers and designers around the world. Open source and community-driven.',
    });

    this.portfolioService.getPortfolios().subscribe((data) => {
      this.portfolios = data;
      this.filtered = data;
      this.recommended = this.pickDailyRecommended(data);
    });

    this.portfolioService.getWorkTitles().subscribe((titles) => {
      this.workTitles = titles;
    });

    if (isPlatformBrowser(this.platformId)) {
      this.injectStructuredData();
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  onFilter(filters: string[]): void {
    this.activeFilters = filters;
    this.applyFilters();
  }

  surpriseMe(): void {
    if (!isPlatformBrowser(this.platformId) || !this.portfolios.length) return;
    const pick = this.portfolios[Math.floor(Math.random() * this.portfolios.length)];
    window.open(pick.url, '_blank', 'noopener,noreferrer');
  }

  goToPage(p: number): void {
    this.page = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackByUrl(_: number, p: Portfolio): string {
    return p.url;
  }

  private applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();

    this.filtered = this.portfolios.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.workTitle.toLowerCase().includes(q) ||
        p.url.toLowerCase().includes(q);

      const matchesFilter =
        this.activeFilters.length === 0 ||
        this.activeFilters.some((f) => p.workTitle.toLowerCase() === f.toLowerCase());

      return matchesSearch && matchesFilter;
    });

    this.page = 1;
  }

  private pickDailyRecommended(portfolios: Portfolio[]): Portfolio[] {
    const today = new Date();
    const seed = parseInt(
      `${today.getUTCFullYear()}${String(today.getUTCMonth() + 1).padStart(2, '0')}${String(today.getUTCDate()).padStart(2, '0')}`
    );

    // mulberry32 PRNG
    let s = seed;
    const rand = () => {
      s |= 0; s = s + 0x6d2b79f5 | 0;
      let t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    const pool = [...portfolios];
    const picks: Portfolio[] = [];
    while (picks.length < 3 && pool.length > 0) {
      const idx = Math.floor(rand() * pool.length);
      picks.push(pool.splice(idx, 1)[0]);
    }
    return picks;
  }

  private injectStructuredData(): void {
    const script = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Developer Website Ideas',
      description: 'An open-source directory of developer portfolios.',
      url: 'https://github.com/victorovento/developer-website-ideas',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Developer Website Ideas',
        url: 'https://github.com/victorovento/developer-website-ideas',
      },
    };

    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(script);
    document.head.appendChild(el);
  }
}
