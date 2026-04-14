import {Component, Input, Output, EventEmitter, signal, input} from '@angular/core';
import {ListingStatus} from '../../../../../core/models/listing.model';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-listing-filters',
  standalone: true,
  imports: [],
  templateUrl: 'listing-filters.component.html',
})
export class ListingFiltersComponent {
  @Output() statusFilterChange = new EventEmitter<number>();
  @Output() searchChange = new EventEmitter<string>();
  listingStatuses = input.required<ListingStatus[]>();

  currentFilter = signal<number>(0);

  onFilterSelect(value: number): void {
    this.statusFilterChange.emit(value);
    this.currentFilter.set(value);
  }

  onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }

  isFirst(index: number): boolean {
    return index === 0;
  }

  isLast(index: number): boolean {
    return index === this.listingStatuses.length - 1;
  }

  isActive(value: number): boolean {
    return this.currentFilter() === value;
  }
}
