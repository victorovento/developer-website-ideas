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
  @Output() filterChange = new EventEmitter<string>();

  searchQuery = '';
  activeFilter = 'All';

  get filters(): string[] {
    return ['All', ...this.workTitles];
  }

  ngOnChanges(): void {}

  onSearch(value: string): void {
    this.searchQuery = value;
    this.searchChange.emit(value);
  }

  onFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterChange.emit(filter === 'All' ? '' : filter);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchChange.emit('');
  }
}
