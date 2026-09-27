import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityService } from '../../services/facility.service';
import { InspectionService } from '../../services/inspection.service';
import { ComplaintService } from '../../services/complaint.service';
import { Facility } from '../../models/facility.model';
import { Inspection } from '../../models/inspection.model';
import { Complaint } from '../../models/complaint.model';

@Component({
  selector: 'app-facility-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" *ngIf="selectedFacility; else noSelection">
      <!-- Header -->
      <div class="card-header">
        <div>
          <span style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Zone Detail</span>
          <h2 class="card-title">{{ selectedFacility.name }}</h2>
          <span style="font-size: 12px; color: var(--text-muted);">{{ selectedFacility.location }}</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-primary btn-sm" (click)="openInspection.emit(selectedFacility)">
            + Audit
          </button>
          <button class="btn btn-outline btn-sm" (click)="openComplaint.emit(selectedFacility)">
            + Ticket
          </button>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
        <div style="background: #f8fafc; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); text-align: center;">
          <div style="font-size: 11px; color: var(--text-muted);">Cleanliness</div>
          <div style="font-size: 18px; font-weight: 700; color: #0f172a;">{{ selectedFacility.cleanliness_score }}/10</div>
        </div>
        <div style="background: #f8fafc; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); text-align: center;">
          <div style="font-size: 11px; color: var(--text-muted);">Odor Level</div>
          <div style="font-size: 18px; font-weight: 700; color: #0f172a;">{{ selectedFacility.odor_score }}/10</div>
        </div>
        <div style="background: #f8fafc; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); text-align: center;">
          <div style="font-size: 11px; color: var(--text-muted);">Footfall</div>
          <div style="font-size: 18px; font-weight: 700; color: #0f172a;">{{ selectedFacility.footfall }}</div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div style="display: flex; gap: 16px; border-bottom: 1px solid var(--border-color); margin-bottom: 14px;">
        <button
          style="background: none; border: none; padding-bottom: 8px; font-size: 13px; font-weight: 600; cursor: pointer;"
          [style.color]="activeTab === 'inspections' ? 'var(--primary)' : 'var(--text-muted)'"
          [style.border-bottom]="activeTab === 'inspections' ? '2px solid var(--primary)' : 'none'"
          (click)="activeTab = 'inspections'"
        >
          Inspection History ({{ facilityInspections.length }})
        </button>
        <button
          style="background: none; border: none; padding-bottom: 8px; font-size: 13px; font-weight: 600; cursor: pointer;"
          [style.color]="activeTab === 'complaints' ? 'var(--primary)' : 'var(--text-muted)'"
          [style.border-bottom]="activeTab === 'complaints' ? '2px solid var(--primary)' : 'none'"
          (click)="activeTab = 'complaints'"
        >
          Complaints ({{ facilityComplaints.length }})
        </button>
      </div>

      <!-- Tab Content: Inspections -->
      <div *ngIf="activeTab === 'inspections'">
        <div *ngIf="facilityInspections.length > 0; else noInspections" style="display: flex; flex-direction: column; gap: 10px;">
          <div
            *ngFor="let ins of facilityInspections"
            style="padding: 10px 12px; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px;"
          >
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-weight: 600; color: var(--text-main);">Score: {{ ins.cleanliness_score }}/10 (Odor: {{ ins.odor_score }}/10)</span>
              <span style="color: var(--text-muted);">{{ ins.inspection_date }}</span>
            </div>
            <div style="color: var(--text-muted); margin-bottom: 4px;">
              Waste: <strong>{{ ins.waste_level }}</strong> | Water: {{ ins.water_available ? 'Available' : 'Unavailable' }}
            </div>
            <p *ngIf="ins.notes" style="color: var(--text-main); font-style: italic;">
              "{{ ins.notes }}"
            </p>
          </div>
        </div>
        <ng-template #noInspections>
          <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">
            No inspections logged yet for this facility.
          </div>
        </ng-template>
      </div>

      <!-- Tab Content: Complaints -->
      <div *ngIf="activeTab === 'complaints'">
        <div *ngIf="facilityComplaints.length > 0; else noComplaints" style="display: flex; flex-direction: column; gap: 10px;">
          <div
            *ngFor="let c of facilityComplaints"
            style="padding: 10px 12px; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 12px;"
          >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-weight: 600;">{{ c.complaint_title }}</span>
              <span class="badge" [ngClass]="{
                'badge-critical': c.priority === 'Urgent' || c.priority === 'High',
                'badge-warning': c.priority === 'Medium',
                'badge-good': c.status === 'Resolved'
              }">
                {{ c.status }}
              </span>
            </div>
            <p style="color: var(--text-muted); margin-bottom: 6px;">{{ c.description }}</p>
            <div *ngIf="c.status !== 'Resolved'" style="text-align: right;">
              <button class="btn btn-outline btn-sm" (click)="resolveComplaint(c.id)">
                ✓ Mark Resolved
              </button>
            </div>
          </div>
        </div>
        <ng-template #noComplaints>
          <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">
            No active complaints recorded.
          </div>
        </ng-template>
      </div>
    </div>

    <ng-template #noSelection>
      <div class="card" style="padding: 40px; text-align: center; color: var(--text-muted);">
        Select a facility from the directory to inspect history and manage complaints.
      </div>
    </ng-template>
  `
})
export class FacilityDetailsComponent implements OnInit {
  @Output() openInspection = new EventEmitter<Facility>();
  @Output() openComplaint = new EventEmitter<Facility>();

  selectedFacility: Facility | null = null;
  facilityInspections: Inspection[] = [];
  facilityComplaints: Complaint[] = [];
  activeTab: 'inspections' | 'complaints' = 'inspections';

  constructor(
    private facilityService: FacilityService,
    private inspectionService: InspectionService,
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    this.facilityService.selectedFacility$.subscribe(facility => {
      this.selectedFacility = facility;
      if (facility) {
        this.loadDetails(facility.id);
      }
    });

    this.inspectionService.inspections$.subscribe(() => {
      if (this.selectedFacility) {
        this.loadDetails(this.selectedFacility.id);
      }
    });

    this.complaintService.complaints$.subscribe(() => {
      if (this.selectedFacility) {
        this.loadDetails(this.selectedFacility.id);
      }
    });
  }

  loadDetails(facilityId: number): void {
    this.inspectionService.getInspections(facilityId).subscribe(list => {
      this.facilityInspections = list;
    });

    this.complaintService.getComplaints(facilityId).subscribe(list => {
      this.facilityComplaints = list;
    });
  }

  resolveComplaint(id: number): void {
    this.complaintService.updateStatus(id, 'Resolved');
  }
}
