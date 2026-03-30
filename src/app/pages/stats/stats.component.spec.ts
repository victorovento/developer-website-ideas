import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { StatsComponent } from './stats.component';
import { PortfolioService, Portfolio } from '../../services/portfolio.service';

const makePortfolio = (overrides: Partial<Portfolio> = {}): Portfolio => ({
  name: 'Site',
  url: 'https://site.dev',
  owner: 'Owner',
  workTitle: 'Full Stack Developer',
  ...overrides,
});

const PORTFOLIOS: Portfolio[] = [
  makePortfolio({ url: 'https://alice.vercel.app',    workTitle: 'Frontend Engineer',    sourceCode: 'https://github.com/alice' }),
  makePortfolio({ url: 'https://bob.vercel.app',      workTitle: 'Frontend Engineer'    }),
  makePortfolio({ url: 'https://carol.vercel.app',    workTitle: 'Frontend Engineer'    }),
  makePortfolio({ url: 'https://dave.github.io',      workTitle: 'Backend Developer',   sourceCode: 'https://github.com/dave' }),
  makePortfolio({ url: 'https://eve.netlify.app',     workTitle: 'Backend Developer'    }),
  makePortfolio({ url: 'https://frank.netlify.app',   workTitle: 'Designer'             }),
];

describe('StatsComponent', () => {
  let fixture: ComponentFixture<StatsComponent>;
  let component: StatsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsComponent],
      providers: [
        {
          provide: PortfolioService,
          useValue: { getPortfolios: () => of(PORTFOLIOS) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('computes total portfolio count', () => {
    expect(component.total).toBe(6);
  });

  it('counts portfolios with source code', () => {
    expect(component.withSourceCode).toBe(2);
  });

  it('computes sourceCodePct correctly', () => {
    expect(component.sourceCodePct).toBe(33); // 2/6 = 33.3 → 33
  });

  it('computes the number of unique roles', () => {
    expect(component.uniqueRoles).toBe(3);
  });

  it('sorts topWorkTitles by count descending', () => {
    expect(component.topWorkTitles[0].title).toBe('Frontend Engineer');
    expect(component.topWorkTitles[0].count).toBe(3);
    expect(component.topWorkTitles[1].title).toBe('Backend Developer');
    expect(component.topWorkTitles[1].count).toBe(2);
    expect(component.topWorkTitles[2].title).toBe('Designer');
    expect(component.topWorkTitles[2].count).toBe(1);
  });

  it('sets pct to 100 for the top work title', () => {
    expect(component.topWorkTitles[0].pct).toBe(100);
  });

  it('computes relative pct for other titles', () => {
    // Backend: 2/3 * 100 = 66
    expect(component.topWorkTitles[1].pct).toBe(67);
  });

  it('extracts top domains from portfolio URLs', () => {
    const domainNames = component.topDomains.map((d) => d.domain);
    expect(domainNames).toContain('vercel.app');
    expect(domainNames).toContain('netlify.app');
  });

  it('sorts topDomains by count descending', () => {
    expect(component.topDomains[0].domain).toBe('vercel.app');
    expect(component.topDomains[0].count).toBe(3);
  });

  it('renders stat cards in the template', () => {
    const cards = fixture.nativeElement.querySelectorAll('.stat-card');
    expect(cards.length).toBe(3);
  });

  it('displays the total count in the template', () => {
    const text: string = fixture.nativeElement.querySelector('.stat-card__value')?.textContent ?? '';
    expect(text.trim()).toBe('6');
  });

  describe('sourceCodePct edge cases', () => {
    it('returns 0 when total is 0', () => {
      component.total = 0;
      component.withSourceCode = 0;
      expect(component.sourceCodePct).toBe(0);
    });
  });
});
