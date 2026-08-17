import {Component, OnInit, inject, signal, input} from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  ListingModel,
  ListingStatusModel,
  PropertyTypeModel,
  UpsertListingModel
} from '../../../core/models/listing.model';
import { ListingMockService } from './listing-mock.service';
import { ListingFiltersComponent } from './components/listing-filters/listing-filters.component';
import { ListingTableComponent } from './components/listing-table/listing-table.component';
import { ListingDrawerComponent } from '../listing-drawer/listing-drawer.component';
import {DrawerComponent} from '../../../shared/components/drawer/drawer.component';
import {PageHeadingComponent} from '../../../shared/components/page-heading/page-heading.component';

@Component({
  selector: 'app-listing-list',
  standalone: true,
  imports: [
    //ListingStatsBarComponent,
    ListingFiltersComponent,
    ListingTableComponent,
    ListingDrawerComponent,
    DrawerComponent,
    PageHeadingComponent,
  ],
  templateUrl: 'listing-list.component.html',
})
export class ListingListComponent implements OnInit {
  private listingService = inject(ListingMockService);

  listings = signal<ListingModel[]>([]);
  listingStatuses = signal<ListingStatusModel[]>([]);
  propertyTypes = signal<PropertyTypeModel[]>([]);
  allListingStatuses = signal<ListingStatusModel[]>([]);
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

  onListingSaved(data: UpsertListingModel): void {
    this.listingService.upsertListing(data).subscribe({
      next: (result) => {
        if (!result.success) {
          this.error.set(result.errors.join(', '));
        }
      },
      error: () => {
        this.error.set('Failed to create listing.');
      },
    });
  }
}
