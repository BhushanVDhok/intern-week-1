import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Inspection, CreateInspectionDto } from '../models/inspection.model';
import { FacilityService } from './facility.service';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  private apiUrl = 'http://localhost:8000/api/inspections';

  private initialInspections: Inspection[] = [
    { id: 1, facility_id: 1, facility_name: 'Terminal 1 Restrooms', cleanliness_score: 9, odor_score: 2, waste_level: 'Low', water_available: true, notes: 'Dispensers filled and clean floors.', inspection_date: '2026-09-20' },
    { id: 2, facility_id: 1, facility_name: 'Terminal 1 Restrooms', cleanliness_score: 8, odor_score: 3, waste_level: 'Low', water_available: true, notes: 'Morning shift inspection.', inspection_date: '2026-09-24' },
    { id: 3, facility_id: 2, facility_name: 'Food Court Washrooms', cleanliness_score: 4, odor_score: 7, waste_level: 'High', water_available: true, notes: 'Heavy footfall trash overflow.', inspection_date: '2026-09-22' },
    { id: 4, facility_id: 2, facility_name: 'Food Court Washrooms', cleanliness_score: 3, odor_score: 8, waste_level: 'High', water_available: false, notes: 'Water sensor offline, strong odor.', inspection_date: '2026-09-25' },
    { id: 5, facility_id: 3, facility_name: 'Central Atrium Restrooms', cleanliness_score: 6, odor_score: 4, waste_level: 'Medium', water_available: true, notes: 'Tile repair in progress.', inspection_date: '2026-09-21' },
    { id: 6, facility_id: 4, facility_name: 'East Wing Restrooms', cleanliness_score: 9, odor_score: 1, waste_level: 'Low', water_available: true, notes: 'Spotless condition.', inspection_date: '2026-09-23' },
    { id: 7, facility_id: 5, facility_name: 'Cargo Bay Washrooms', cleanliness_score: 3, odor_score: 9, waste_level: 'High', water_available: false, notes: 'Drainage backup detected.', inspection_date: '2026-09-25' }
  ];

  private inspectionsSubject = new BehaviorSubject<Inspection[]>(this.initialInspections);
  public inspections$ = this.inspectionsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private facilityService: FacilityService
  ) {}

  public getInspections(facilityId?: number): Observable<Inspection[]> {
    return this.inspections$.pipe(
      map(list => facilityId ? list.filter(i => i.facility_id === facilityId) : list)
    );
  }

  public addInspection(dto: CreateInspectionDto): Observable<Inspection> {
    const newRecord: Inspection = {
      id: this.inspectionsSubject.value.length + 1,
      ...dto,
      inspector_name: 'Inspector Sarah',
      created_at: new Date().toISOString()
    };

    return this.http.post<{ success: boolean; data: Inspection }>(this.apiUrl, dto)
      .pipe(
        map(res => res.data),
        catchError(() => of(newRecord)),
        tap(saved => {
          const current = this.inspectionsSubject.value;
          this.inspectionsSubject.next([saved, ...current]);
          // Sync parent facility status & rating
          this.facilityService.updateFacilityScore(
            saved.facility_id,
            saved.cleanliness_score,
            saved.odor_score,
            saved.waste_level
          );
        })
      );
  }
}
