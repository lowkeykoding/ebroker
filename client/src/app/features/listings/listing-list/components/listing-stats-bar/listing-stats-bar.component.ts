import {Component, Input, Output, EventEmitter, input} from '@angular/core';
import {forkJoin} from 'rxjs';
import {Listing} from '../../../../../core/models/listing.model';

export interface ListingStats {
  activeCount: number;
  totalOffersReceived: number;
  expiringSoonCount: number;
  noOffersCount: number;
}

@Component({
  selector: 'app-listing-stats-bar',
  standalone: true,
  imports: [],
  templateUrl: 'listing-stats-bar.component.html',
})
export class ListingStatsBarComponent {
  @Output() filterSelect = new EventEmitter<string>();
  listings = input.required<Listing[]>();

  activeCount!: number;
  totalOffersReceived!: number;
  expiringSoonCount!: number;
  noOffersCount!: number;

  ngOnInit() {
    this.getActiveCount();
    this.getTotalOffersReceived();
    this.getExpiringSoonCount();
    this.getNoOffersCount();
  }

  getActiveCount() {
    this.activeCount = this.listings().filter(l => l.status.id === 2).length;
  }

  getTotalOffersReceived() {
    this.totalOffersReceived = this.listings()
      .reduce((sum, l) => sum + l.offersReceived, 0);
  }

  getExpiringSoonCount() {
    const threshold = Date.now() + 7 * 24 * 60 * 60 * 1000;
    this.expiringSoonCount = this.listings().filter(l => l.listingExpiration.getTime() <= threshold).length;
  }

  getNoOffersCount() {
    this.noOffersCount = this.listings().filter(l => l.status.id === 2 && l.offersReceived === 0).length;
  }

  onViewAll(filter: string): void {
    this.filterSelect.emit(filter);
  }
}
