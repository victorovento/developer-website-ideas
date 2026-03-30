import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FilterBarComponent } from './filter-bar.component';

const WORK_TITLES = ['Full Stack Developer', 'Frontend Engineer', 'Designer'];

describe('FilterBarComponent', () => {
  let fixture: ComponentFixture<FilterBarComponent>;
  let component: FilterBarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;
    component.workTitles = WORK_TITLES;
    component.totalCount = 100;
    component.filteredCount = 80;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders an "All" chip plus one per work title', () => {
    const el: HTMLElement = fixture.nativeElement;
    const chips = el.querySelectorAll('.filter-bar__chip');
    expect(chips.length).toBe(WORK_TITLES.length + 1);
  });

  it('"All" chip is active by default', () => {
    expect(component.isActive('All')).toBe(true);
    expect(component.activeFilters.length).toBe(0);
  });

  it('isActive returns false for unselected filter', () => {
    expect(component.isActive('Frontend Engineer')).toBe(false);
  });

  describe('onFilter()', () => {
    it('clicking a chip adds it to activeFilters', () => {
      component.onFilter('Frontend Engineer');
      expect(component.activeFilters).toContain('Frontend Engineer');
    });

    it('clicking an active chip removes it', () => {
      component.onFilter('Frontend Engineer');
      component.onFilter('Frontend Engineer');
      expect(component.activeFilters).not.toContain('Frontend Engineer');
    });

    it('supports selecting multiple chips simultaneously', () => {
      component.onFilter('Frontend Engineer');
      component.onFilter('Designer');
      expect(component.activeFilters).toContain('Frontend Engineer');
      expect(component.activeFilters).toContain('Designer');
      expect(component.activeFilters.length).toBe(2);
    });

    it('clicking "All" clears all active filters', () => {
      component.onFilter('Frontend Engineer');
      component.onFilter('Designer');
      component.onFilter('All');
      expect(component.activeFilters.length).toBe(0);
    });

    it('emits filterChange with the current active filters array', () => {
      const emitted: string[][] = [];
      component.filterChange.subscribe((v) => emitted.push(v));

      component.onFilter('Frontend Engineer');
      expect(emitted[0]).toEqual(['Frontend Engineer']);

      component.onFilter('Designer');
      expect(emitted[1]).toEqual(['Frontend Engineer', 'Designer']);
    });

    it('emits an empty array when "All" is clicked', () => {
      const emitted: string[][] = [];
      component.filterChange.subscribe((v) => emitted.push(v));

      component.onFilter('Frontend Engineer');
      component.onFilter('All');
      expect(emitted[1]).toEqual([]);
    });

    it('isActive("All") returns true when no filters are active', () => {
      component.onFilter('Frontend Engineer');
      component.onFilter('All');
      expect(component.isActive('All')).toBe(true);
    });
  });

  describe('search', () => {
    it('emits searchChange with the typed query', () => {
      const emitted: string[] = [];
      component.searchChange.subscribe((v) => emitted.push(v));

      component.onSearch('jane');
      expect(emitted[0]).toBe('jane');
    });

    it('clearSearch resets the query and emits empty string', () => {
      const emitted: string[] = [];
      component.searchChange.subscribe((v) => emitted.push(v));

      component.onSearch('test');
      component.clearSearch();
      expect(component.searchQuery).toBe('');
      expect(emitted[1]).toBe('');
    });

    it('shows total and filtered counts', () => {
      const el: HTMLElement = fixture.nativeElement;
      const text = el.querySelector('.filter-bar__count')?.textContent ?? '';
      expect(text).toContain('80');
      expect(text).toContain('100');
    });
  });
});
