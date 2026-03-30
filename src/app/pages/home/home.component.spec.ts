import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { PortfolioService, Portfolio } from '../../services/portfolio.service';
import { ContributorsService } from '../../services/contributors.service';

const makePortfolio = (overrides: Partial<Portfolio> = {}): Portfolio => ({
  name: 'Default Site',
  url: 'https://default.dev',
  owner: 'Default Owner',
  workTitle: 'Full Stack Developer',
  ...overrides,
});

const PORTFOLIOS: Portfolio[] = [
  makePortfolio({ name: 'Alice', url: 'https://alice.dev', owner: 'Alice A', workTitle: 'Frontend Engineer' }),
  makePortfolio({ name: 'Bob',   url: 'https://bob.dev',   owner: 'Bob B',   workTitle: 'Backend Developer'  }),
  makePortfolio({ name: 'Carol', url: 'https://carol.dev', owner: 'Carol C', workTitle: 'Frontend Engineer' }),
  makePortfolio({ name: 'Dave',  url: 'https://dave.dev',  owner: 'Dave D',  workTitle: 'Designer'           }),
];

const mockPortfolioService = {
  getPortfolios: () => of(PORTFOLIOS),
  getWorkTitles:  () => of(['Frontend Engineer', 'Backend Developer', 'Designer']),
};

const mockContributorsService = { getContributors: () => of([]) };

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: PortfolioService, useValue: mockPortfolioService },
        { provide: ContributorsService, useValue: mockContributorsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('loads portfolios from the service', () => {
    expect(component.portfolios.length).toBe(4);
  });

  it('sets filtered to all portfolios on load', () => {
    expect(component.filtered.length).toBe(4);
  });

  it('loads work titles from the service', () => {
    expect(component.workTitles.length).toBe(3);
  });

  describe('onSearch()', () => {
    it('filters by portfolio name (case-insensitive)', () => {
      component.onSearch('alice');
      expect(component.filtered.length).toBe(1);
      expect(component.filtered[0].name).toBe('Alice');
    });

    it('filters by owner name', () => {
      component.onSearch('bob b');
      expect(component.filtered[0].owner).toBe('Bob B');
    });

    it('filters by workTitle', () => {
      component.onSearch('designer');
      expect(component.filtered.length).toBe(1);
      expect(component.filtered[0].workTitle).toBe('Designer');
    });

    it('returns all portfolios when query is empty', () => {
      component.onSearch('alice');
      component.onSearch('');
      expect(component.filtered.length).toBe(4);
    });

    it('resets page to 1', () => {
      component.page = 3;
      component.onSearch('alice');
      expect(component.page).toBe(1);
    });
  });

  describe('onFilter()', () => {
    it('filters by a single work title', () => {
      component.onFilter(['Frontend Engineer']);
      expect(component.filtered.length).toBe(2);
      expect(component.filtered.every((p) => p.workTitle === 'Frontend Engineer')).toBe(true);
    });

    it('filters by multiple work titles using OR logic', () => {
      component.onFilter(['Frontend Engineer', 'Designer']);
      expect(component.filtered.length).toBe(3);
    });

    it('shows all portfolios when filter array is empty', () => {
      component.onFilter(['Frontend Engineer']);
      component.onFilter([]);
      expect(component.filtered.length).toBe(4);
    });

    it('resets page to 1', () => {
      component.page = 2;
      component.onFilter(['Designer']);
      expect(component.page).toBe(1);
    });
  });

  describe('pagination', () => {
    it('paged getter returns the current page slice', () => {
      expect(component.paged.length).toBe(4); // all 4 fit in page 1 (PAGE_SIZE=100)
    });

    it('totalPages is 1 when all items fit on one page', () => {
      expect(component.totalPages).toBe(1);
    });

    it('goToPage updates the current page', () => {
      component.goToPage(2);
      expect(component.page).toBe(2);
    });

    it('goToPage calls window.scrollTo', () => {
      component.goToPage(2);
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });

  describe('displayCount', () => {
    it('returns empty string when no portfolios are loaded', () => {
      component.portfolios = [];
      expect(component.displayCount).toBe('');
    });

    it('rounds down to nearest 50 and appends +', () => {
      component.portfolios = Array.from({ length: 253 }, (_, i) =>
        makePortfolio({ name: `P${i}`, url: `https://p${i}.dev` })
      );
      expect(component.displayCount).toBe('250+');
    });

    it('returns "0+" when fewer than 50 portfolios are loaded', () => {
      component.portfolios = [makePortfolio()];
      expect(component.displayCount).toBe('0+');
    });
  });

  describe('pickDailyRecommended()', () => {
    it('returns exactly 3 portfolios', () => {
      expect(component.recommended.length).toBe(3);
    });

    it('returns portfolios from the source list', () => {
      const urls = PORTFOLIOS.map((p) => p.url);
      component.recommended.forEach((r) => {
        expect(urls).toContain(r.url);
      });
    });

    it('returns no duplicates', () => {
      const urls = component.recommended.map((p) => p.url);
      expect(new Set(urls).size).toBe(3);
    });

    it('is deterministic for the same date', () => {
      // Call the private method twice indirectly via two fresh runs of the same logic
      const a = (component as any).pickDailyRecommended(PORTFOLIOS);
      const b = (component as any).pickDailyRecommended(PORTFOLIOS);
      expect(a.map((p: Portfolio) => p.url)).toEqual(b.map((p: Portfolio) => p.url));
    });
  });

  describe('trackByUrl()', () => {
    it('returns the portfolio url', () => {
      const p = makePortfolio({ url: 'https://track.dev' });
      expect(component.trackByUrl(0, p)).toBe('https://track.dev');
    });
  });
});
