# Day 9 — Angular + TypeScript + API Integration

## What This Day Covers

Day 9 introduces **Angular 17** as a production-grade frontend framework, combining it with TypeScript strict mode, RxJS reactive state management, Angular Reactive Forms, and REST API integration. The application is a **Facility Inspection Dashboard** that monitors hygiene standards across multiple zones, logs physical audits, and manages complaint tickets.

---

## Objectives

- Build an Angular SPA using Standalone Components (no `NgModule`)
- Define TypeScript interfaces and DTOs for all data models
- Manage application state using RxJS `BehaviorSubject` and `Observable` streams
- Subscribe to and compose observables using `map`, `tap`, `catchError`
- Build validated forms using Angular's Reactive Forms API (`FormBuilder`, `FormGroup`, `Validators`)
- Integrate with a REST API using Angular's `HttpClient`
- Handle HTTP errors gracefully and provide user feedback

---

## Folder Structure

```text
day-09/
├── angular-app/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── dashboard/            # KPI metric cards component
│   │   │   │   ├── facility-list/        # Search, filter, sort, facilities table
│   │   │   │   ├── facility-details/     # Selected facility: inspection history + complaints
│   │   │   │   ├── inspection-form/      # Reactive form modal: log a physical audit
│   │   │   │   ├── complaint-form/       # Reactive form modal: file a complaint ticket
│   │   │   │   └── add-facility-modal/  # Reactive form modal: register a new facility
│   │   │   ├── models/
│   │   │   │   ├── facility.model.ts     # Facility, DashboardMetrics interfaces
│   │   │   │   ├── inspection.model.ts   # Inspection, CreateInspectionDto
│   │   │   │   └── complaint.model.ts    # Complaint, CreateComplaintDto
│   │   │   ├── services/
│   │   │   │   ├── facility.service.ts   # State store + HTTP: facilities, metrics
│   │   │   │   ├── inspection.service.ts # HTTP: inspection submission + score sync
│   │   │   │   └── complaint.service.ts  # HTTP: complaint creation and resolution
│   │   │   ├── app.component.ts          # Root component: layout + modal coordination
│   │   │   └── app.config.ts             # Application providers (provideHttpClient)
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css                    # Clean, responsive global CSS
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   └── tsconfig.app.json
├── api-integration/
│   ├── api-client.ts      # TypeScript API client with typed response interfaces
│   ├── mock-server.js     # Express API bridge on port 8000 (matches Day 8 endpoints)
│   └── package.json
└── README.md
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 17+ (Standalone Components) |
| Language | TypeScript 5.4+ (strict mode) |
| Reactive State | RxJS 7.8 (`Observable`, `BehaviorSubject`, `map`, `tap`, `catchError`) |
| Forms | Angular Reactive Forms (`FormBuilder`, `FormGroup`, `Validators`) |
| HTTP | Angular `HttpClient` (via `provideHttpClient()`) |
| Styling | Vanilla CSS (clean, responsive, no exaggerated effects) |
| API | REST — connects to Day 8 backend or the included mock server |

---

## Component Architecture

```
AppComponent (root — layout, modal coordinator)
  ├── DashboardComponent       — KPI cards
  ├── FacilityListComponent    — search, filter, sort, table
  │     └── [row click] → FacilityDetailsComponent
  │                         ├── Inspection history log
  │                         └── Complaints list
  └── Modal dialogs (conditionally rendered by AppComponent)
        ├── InspectionFormComponent  — Reactive Form: log audit
        ├── ComplaintFormComponent   — Reactive Form: file ticket
        └── AddFacilityModalComponent — Reactive Form: add facility
```

---

## Key Features

### 1. Dashboard Metrics (`DashboardComponent`)
Displays four KPI cards calculated from the `BehaviorSubject` state:
- Total monitored facilities
- Average hygiene score (green/amber/red based on value)
- Critical attention zones count
- Number of inspections recorded in the past 30 days

### 2. Facility Directory (`FacilityListComponent`)
- Search input — filters by facility name or location in real time
- Status dropdown — filter to show only Good / Needs Cleaning / Under Maintenance / Critical
- Sort controls — by cleanliness score (High→Low, Low→High) and alphabetically by name
- Table with status badges; clicking a row opens the details panel

### 3. Facility Details (`FacilityDetailsComponent`)
- Inspection history table (most recent first) — date, scores, waste level, notes
- Complaint list — title, priority badge, status, resolve button
- "Log Audit" and "File Complaint" buttons open the respective modal

### 4. Inspection Form Modal (`InspectionFormComponent`)
Angular Reactive Form with validators:

| Field | Validator |
|-------|-----------|
| `facility_id` | Required |
| `cleanliness_score` | Required, min 1, max 10 |
| `odor_score` | Required, min 1, max 10 |
| `waste_level` | Required |
| `water_available` | Required |
| `notes` | Optional, max length 500 |

On valid submit: POST to `/api/inspections` → facility scores update atomically in DB → UI state reloads from `BehaviorSubject`.

### 5. Complaint Form Modal (`ComplaintFormComponent`)
Fields: affected facility (required), incident summary (required), priority (Low/Medium/High/Urgent), details (required). POST to `/api/complaints`.

---

## RxJS State Management Pattern

Each service holds a `BehaviorSubject` as the source of truth:

```typescript
// facility.service.ts
private facilitiesSubject = new BehaviorSubject<Facility[]>([]);
facilities$ = this.facilitiesSubject.asObservable();

loadFacilities(): Observable<Facility[]> {
  return this.http.get<ApiResponse<Facility[]>>('/api/facilities').pipe(
    map(res => res.data),
    tap(data => this.facilitiesSubject.next(data)),
    catchError(err => { this.facilitiesSubject.next([]); throw err; })
  );
}
```

Components use the `async` pipe to subscribe: `*ngFor="let f of facilities$ | async"`.

---

## API Integration

The Angular app targets `http://localhost:8000/api` (the Day 8 backend or the mock server).

### Start the API (mock server — no PHP needed)
```powershell
cd day-09/api-integration
npm install
npm start
```
API runs at `http://localhost:8000`.

### Start the Angular App
```powershell
cd day-09/angular-app
npm install
npm start
```
Dashboard runs at `http://localhost:4200`.

---

## Key Concepts Demonstrated

1. **Standalone components** — each component uses `imports: []` directly; no `NgModule`
2. **RxJS BehaviorSubject** — acts as an in-memory state store; components subscribe via the `async` pipe
3. **`catchError` operator** — API failures are caught at the service level, preventing uncaught errors in components
4. **Reactive Forms** — `FormBuilder.group()` with typed validators; `form.valid` gates submit; per-field error messages
5. **Angular `HttpClient` typed responses** — `http.get<ApiResponse<Facility[]>>()` gives TypeScript full type inference on the response data
6. **`async` pipe** — automatically subscribes and unsubscribes from observables; prevents memory leaks

---

## Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| Components re-fetching data after every action, causing visible flicker | Kept the `BehaviorSubject` as the source of truth; components read from it; API responses update it silently |
| Reactive Form validators preventing submit when the user hasn't touched a field | Called `form.markAllAsTouched()` on submit attempt so all error messages appear at once |
| `HttpClient` returning untyped `any` without explicit generics | Defined `ApiResponse<T>` interface and used it as the generic parameter on every HTTP call |
