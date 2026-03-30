import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PortfolioCardComponent } from './portfolio-card.component';
import { Portfolio } from '../../services/portfolio.service';

const BASE_PORTFOLIO: Portfolio = {
  name: 'My Portfolio',
  url: 'https://www.myportfolio.dev',
  owner: 'Jane Smith',
  workTitle: 'Full Stack Developer',
};

describe('PortfolioCardComponent', () => {
  let fixture: ComponentFixture<PortfolioCardComponent>;
  let component: PortfolioCardComponent;

  const create = (portfolio: Portfolio = BASE_PORTFOLIO) => {
    fixture = TestBed.createComponent(PortfolioCardComponent);
    component = fixture.componentInstance;
    component.portfolio = portfolio;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioCardComponent],
    }).compileComponents();
  });

  it('creates the component', () => {
    create();
    expect(component).toBeTruthy();
  });

  it('renders the portfolio name', () => {
    create();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.card__name')?.textContent?.trim()).toBe('My Portfolio');
  });

  it('renders the owner', () => {
    create();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.card__owner')?.textContent?.trim()).toBe('Jane Smith');
  });

  it('renders the work title badge', () => {
    create();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.card__badge')?.textContent?.trim()).toBe('Full Stack Developer');
  });

  describe('domain getter', () => {
    it('strips www. prefix', () => {
      create();
      expect(component.domain).toBe('myportfolio.dev');
    });

    it('returns hostname without www for bare domains', () => {
      create({ ...BASE_PORTFOLIO, url: 'https://alice.io' });
      expect(component.domain).toBe('alice.io');
    });

    it('returns raw url when url is not parseable', () => {
      create({ ...BASE_PORTFOLIO, url: 'not-a-url' });
      expect(component.domain).toBe('not-a-url');
    });
  });

  describe('initials getter', () => {
    it('extracts first letter of first two words', () => {
      create();
      expect(component.initials).toBe('JS');
    });

    it('uses only first two words for three-word names', () => {
      create({ ...BASE_PORTFOLIO, owner: 'Jean Luc Picard' });
      expect(component.initials).toBe('JL');
    });

    it('returns single letter for single-word owner', () => {
      create({ ...BASE_PORTFOLIO, owner: 'alice' });
      expect(component.initials).toBe('A');
    });
  });

  describe('source code link', () => {
    it('renders source code button when sourceCode is set', () => {
      create({ ...BASE_PORTFOLIO, sourceCode: 'https://github.com/jane/portfolio' });
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.card__btn--ghost')).toBeTruthy();
    });

    it('hides source code button when sourceCode is absent', () => {
      create({ ...BASE_PORTFOLIO, sourceCode: undefined });
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.card__btn--ghost')).toBeNull();
    });
  });

  it('visit site link points to portfolio url', () => {
    create();
    const el: HTMLElement = fixture.nativeElement;
    const link = el.querySelector<HTMLAnchorElement>('.card__btn--primary');
    expect(link?.href).toContain('myportfolio.dev');
  });
});
