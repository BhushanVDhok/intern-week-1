import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Complaint, CreateComplaintDto } from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:8000/api/complaints';

  private initialComplaints: Complaint[] = [
    { id: 1, facility_id: 2, facility_name: 'Food Court Washrooms', complaint_title: 'Trash overflow', description: 'Bin overflowing near entrance.', priority: 'High', status: 'Pending', created_at: '2026-09-25T10:00:00Z' },
    { id: 2, facility_id: 5, facility_name: 'Cargo Bay Washrooms', complaint_title: 'Strong sewer odor', description: 'Drain odor leaking into hall.', priority: 'Urgent', status: 'Pending', created_at: '2026-09-25T11:30:00Z' },
    { id: 3, facility_id: 1, facility_name: 'Terminal 1 Restrooms', complaint_title: 'Empty soap dispenser', description: 'Stall 2 soap dispenser empty.', priority: 'Low', status: 'Resolved', created_at: '2026-09-24T14:15:00Z' },
    { id: 4, facility_id: 3, facility_name: 'Central Atrium Restrooms', complaint_title: 'Leaking faucet', description: 'Continuous tap leak.', priority: 'Medium', status: 'In Progress', created_at: '2026-09-25T09:00:00Z' }
  ];

  private complaintsSubject = new BehaviorSubject<Complaint[]>(this.initialComplaints);
  public complaints$ = this.complaintsSubject.asObservable();

  constructor(private http: HttpClient) {}

  public getComplaints(facilityId?: number): Observable<Complaint[]> {
    return this.complaints$.pipe(
      map(list => facilityId ? list.filter(c => c.facility_id === facilityId) : list)
    );
  }

  public addComplaint(dto: CreateComplaintDto): Observable<Complaint> {
    const newComplaint: Complaint = {
      id: this.complaintsSubject.value.length + 1,
      facility_id: dto.facility_id,
      complaint_title: dto.complaint_title,
      description: dto.description,
      priority: dto.priority,
      status: 'Pending',
      created_at: new Date().toISOString()
    };

    return this.http.post<{ success: boolean; data: Complaint }>(this.apiUrl, dto)
      .pipe(
        map(res => res.data),
        catchError(() => of(newComplaint)),
        tap(saved => {
          const current = this.complaintsSubject.value;
          this.complaintsSubject.next([saved, ...current]);
        })
      );
  }

  public updateStatus(id: number, status: 'Pending' | 'In Progress' | 'Resolved'): void {
    const current = this.complaintsSubject.value;
    const updated = current.map(c => c.id === id ? { ...c, status } : c);
    this.complaintsSubject.next(updated);

    this.http.put(`${this.apiUrl}/${id}`, { status }).pipe(
      catchError(() => of(null))
    ).subscribe();
  }
}
