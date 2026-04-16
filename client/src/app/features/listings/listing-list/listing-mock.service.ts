import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {Listing, ListingStatus, PropertyType} from '../../../core/models/listing.model';

@Injectable({ providedIn: 'root' })
export class ListingMockService {
  getListings(): Observable<Listing[]> {
    const now = Date.now();

    const listings: Listing[] = [
      {
        id: '1',
        mlsNumber: 'MLS-221001',
        address: '1400 K Street',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95814',
        listPrice: 649000,
        status: { id: 2, label: 'Active' },
        offerDeadline: new Date(now + 30 * 60 * 60 * 1000), // 30 hours from now — urgent
        offersReceived: 4,
        daysOnMarket: 5,
        sellerName: 'Patricia Holloway',
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 1850,
        propertyType: 'single_family',
        yearBuilt: 1998,
        listingExpiration: new Date(now + 45 * 24 * 60 * 60 * 1000),
        notes: 'Motivated seller. Hardwood floors throughout.',
        publicLink: 'https://ebroker.app/listings/1',
      },
      {
        id: '2',
        mlsNumber: 'MLS-221002',
        address: '3200 Land Park Drive',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95818',
        listPrice: 575000,
        status: { id: 2, label: 'Active' },
        offerDeadline: null,
        offersReceived: 0, // zero offers edge case
        daysOnMarket: 12,
        sellerName: 'Marcus Webb',
        bedrooms: 2,
        bathrooms: 1,
        squareFootage: 1320,
        propertyType: 'condo',
        yearBuilt: 2005,
        listingExpiration: new Date(now + 5 * 24 * 60 * 60 * 1000), // expiring in 5 days
        notes: null,
        publicLink: 'https://ebroker.app/listings/2',
      },
      {
        id: '3',
        mlsNumber: 'MLS-221003',
        address: '875 57th Street',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95819',
        listPrice: 415000,
        status: { id: 4, label: 'Closed' },
        offerDeadline: null,
        offersReceived: 1,
        daysOnMarket: 90,
        sellerName: 'Diane Fukushima',
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 1500,
        propertyType: 'townhouse',
        yearBuilt: 1985,
        listingExpiration: new Date(now - 10 * 24 * 60 * 60 * 1000), // expired 10 days ago
        notes: 'Price reduction needed.',
        publicLink: 'https://ebroker.app/listings/3',
      },
      {
        id: '4',
        mlsNumber: 'MLS-221004',
        address: '2100 Capitol Avenue',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95816',
        listPrice: 820000,
        status: { id: 3, label: 'Pending' },
        offerDeadline: null,
        offersReceived: 6,
        daysOnMarket: 8,
        sellerName: 'Robert & Angela Kim',
        bedrooms: 4,
        bathrooms: 3,
        squareFootage: 2700,
        propertyType: 'single_family',
        yearBuilt: 2012,
        listingExpiration: new Date(now - 5 * 24 * 60 * 60 * 1000),
        notes: 'Sold above asking price.',
        publicLink: 'https://ebroker.app/listings/4',
      },
      {
        id: '5',
        mlsNumber: 'MLS-221005',
        address: '4502 Freeport Boulevard',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95822',
        listPrice: 495000,
        status: { id: 5, label: 'Withdrawn' },
        offerDeadline: new Date(now + 96 * 60 * 60 * 1000), // 4 days out — not urgent
        offersReceived: 2,
        daysOnMarket: 3,
        sellerName: 'Sandra Nguyen',
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 1680,
        propertyType: 'single_family',
        yearBuilt: 1972,
        listingExpiration: new Date(now + 6 * 24 * 60 * 60 * 1000), // expiring in 6 days
        notes: null,
        publicLink: 'https://ebroker.app/listings/5',
      },
      {
        id: '6',
        mlsNumber: 'MLS-221006',
        address: '910 Riverside Drive',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95831',
        listPrice: 720000,
        status: { id: 6, label: 'Expired' },
        offerDeadline: null,
        offersReceived: 3,
        daysOnMarket: 14,
        sellerName: 'Thomas Garrett',
        bedrooms: 4,
        bathrooms: 2,
        squareFootage: 2200,
        propertyType: 'single_family',
        yearBuilt: 2001,
        listingExpiration: new Date(now + 20 * 24 * 60 * 60 * 1000),
        notes: 'Offer accepted. Inspection period underway.',
        publicLink: 'https://ebroker.app/listings/6',
      },
      {
        id: '7',
        mlsNumber: 'MLS-221007',
        address: '1765 El Camino Avenue',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95815',
        listPrice: 389000,
        status: { id: 3, label: 'Pending' },
        offerDeadline: null,
        offersReceived: 0,
        daysOnMarket: 21,
        sellerName: 'Lorraine Castillo',
        bedrooms: 2,
        bathrooms: 1,
        squareFootage: 980,
        propertyType: 'condo',
        yearBuilt: 1990,
        listingExpiration: new Date(now + 30 * 24 * 60 * 60 * 1000),
        notes: null,
        publicLink: 'https://ebroker.app/listings/7',
      },
      {
        id: '8',
        mlsNumber: 'MLS-221008',
        address: '6300 Stockton Boulevard',
        city: 'Sacramento',
        state: 'CA',
        zipCode: '95824',
        listPrice: 950000,
        status: { id: 2, label: 'Active' },
        offerDeadline: null,
        offersReceived: 8,
        daysOnMarket: 6,
        sellerName: 'James & Carol Okafor',
        bedrooms: 5,
        bathrooms: 4,
        squareFootage: 3400,
        propertyType: 'multi_family',
        yearBuilt: 2018,
        listingExpiration: new Date(now + 25 * 24 * 60 * 60 * 1000),
        notes: 'Investment property — great cap rate.',
        publicLink: 'https://ebroker.app/listings/8',
      },
    ];

    return of(listings);
  }

  getListingStatuses(): Observable<ListingStatus[]> {
    const listingStatuses: ListingStatus[] = [
      { id: 1, label: 'Draft'},
      { id: 2, label: 'Active'},
      { id: 3, label: 'Pending'},
      { id: 4, label: 'Closed'},
      { id: 5, label: 'Withdrawn'},
      { id: 6, label: 'Expired'},
    ];

    return of(listingStatuses);
  }

  getPropertyTypes(): Observable<PropertyType[]> {
    const propertyTypes: PropertyType[] = [
      { id: 1, label: 'Single Family'},
      { id: 2, label: 'Condo'},
      { id: 3, label: 'Townhouse'},
      { id: 4, label: 'Multi Family'},
    ];

    return of(propertyTypes);
  }
}
