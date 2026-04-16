import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import {Listing, ListingStatus, PropertyType} from '../../../core/models/listing.model';
import { ListingMockService } from './listing-mock.service';
import {ListingStats, ListingStatsBarComponent} from './components/listing-stats-bar/listing-stats-bar.component';
import { ListingFiltersComponent } from './components/listing-filters/listing-filters.component';
import { ListingTableComponent } from './components/listing-table/listing-table.component';
import { CreateListingSheetComponent } from './components/create-listing-sheet/create-listing-sheet.component';
import {BrnSheet} from '@spartan-ng/brain/sheet';

@Component({
  selector: 'app-listing-list',
  standalone: true,
  imports: [
    //ListingStatsBarComponent,
    ListingFiltersComponent,
    ListingTableComponent,
    CreateListingSheetComponent,
  ],
  templateUrl: 'listing-list.component.html',
})
export class ListingListComponent implements OnInit {
  private listingService = inject(ListingMockService);

  listings = signal<Listing[]>([]);
  listingStatuses = signal<ListingStatus[]>([]);
  propertyTypes = signal<PropertyType[]>([]);
  allListingStatuses = signal<ListingStatus[]>([]);
  statusFilter = signal<number>(0);
  searchTerm = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loading.set(true);
    forkJoin({
      listings: this.listingService.getListings(),
      listingStatuses: this.listingService.getListingStatuses(),
      propertyTypes: this.listingService.getPropertyTypes(),
    }).subscribe({
      next: ({ listings, listingStatuses, propertyTypes }) => {
        this.listings.set(listings);
        this.listingStatuses.set(listingStatuses)
        this.propertyTypes.set(propertyTypes)
        this.allListingStatuses.set([{ id: 0, label: 'All' }, ...listingStatuses])
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load listings.');
        this.loading.set(false);
      },
    });
  }

  onStatusFilterChange(filter: number): void {
    this.statusFilter.set(filter);
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  onListingCreated(data: unknown): void {
    console.log('Listing created:', data);
  }
}
