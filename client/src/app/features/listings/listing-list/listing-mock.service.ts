import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {
  ListingModel,
  ListingStatusModel,
  PropertyTypeModel,
  UpsertListingModel
} from '../../../core/models/listing.model';
import {CommandResult} from '../../../core/models/result.model';

@Injectable({providedIn: 'root'})
export class ListingMockService {
  getListingToEdit(id: number): Observable<UpsertListingModel> {
    const now = Date.now();

    return of({
      id: 1,
      address: '1400 K Street',
      city: 'Sacramento',
      state: 'CA',
      zipCode: '95814',
      propertyType: 1,
      yearBuilt: 1998,
      bedrooms: 3,
      bathrooms: 2,
      squareFootage: 1850,
      propertyImages: [],
      mlsNumber: 'MLS-221001',
      listPrice: 649000,
      status: 2,
      offerDeadline: new Date(now + 30 * 60 * 60 * 1000).toISOString(),
      listingExpiration: new Date(now + 45 * 24 * 60 * 60 * 1000).toISOString(),
      sellerFirstName: 'Patricia',
      sellerLastName: 'Holloway',
      sellerEmail: 'patricia.holloway@example.com',
      sellerPhone: '555-123-4567',
      notes: 'Motivated seller. Hardwood floors throughout.',
      documents: []
    },);
  }

  getListings(): Observable<ListingModel[]> {
    const now = Date.now();

    const LISTINGS_DATA: ListingModel[] = [
      {
        id: 1,
        mlsNumber: 'MLS-221001',
        address: '1400 K Street',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95814',
        listPrice: 649000,
        status: {id: 2, label: 'Active'},
        offerDeadline: new Date(now + 30 * 60 * 60 * 1000), // 30 hours from now — urgent
        offersReceived: 4,
        daysOnMarket: 5,
        listingExpiration: new Date(now + 45 * 24 * 60 * 60 * 1000),
        publicLink: 'https://ebroker.app/listings/1',
      },
      {
        id: 2,
        mlsNumber: 'MLS-221002',
        address: '3200 Land Park Drive',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95818',
        listPrice: 575000,
        status: {id: 2, label: 'Active'},
        offerDeadline: null,
        offersReceived: 0, // zero offers edge case
        daysOnMarket: 12,
        listingExpiration: new Date(now + 5 * 24 * 60 * 60 * 1000), // expiring in 5 days
        publicLink: 'https://ebroker.app/listings/2',
      },
      {
        id: 3,
        mlsNumber: 'MLS-221003',
        address: '875 57th Street',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95819',
        listPrice: 415000,
        status: {id: 4, label: 'Closed'},
        offerDeadline: null,
        offersReceived: 1,
        daysOnMarket: 90,
        listingExpiration: new Date(now - 10 * 24 * 60 * 60 * 1000), // expired 10 days ago
        publicLink: 'https://ebroker.app/listings/3',
      },
      {
        id: 4,
        mlsNumber: 'MLS-221004',
        address: '2100 Capitol Avenue',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95816',
        listPrice: 820000,
        status: {id: 3, label: 'Pending'},
        offerDeadline: null,
        offersReceived: 6,
        daysOnMarket: 8,
        listingExpiration: new Date(now - 5 * 24 * 60 * 60 * 1000),
        publicLink: 'https://ebroker.app/listings/4',
      },
      {
        id: 5,
        mlsNumber: 'MLS-221005',
        address: '4502 Freeport Boulevard',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95822',
        listPrice: 495000,
        status: {id: 5, label: 'Withdrawn'},
        offerDeadline: new Date(now + 96 * 60 * 60 * 1000), // 4 days out — not urgent
        offersReceived: 2,
        daysOnMarket: 3,
        listingExpiration: new Date(now + 6 * 24 * 60 * 60 * 1000), // expiring in 6 days
        publicLink: 'https://ebroker.app/listings/5',
      },
      {
        id: 6,
        mlsNumber: 'MLS-221006',
        address: '910 Riverside Drive',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95831',
        listPrice: 720000,
        status: {id: 6, label: 'Expired'},
        offerDeadline: null,
        offersReceived: 3,
        daysOnMarket: 14,
        listingExpiration: new Date(now + 20 * 24 * 60 * 60 * 1000),
        publicLink: 'https://ebroker.app/listings/6',
      },
      {
        id: 7,
        mlsNumber: 'MLS-221007',
        address: '1765 El Camino Avenue',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95815',
        listPrice: 389000,
        status: {id: 3, label: 'Pending'},
        offerDeadline: null,
        offersReceived: 0,
        daysOnMarket: 21,
        listingExpiration: new Date(now + 30 * 24 * 60 * 60 * 1000),
        publicLink: 'https://ebroker.app/listings/7',
      },
      {
        id: 8,
        mlsNumber: 'MLS-221008',
        address: '6300 Stockton Boulevard',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95824',
        listPrice: 950000,
        status: {id: 2, label: 'Active'},
        offerDeadline: null,
        offersReceived: 8,
        daysOnMarket: 6,
        listingExpiration: new Date(now + 25 * 24 * 60 * 60 * 1000),
        publicLink: 'https://ebroker.app/listings/8',
      },
    ];

    return of(LISTINGS_DATA);
  }

  getListingStatuses(): Observable<ListingStatusModel[]> {
    const listingStatuses: ListingStatusModel[] = [
      {id: 1, label: 'Draft'},
      {id: 2, label: 'Active'},
      {id: 3, label: 'Pending'},
      {id: 4, label: 'Closed'},
      {id: 5, label: 'Withdrawn'},
      {id: 6, label: 'Expired'},
    ];

    return of(listingStatuses);
  }

  getPropertyTypes(): Observable<PropertyTypeModel[]> {
    const propertyTypes: PropertyTypeModel[] = [
      {id: 1, label: 'Single Family'},
      {id: 2, label: 'Condo'},
      {id: 3, label: 'Townhouse'},
      {id: 4, label: 'Multi Family'},
    ];

    return of(propertyTypes);
  }

  upsertListing(data: UpsertListingModel): Observable<CommandResult> {
    console.log('createListing called with:', data);
    return of({success: true, errors: []});
  }
}
