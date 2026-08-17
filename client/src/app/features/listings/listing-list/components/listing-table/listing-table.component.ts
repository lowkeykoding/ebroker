import {Component, effect, input, signal} from '@angular/core';
import {
  createAngularTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  FlexRenderDirective,
  SortingState,
} from '@tanstack/angular-table';
import {ListingModel, ListingStatusModel} from '../../../../../core/models/listing.model';
import {IconComponent} from '../../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-listing-table',
  standalone: true,
  imports: [
    FlexRenderDirective,
    IconComponent
  ],
  templateUrl: 'listing-table.component.html',
})
export class ListingTableComponent {
  private readonly usd = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0});

  // Inputs
  listings = input.required<ListingModel[]>();
  searchTerm = input.required<string>();
  statusFilter = input.required<number>();

  constructor() {
    effect(() => {
      this.filterStatus()
    });
  }

  // Signals
  sorting = signal<SortingState>([]);

  // Table
  columns: ColumnDef<ListingModel>[] = [
    // {
    //   id: 'checkbox',
    //   enableSorting: false,
    //   header: '',
    //   cell: (info) => '',
    //   size: 30
    // },
    {
      id: 'address',
      accessorFn: (row) => `${row.address}, ${row.city}, ${row.state} ${row.zipCode}`,
      header: 'Address',
    },
    {
      accessorKey: 'listPrice',
      header: 'List Price',
      cell: (info) => `${this.usd.format(info.getValue() as number)}`,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => (info.getValue() as ListingStatusModel)?.label,
      filterFn: (row, columnId, filterValue) =>
        (row.getValue(columnId) as ListingStatusModel).id === filterValue,
      sortingFn: (rowA, rowB, columnId) => rowA.original.status.id - rowB.original.status.id
    },
    {
      accessorKey: 'offerDeadline',
      header: 'Offer Deadline',
      cell: (info) => info.getValue() ? (info.getValue() as Date)?.toLocaleDateString() : "—",
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.offerDeadline;
        const b = rowB.original.offerDeadline;
        if (!a && !b) return 0;
        const isDesc = this.sorting().find(s => s.id === 'offerDeadline')?.desc ?? false;
        if (!a) return isDesc ? -1 : 1;
        if (!b) return isDesc ? 1 : -1;
        return a.getTime() - b.getTime();
      }
    },
    {
      accessorKey: 'daysOnMarket',
      header: 'Days on Market',
    },
    {
      accessorKey: 'offersReceived',
      header: 'Offers',
    },
    {
      accessorKey: 'mlsNumber',
      header: 'MLS #',
    },
    {
      id: 'actions',
      enableSorting: false,
      header: '',
      cell: (info) => info
    },
  ];

  table = createAngularTable<ListingModel>(() => ({
    data: this.listings(),
    columns: this.columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    sortDescFirst: false,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      if (value == null || typeof value === 'object') return false;
      return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
    },
    state: {
      sorting: this.sorting(),
      globalFilter: this.searchTerm(),
    },
    onSortingChange: (updater) => {
      this.sorting.update(old =>
        typeof updater === 'function' ? updater(old) : updater
      );
    },
  }));

  formatCurrency(value: number): string {
    return this.usd.format(value);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  }

  isDeadlineUrgent(date: Date | null): boolean {
    if (!date) return false;
    return date.getTime() - Date.now() < 48 * 60 * 60 * 1000;
  }

  getStatusBadgeClass(status: number): string {
    switch (status) {
      case 1:
        return 'bg-gray-200 text-gray-950';
      case 2:
        return 'bg-emerald-200 text-emerald-950';
      case 3:
        return 'bg-amber-200 text-amber-950';
      case 4:
        return 'bg-blue-200 text-blue-950';
      case 5:
        return 'bg-purple-200 text-purple-950';
      default:
        return 'bg-rose-200 text-rose-950';
    }
  }

  filterStatus() {
    const statusId = this.statusFilter();
    if (statusId === 0) {
      this.table.resetColumnFilters();
    }
    else {
      this.table.getColumn('status')?.setFilterValue(statusId);
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }

  onViewListing(listing: ListingModel): void {
    console.log('View listing:', listing.id);
  }

  onDeleteListing(listing: ListingModel): void {
    console.log('Delete listing:', listing.id);
  }

  getColumnCount(): number {
    return this.columns.length;
  }

  formatSquareFootage(sqft: number): string {
    return sqft.toLocaleString('en-US');
  }
}
