import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PortfolioService } from './portfolio.service';

const RAW_MD = [
  '# Comment line — should be ignored',
  'Alpha Site | https://alpha.dev | Alice Alpha | Full Stack Developer | https://github.com/alice',
  'Beta Site  | https://beta.dev  | Bob Beta    | Frontend Engineer   |',
  '           | https://no-name.dev | Owner | Role |',
  'No URL     |                     | Owner | Role |',
  'Too Few    | https://few.dev',
].join('\n');

describe('PortfolioService', () => {
  let service: PortfolioService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PortfolioService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('getPortfolios()', () => {
    it('parses name, url, owner, and workTitle', () => {
      service.getPortfolios().subscribe((portfolios) => {
        expect(portfolios[0].name).toBe('Alpha Site');
        expect(portfolios[0].url).toBe('https://alpha.dev');
        expect(portfolios[0].owner).toBe('Alice Alpha');
        expect(portfolios[0].workTitle).toBe('Full Stack Developer');
      });
      http.expectOne('/WEBSITES.md').flush(RAW_MD);
    });

    it('parses optional sourceCode field when present', () => {
      service.getPortfolios().subscribe((portfolios) => {
        expect(portfolios[0].sourceCode).toBe('https://github.com/alice');
      });
      http.expectOne('/WEBSITES.md').flush(RAW_MD);
    });

    it('sets sourceCode to undefined when 5th field is absent', () => {
      service.getPortfolios().subscribe((portfolios) => {
        expect(portfolios[1].sourceCode).toBeUndefined();
      });
      http.expectOne('/WEBSITES.md').flush(RAW_MD);
    });

    it('ignores lines starting with #', () => {
      service.getPortfolios().subscribe((portfolios) => {
        const names = portfolios.map((p) => p.name);
        expect(names.every((n) => !n.startsWith('#'))).toBe(true);
      });
      http.expectOne('/WEBSITES.md').flush(RAW_MD);
    });

    it('ignores entries with empty name', () => {
      service.getPortfolios().subscribe((portfolios) => {
        expect(portfolios.find((p) => p.url === 'https://no-name.dev')).toBeUndefined();
      });
      http.expectOne('/WEBSITES.md').flush(RAW_MD);
    });

    it('ignores entries with empty url', () => {
      service.getPortfolios().subscribe((portfolios) => {
        expect(portfolios.find((p) => p.name === 'No URL')).toBeUndefined();
      });
      http.expectOne('/WEBSITES.md').flush(RAW_MD);
    });

    it('ignores lines with fewer than 4 fields', () => {
      service.getPortfolios().subscribe((portfolios) => {
        expect(portfolios.find((p) => p.name === 'Too Few')).toBeUndefined();
      });
      http.expectOne('/WEBSITES.md').flush(RAW_MD);
    });

    it('returns exactly 2 valid entries from the fixture', () => {
      service.getPortfolios().subscribe((portfolios) => {
        expect(portfolios.length).toBe(2);
      });
      http.expectOne('/WEBSITES.md').flush(RAW_MD);
    });
  });

  describe('getWorkTitles()', () => {
    it('returns titles sorted by occurrence count descending', () => {
      const raw = [
        'A | https://a.dev | A | Frontend Engineer |',
        'B | https://b.dev | B | Frontend Engineer |',
        'C | https://c.dev | C | Frontend Engineer |',
        'D | https://d.dev | D | Backend Developer |',
        'E | https://e.dev | E | Backend Developer |',
        'F | https://f.dev | F | Designer |',
      ].join('\n');

      service.getWorkTitles().subscribe((titles) => {
        expect(titles[0]).toBe('Frontend Engineer');
        expect(titles[1]).toBe('Backend Developer');
        expect(titles[2]).toBe('Designer');
      });
      http.expectOne('/WEBSITES.md').flush(raw);
    });

    it('returns at most 10 titles', () => {
      const raw = Array.from({ length: 15 }, (_, i) =>
        `Entry${i} | https://s${i}.dev | Owner${i} | Role ${i} |`
      ).join('\n');

      service.getWorkTitles().subscribe((titles) => {
        expect(titles.length).toBeLessThanOrEqual(10);
      });
      http.expectOne('/WEBSITES.md').flush(raw);
    });

    it('excludes empty work titles', () => {
      const raw = 'Entry | https://e.dev | Owner |  |';
      service.getWorkTitles().subscribe((titles) => {
        expect(titles).not.toContain('');
      });
      http.expectOne('/WEBSITES.md').flush(raw);
    });
  });
});
