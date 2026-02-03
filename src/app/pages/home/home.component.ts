import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { PortfolioService, Portfolio } from '../../services/portfolio.service';
import { PortfolioCardComponent } from '../../components/portfolio-card/portfolio-card.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PortfolioCardComponent, FilterBarComponent],
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

  private searchQuery = '';
  private activeFilter = '';

  ngOnInit(): void {
    this.titleService.setTitle('DevFolio Directory — Open Source Developer Portfolio Directory');
    this.meta.updateTag({
      name: 'description',
      content: 'Browse and discover developer portfolios from talented engineers and designers around the world. Open source and community-driven.',
    });

    this.portfolioService.getPortfolios().subscribe((data) => {
      this.portfolios = data;
      this.filtered = data;
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

  onFilter(workTitle: string): void {
    this.activeFilter = workTitle;
    this.applyFilters();
  }

  private applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();
    const f = this.activeFilter.toLowerCase().trim();

    this.filtered = this.portfolios.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.workTitle.toLowerCase().includes(q) ||
        p.url.toLowerCase().includes(q);

      const matchesFilter = !f || p.workTitle.toLowerCase() === f;

      return matchesSearch && matchesFilter;
    });
  }

  trackByUrl(_: number, p: Portfolio): string {
    return p.url;
  }

  private injectStructuredData(): void {
    const script = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'DevFolio Directory',
      description: 'An open-source directory of developer portfolios.',
      url: 'https://devfolio.directory/',
      isPartOf: {
        '@type': 'WebSite',
        name: 'DevFolio Directory',
        url: 'https://devfolio.directory/',
      },
    };

    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(script);
    document.head.appendChild(el);
  }
}
