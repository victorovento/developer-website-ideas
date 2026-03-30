import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent implements OnChanges {
  @Input() workTitles: string[] = [];
  @Input() totalCount = 0;
  @Input() filteredCount = 0;

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<string[]>();

  searchQuery = '';
  activeFilters: string[] = [];

  get filters(): string[] {
    return ['All', ...this.workTitles];
  }

  ngOnChanges(): void {}

  onSearch(value: string): void {
    this.searchQuery = value;
    this.searchChange.emit(value);
  }

  onFilter(filter: string): void {
    if (filter === 'All') {
      this.activeFilters = [];
    } else {
      const idx = this.activeFilters.indexOf(filter);
      if (idx >= 0) {
        this.activeFilters = this.activeFilters.filter((f) => f !== filter);
      } else {
        this.activeFilters = [...this.activeFilters, filter];
      }
    }
    this.filterChange.emit(this.activeFilters);
  }

  isActive(filter: string): boolean {
    if (filter === 'All') return this.activeFilters.length === 0;
    return this.activeFilters.includes(filter);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchChange.emit('');
  }
}
