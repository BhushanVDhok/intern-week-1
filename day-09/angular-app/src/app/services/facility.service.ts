import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Facility, DashboardMetrics } from '../models/facility.model';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private apiUrl = 'http://localhost:8000/api/facilities';

  // Fallback initial data (PostgreSQL database mirror)
  private initialMockFacilities: Facility[] = [
    { id: 1, name: 'Terminal 1 Restrooms', location: 'Building A - Concourse 1', capacity: 120, status: 'Good', cleanliness_score: 8.5, odor_score: 2.0, waste_level: 'Low', footfall: 1250, inspections_count: 2, complaints_count: 1 },
    { id: 2, name: 'Food Court Washrooms', location: 'Building B - Level 2', capacity: 200, status: 'Needs Cleaning', cleanliness_score: 4.2, odor_score: 7.5, waste_level: 'High', footfall: 3400, inspections_count: 2, complaints_count: 2 },
    { id: 3, name: 'Central Atrium Restrooms', location: 'Main Hub - Floor 1', capacity: 150, status: 'Under Maintenance', cleanliness_score: 6.0, odor_score: 4.0, waste_level: 'Medium', footfall: 1800, inspections_count: 1, complaints_count: 1 },
    { id: 4, name: 'East Wing Restrooms', location: 'Building C - Floor 3', capacity: 80, status: 'Good', cleanliness_score: 9.0, odor_score: 1.5, waste_level: 'Low', footfall: 620, inspections_count: 1, complaints_count: 0 },
    { id: 5, name: 'Cargo Bay Washrooms', location: 'Hangar 4 - Ground', capacity: 50, status: 'Critical', cleanliness_score: 3.1, odor_score: 8.8, waste_level: 'High', footfall: 450, inspections_count: 1, complaints_count: 1 }
  ];

  // RxJS BehaviorSubjects for state management
  private facilitiesSubject = new BehaviorSubject<Facility[]>(this.initialMockFacilities);
  public facilities$ = this.facilitiesSubject.asObservable();

  private selectedFacilitySubject = new BehaviorSubject<Facility | null>(this.initialMockFacilities[0]);
  public selectedFacility$ = this.selectedFacilitySubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFacilities();
  }

  public loadFacilities(): void {
    this.http.get<{ success: boolean; data: Facility[] }>(this.apiUrl)
      .pipe(
        map(res => res.data),
        catchError(() => {
          console.warn('[FacilityService] Using offline mock data (Backend not detected)');
          return of(this.facilitiesSubject.value);
        })
      )
      .subscribe(data => {
        if (data && data.length > 0) {
          this.facilitiesSubject.next(data);
        }
      });
  }

  public getFacilities(): Observable<Facility[]> {
    return this.facilities$;
  }

  public selectFacility(facility: Facility): void {
    this.selectedFacilitySubject.next(facility);
  }

  public getFacilityById(id: number): Observable<Facility | undefined> {
    return this.facilities$.pipe(
      map(list => list.find(f => f.id === id))
    );
  }

  public addFacility(facilityData: Partial<Facility>): Observable<Facility> {
    const newFacility: Facility = {
      id: this.facilitiesSubject.value.length + 1,
      name: facilityData.name || 'New Facility',
      location: facilityData.location || 'General Area',
      capacity: facilityData.capacity || 100,
      status: facilityData.status || 'Good',
      cleanliness_score: 8.0,
      odor_score: 2.0,
      waste_level: 'Low',
      footfall: 0,
      inspections_count: 0,
      complaints_count: 0
    };

    return this.http.post<{ success: boolean; data: Facility }>(this.apiUrl, facilityData)
      .pipe(
        map(res => res.data),
        catchError(() => of(newFacility)),
        tap(created => {
          const current = this.facilitiesSubject.value;
          this.facilitiesSubject.next([...current, created]);
        })
      );
  }

  public updateFacilityScore(facilityId: number, cleanliness: number, odor: number, waste: 'Low' | 'Medium' | 'High'): void {
    const current = this.facilitiesSubject.value;
    const updated = current.map(f => {
      if (f.id === facilityId) {
        let status: 'Good' | 'Needs Cleaning' | 'Critical' = 'Good';
        if (cleanliness <= 3) status = 'Critical';
        else if (cleanliness <= 6) status = 'Needs Cleaning';

        return {
          ...f,
          cleanliness_score: cleanliness,
          odor_score: odor,
          waste_level: waste,
          status,
          inspections_count: (f.inspections_count || 0) + 1
        };
      }
      return f;
    });

    this.facilitiesSubject.next(updated);
    if (this.selectedFacilitySubject.value?.id === facilityId) {
      const active = updated.find(f => f.id === facilityId) || null;
      this.selectedFacilitySubject.next(active);
    }
  }

  public getMetrics(): Observable<DashboardMetrics> {
    return this.facilities$.pipe(
      map(facilities => {
        const total = facilities.length;
        const avg = total > 0 ? facilities.reduce((sum, f) => sum + f.cleanliness_score, 0) / total : 0;
        const critical = facilities.filter(f => f.status === 'Critical').length;
        const needsCleaning = facilities.filter(f => f.status === 'Needs Cleaning').length;
        const totalInspections = facilities.reduce((sum, f) => sum + (f.inspections_count || 0), 0);

        return {
          total_facilities: total,
          average_cleanliness: Math.round(avg * 10) / 10,
          critical_facilities: critical,
          needs_cleaning: needsCleaning,
          pending_complaints: 2,
          total_inspections: totalInspections
        };
      })
    );
  }
}
