# EBroker — Claude Code Instructions

## Project Overview
EBroker is a real estate listing and offer management web application.
Selling agents manage their listings and receive offers from buying agents.
Buying agents can view public listings and submit offers without an account.

---

## Tech Stack

### Frontend
- Angular 20 (standalone components, signals as primary reactive primitive)
- Spartan UI (brain + helm) for UI components
- TanStack Table via Spartan for data tables
- Tailwind CSS v4 for all styling
- Supabase JS client for authentication only

### Backend
- ASP.NET Core 8 Web API (single project, no class libraries)
- CQRS pattern via MediatR
- Entity Framework Core for database access
- Supabase (PostgreSQL) as the database
- Npgsql as the EF Core provider

### Hosting
- Frontend: Netlify
- Backend: Render
- Database + Auth: Supabase

---

## Angular Architecture

### Guiding Principles
- Signals are the primary reactive primitive — use `signal()`, `computed()`, and `effect()`
- Avoid RxJS unless specifically needed (e.g. `forkJoin` for parallel HTTP calls)
- Standalone components only — never use NgModules
- Functional guards only — never class-based guards
- All components are `standalone: true` by default (configured in angular.json schematics)
- No separate `.css` files — all styling is handled via Tailwind CSS utility classes
- `inlineStyle: true` is set in angular.json so the CLI never generates `.css` files

### Template Strategy
- **All components always use a separate `.html` file** — no exceptions
  - Generated with `templateUrl: './component-name.component.html'`
- **No component ever has a separate `.css` file** — Tailwind handles all styling

---

### Smart / Dumb Component Pattern

Every route maps to a single **page component** (smart component) that acts as
the data orchestrator and state owner for that page. All child components are
**dumb/presentational** — they receive data and emit events only.

#### Page Component Responsibilities
- Inject services and make all API calls for the page
- Own all page-level state via signals
- Derive computed values from state using `computed()`
- Pass data down to child components via `@Input()`
- Handle events emitted from child components via `@Output()`
- Never let child components fetch their own data or inject services

#### Child Component Responsibilities
- Receive data exclusively via `@Input()`
- Emit user interactions exclusively via `@Output()` or signal-based outputs
- Contain no service injections
- Contain no HTTP calls
- Are purely presentational — they render and emit, nothing more

#### Data Flow Rules
- Data flows DOWN from parent to child via `@Input()`
- Events flow UP from child to parent via `@Output()`
- Parent is the single source of truth for all page state
- Use `forkJoin` when multiple API calls must fire simultaneously (prevents data mismatch)
- Derive stats and computed values from existing signals using `computed()` rather than making additional API calls

#### Example: Listings Page
```
ListingListComponent (page/smart — owns all state and service calls)
├── signals:
│   ├── listings = signal<Listing[]>([])
│   ├── statusFilter = signal<string>('all')
│   ├── loading = signal<boolean>(false)
│   └── error = signal<string | null>(null)
│
├── computed:
│   ├── activeCount = computed(() => listings().filter(l => l.status === 'active').length)
│   ├── expiringSoon = computed(() => listings().filter(...).length)
│   └── filteredListings = computed(() => listings().filter by statusFilter)
│
└── child components (dumb/presentational):
    ├── ListingStatsBarComponent     @Input() stats     @Output() filterSelect
    ├── ListingFiltersComponent      @Input() filter    @Output() filterChange
    └── ListingTableComponent        @Input() listings  @Input() filter
```

---

### Folder Structure

Each feature has a dedicated folder. The page component lives at the root of
the feature folder. Each child component lives in its own subfolder within
the feature folder.

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── guest.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── services/
│   │   └── supabase.service.ts
│   └── models/
│       ├── listing.model.ts
│       ├── offer.model.ts
│       └── user.model.ts
│
├── features/
│   ├── auth/
│   │   ├── login/
│   │   │   └── login.component.ts
│   │   └── signup/
│   │       └── signup.component.ts
│   │
│   ├── dashboard/
│   │   └── dashboard.component.ts
│   │
│   ├── listings/
│   │   ├── listing-list/                        ← PAGE component (smart)
│   │   │   ├── listing-list.component.ts
│   │   │   ├── components/                      ← child components folder
│   │   │   │   ├── listing-stats-bar/
│   │   │   │   │   └── listing-stats-bar.component.ts
│   │   │   │   ├── listing-filters/
│   │   │   │   │   └── listing-filters.component.ts
│   │   │   │   └── listing-table/
│   │   │   │       └── listing-table.component.ts
│   │   │   └── listing.service.ts               ← service scoped to this feature
│   │   │
│   │   └── listing-detail/                      ← PAGE component (smart)
│   │       ├── listing-detail.component.ts
│   │       └── components/
│   │           ├── listing-info/
│   │           │   └── listing-info.component.ts
│   │           └── offer-list/
│   │               └── offer-list.component.ts
│   │
│   └── offers/
│       ├── offer-form/                          ← PAGE component (smart, public)
│       │   ├── offer-form.component.ts
│       │   └── components/
│       │       ├── offer-details-form/
│       │       │   └── offer-details-form.component.ts
│       │       └── offer-document-upload/
│       │           └── offer-document-upload.component.ts
│       │
│       └── offer-management/                    ← PAGE component (smart)
│           ├── offer-management.component.ts
│           └── components/
│               ├── offer-table/
│               │   └── offer-table.component.ts
│               └── offer-status-bar/
│                   └── offer-status-bar.component.ts
│
├── layouts/
│   ├── auth-layout/
│   │   └── auth-layout.component.ts
│   └── app-layout/
│       └── app-layout.component.ts
│
└── shared/
    ├── components/
    │   ├── navbar/
    │   │   └── navbar.component.ts
    │   ├── footer/
    │   │   └── footer.component.ts
    │   └── file-upload/
    │       └── file-upload.component.ts
    ├── pipes/
    └── directives/
```

---

### Services
- Feature services (e.g. `listing.service.ts`) live inside the feature folder
  next to the page component they serve
- App-wide singleton services (e.g. `supabase.service.ts`) live in `core/services/`
- Services are injected only into page (smart) components — never into child components

---

### State Management Pattern
```typescript
// Page component state — always use signals
listings = signal<Listing[]>([]);
statusFilter = signal<string>('all');
loading = signal<boolean>(false);
error = signal<string | null>(null);

// Derived state — always use computed()
filteredListings = computed(() => {
  const filter = this.statusFilter();
  const all = this.listings();
  return filter === 'all' ? all : all.filter(l => l.status === filter);
});

activeCount = computed(() =>
  this.listings().filter(l => l.status === 'active').length
);

// Parallel API calls — use forkJoin to prevent data mismatch
ngOnInit() {
  this.loading.set(true);
  forkJoin({
    listings: this.listingService.getListings(),
  }).subscribe({
    next: ({ listings }) => {
      this.listings.set(listings);
      this.loading.set(false);
    },
    error: (err) => {
      this.error.set('Failed to load listings');
      this.loading.set(false);
    }
  });
}
```

---

### Angular CLI Defaults (angular.json schematics)
```json
{
  "schematics": {
    "@schematics/angular:component": {
      "type": "component",
      "standalone": true,
      "inlineStyle": true,
      "inlineTemplate": false
    },
    "@schematics/angular:guard": {
      "functional": true
    },
    "@schematics/angular:pipe": {
      "standalone": true
    },
    "@schematics/angular:directive": {
      "standalone": true
    }
  }
}
```

- `inlineStyle: true` — never generate a `.css` file, Tailwind handles all styling
- `inlineTemplate: false` — always generate a separate `.html` file

---

## ASP.NET Core Architecture

### Project Structure (single project — no class libraries)
```
EBroker.API/
├── Controllers/
│   ├── BaseApiController.cs
│   ├── ListingsController.cs
│   └── OffersController.cs
│
├── Features/                        ← CQRS features folder
│   ├── Listings/
│   │   ├── Commands/
│   │   │   ├── CreateListing/
│   │   │   │   ├── CreateListingCommand.cs
│   │   │   │   └── CreateListingHandler.cs
│   │   │   └── UpdateListing/
│   │   │       ├── UpdateListingCommand.cs
│   │   │       └── UpdateListingHandler.cs
│   │   ├── Queries/
│   │   │   ├── GetListings/
│   │   │   │   ├── GetListingsQuery.cs
│   │   │   │   └── GetListingsHandler.cs
│   │   │   └── GetListingById/
│   │   │       ├── GetListingByIdQuery.cs
│   │   │       └── GetListingByIdHandler.cs
│   │   └── DTOs/
│   │       ├── ListingDto.cs
│   │       └── CreateListingRequest.cs
│   │
│   └── Offers/
│       ├── Commands/
│       │   └── SubmitOffer/
│       │       ├── SubmitOfferCommand.cs
│       │       └── SubmitOfferHandler.cs
│       ├── Queries/
│       │   └── GetOffersByListing/
│       │       ├── GetOffersByListingQuery.cs
│       │       └── GetOffersByListingHandler.cs
│       └── DTOs/
│           ├── OfferDto.cs
│           └── SubmitOfferRequest.cs
│
├── Data/
│   ├── AppDbContext.cs
│   └── Migrations/
│
├── Models/
│   ├── Listing.cs
│   └── Offer.cs
│
├── Middleware/
│   └── ExceptionHandlingMiddleware.cs
│
├── Extensions/
│   └── ServiceCollectionExtensions.cs
│
├── Program.cs
├── appsettings.json
└── appsettings.Development.json
```

---

### CommandResult
All commands return a `CommandResult` — never void. This gives the client
a consistent way to know if an operation succeeded and why it failed.

```csharp
// Common/CommandResult.cs
public class CommandResult
{
    public bool Success { get; init; }
    public List<string> Errors { get; init; } = new();

    public static CommandResult Ok() => new() { Success = true };

    public static CommandResult Fail(string error) => new()
    {
        Success = false,
        Errors = new List<string> { error }
    };

    public static CommandResult Fail(List<string> errors) => new()
    {
        Success = false,
        Errors = errors
    };
}
```

---

### Validation Pattern

Validation is split into two layers:

**Layer 1 — Basic validation on the Command/Query class itself**
Checks that the request is structurally valid — required fields present,
values in valid ranges, strings not empty. This is self-contained and
does not touch the database.

```csharp
public class CreateListingCommand : IRequest<CommandResult>
{
    public string AgentId { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public decimal ListPrice { get; init; }

    public List<string> Validate()
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(Address))
        {
            errors.Add("Address is required.");
        }

        if (ListPrice <= 0)
        {
            errors.Add("List price must be greater than zero.");
        }

        return errors;
    }
}
```

**Layer 2 — Business validation in the Handler**
Checks that the request makes sense given the current state of the database.
Duplicate checks, ownership checks, status checks, etc.

```csharp
public async Task<CommandResult> Handle(
    CreateListingCommand request,
    CancellationToken cancellationToken)
{
    // Layer 1: basic structural validation
    var validationErrors = request.Validate();

    if (validationErrors.Count > 0)
    {
        return CommandResult.Fail(validationErrors);
    }

    // Layer 2: business/contextual validation
    var duplicateListing = await _context.Listings
        .AnyAsync(l => l.AgentId == request.AgentId
            && l.Address == request.Address
            && l.Status == "active", cancellationToken);

    if (duplicateListing)
    {
        return CommandResult.Fail("An active listing already exists for this address.");
    }

    // All good — proceed with the operation
    var listing = new Listing
    {
        AgentId = request.AgentId,
        Address = request.Address,
        ListPrice = request.ListPrice
    };

    _context.Listings.Add(listing);
    await _context.SaveChangesAsync(cancellationToken);

    return CommandResult.Ok();
}
```

**Domain models do NOT contain validation logic.**
Models are plain data representations mapped to database tables — nothing more.

---

### CQRS Pattern Rules
- Every feature action is either a **Command** (mutates data) or a **Query** (reads data)
- Commands and Queries live in `Features/{Domain}/Commands/` or `Features/{Domain}/Queries/`
- Each command/query gets its own subfolder containing the request class and handler class
- All commands return `CommandResult` — never void
- Handlers contain all business logic — controllers are thin and only dispatch to MediatR
- DTOs live in `Features/{Domain}/DTOs/` and are never domain models

#### Controller Pattern (thin controllers)
```csharp
// Query endpoint — return data directly
[HttpGet]
[Authorize]
public async Task<IActionResult> GetListings()
{
    var agentId = GetUserId();
    var listings = await _mediator.Send(new GetListingsQuery(agentId));
    return Ok(listings);
}

// Command endpoint — return CommandResult
[HttpPost]
[Authorize]
public async Task<IActionResult> CreateListing([FromBody] CreateListingRequest request)
{
    var command = new CreateListingCommand
    {
        AgentId = GetUserId(),
        Address = request.Address,
        ListPrice = request.ListPrice
    };

    var result = await _mediator.Send(command);

    if (!result.Success)
    {
        return BadRequest(result.Errors);
    }

    return Ok();
}
```

#### Handler Pattern
```csharp
public class GetListingsHandler : IRequestHandler<GetListingsQuery, List<ListingDto>>
{
    private readonly AppDbContext _context;

    public GetListingsHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ListingDto>> Handle(
        GetListingsQuery request,
        CancellationToken cancellationToken)
    {
        return await _context.Listings
            .Where(l => l.AgentId == request.AgentId)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => new ListingDto
            {
                Id = l.Id,
                Address = l.Address,
                ListPrice = l.ListPrice,
                Status = l.Status
            })
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}
```

---

### Code Style — Readability Over Cleverness

**LINQ for EF Core database queries is encouraged** — EF Core translates
LINQ chains into SQL and chaining is the natural way to express queries.
Keep EF Core queries clean and straightforward.

```csharp
// Good — clean EF Core LINQ query
var listings = await _context.Listings
    .Where(l => l.AgentId == agentId && l.Status == "active")
    .OrderByDescending(l => l.CreatedAt)
    .Select(l => new ListingDto { Id = l.Id, Address = l.Address })
    .AsNoTracking()
    .ToListAsync(cancellationToken);
```

**Avoid complex or deeply nested LINQ** when working with in-memory
collections or when the logic is hard to follow at a glance. If a LINQ
chain requires significant mental effort to understand, break it into
clearly named variables or loops instead.

```csharp
// Avoid — hard to follow at a glance
var result = listings
    .Where(l => l.Offers.Any(o => o.Status == "new" && o.CreatedAt > cutoff))
    .GroupBy(l => l.Status)
    .Select(g => new { Status = g.Key, Count = g.Count() })
    .ToDictionary(x => x.Status, x => x.Count);

// Prefer — broken into readable steps
var listingsWithNewOffers = new List<Listing>();

foreach (var listing in listings)
{
    var hasNewOffers = false;

    foreach (var offer in listing.Offers)
    {
        if (offer.Status == "new" && offer.CreatedAt > cutoff)
        {
            hasNewOffers = true;
            break;
        }
    }

    if (hasNewOffers)
    {
        listingsWithNewOffers.Add(listing);
    }
}

var countByStatus = new Dictionary<string, int>();

foreach (var listing in listingsWithNewOffers)
{
    if (!countByStatus.ContainsKey(listing.Status))
    {
        countByStatus[listing.Status] = 0;
    }

    countByStatus[listing.Status]++;
}
```

**The guiding question:** could a developer unfamiliar with this code
understand exactly what is happening at each step without having to
mentally execute the chain? If yes, the LINQ is fine. If no, break it up.

---

### Entity Framework Rules
- Use `AppDbContext` for all database access — no raw SQL unless absolutely necessary
- Use `AsNoTracking()` on all read-only queries
- Use EF Core migrations for all schema changes
- Never expose domain models directly — always map to DTOs in handlers

---

### Authentication
- Supabase issues JWTs — ASP.NET Core validates them via JWT middleware
- `GetUserId()` in `BaseApiController` extracts the agent's Supabase user ID from the token
- Public endpoints use `[AllowAnonymous]`
- Protected endpoints use `[Authorize]`

---

### Naming Conventions

#### Angular
- Page components: `{feature-name}.component.ts` (e.g. `listing-list.component.ts`)
- Child components: `{descriptive-block-name}.component.ts` (e.g. `listing-stats-bar.component.ts`)
- Services: `{feature}.service.ts` (e.g. `listing.service.ts`)
- Models/interfaces: `{name}.model.ts` (e.g. `listing.model.ts`)
- Guards: `{name}.guard.ts` (e.g. `auth.guard.ts`)

#### ASP.NET Core
- Commands: `{Action}{Entity}Command.cs` (e.g. `CreateListingCommand.cs`)
- Queries: `{Action}{Entity}Query.cs` (e.g. `GetListingsQuery.cs`)
- Handlers: `{Action}{Entity}Handler.cs` (e.g. `GetListingsHandler.cs`)
- DTOs: `{Entity}Dto.cs` (e.g. `ListingDto.cs`)
- Request models: `{Action}{Entity}Request.cs` (e.g. `CreateListingRequest.cs`)

---

## Important Rules — Do Not Violate

### Angular
- NEVER inject services into child (dumb) components
- NEVER make HTTP calls inside child components
- NEVER use NgModules — standalone components only
- NEVER use class-based guards — functional guards only
- NEVER generate or use separate `.css` files — Tailwind only
- NEVER use inline templates — all components always use a separate `.html` file
- NEVER generate or use separate `.css` files — Tailwind only
- ALWAYS use signals for state, computed() for derived state
- ALWAYS place child components in a `components/` subfolder within the page folder
- ALWAYS derive stats and counts from existing signals using computed() rather than extra API calls



### ASP.NET Core
- NEVER put business logic in controllers — controllers only dispatch to MediatR
- NEVER expose domain models directly from endpoints — always use DTOs
- NEVER add additional class library projects — single project only
- NEVER put validation logic on domain models — models are plain data representations only
- NEVER return void from a command — always return CommandResult
- ALWAYS use AsNoTracking() on read queries
- ALWAYS run Layer 1 (Validate()) before Layer 2 (business validation) in handlers
- ALWAYS validate that the authenticated agent owns the resource before mutating it
- ALWAYS prefer readable EF Core LINQ for database queries
- ALWAYS break complex in-memory LINQ into loops or named variables for readability