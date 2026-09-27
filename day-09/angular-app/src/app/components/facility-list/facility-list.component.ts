import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacilityService } from '../../services/facility.service';
import { Facility } from '../../models/facility.model';

@Component({
  selector: 'app-facility-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Facilities Directory</h2>
        <button class="btn btn-primary" (click)="openAddFacility.emit()">
          + Add Facility
        </button>
      </div>

      <!-- Controls: Search, Filter & Sort -->
      <div class="filter-bar">
        <input
          type="text"
          class="input-search"
          placeholder="Search by facility name or location..."
          [(ngModel)]="searchQuery"
          (ngModelChange)="applyFilters()"
        />

        <select class="select-filter" [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()">
          <option value="">All Statuses</option>
          <option value="Good">Good</option>
          <option value="Needs Cleaning">Needs Cleaning</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Critical">Critical</option>
        </select>

        <select class="select-filter" [(ngModel)]="sortOrder" (ngModelChange)="applyFilters()">
          <option value="score-desc">Score: High to Low</option>
          <option value="score-asc">Score: Low to High</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
      </div>

      <!-- Table View -->
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Zone / Facility</th>
              <th>Location</th>
              <th>Cleanliness</th>
              <th>Waste</th>
              <th>Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let f of filteredFacilities"
              [class.selected]="selectedFacilityId === f.id"
              (click)="onSelect(f)"
            >
              <td>
                <div style="font-weight: 600;">{{ f.name }}</div>
                <div style="font-size: 11px; color: var(--text-muted);">Capacity: {{ f.capacity }}</div>
              </td>
              <td style="color: var(--text-muted);">{{ f.location }}</td>
              <td>
                <div class="score-pill">
                  <span>{{ f.cleanliness_score }}</span>
                  <div class="score-bar-bg">
                    <div
                      class="score-bar-fill"
                      [style.width.%]="f.cleanliness_score * 10"
                      [style.background]="getScoreColor(f.cleanliness_score)"
                    ></div>
                  </div>
                </div>
              </td>
              <td>
                <span
                  class="badge"
                  [ngClass]="{
                    'badge-good': f.waste_level === 'Low',
                    'badge-warning': f.waste_level === 'Medium',
                    'badge-critical': f.waste_level === 'High'
                  }"
                >
                  {{ f.waste_level }}
                </span>
              </td>
              <td>
                <span
                  class="badge"
                  [ngClass]="{
                    'badge-good': f.status === 'Good',
                    'badge-warning': f.status === 'Needs Cleaning',
                    'badge-critical': f.status === 'Critical'
                  }"
                >
                  {{ f.status }}
                </span>
              </td>
              <td style="text-align: right;">
                <button
                  class="btn btn-outline btn-sm"
                  (click)="onLogAudit($event, f)"
                >
                  Log Audit
                </button>
              </td>
            </tr>

            <tr *ngIf="filteredFacilities.length === 0">
              <td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">
                No matching facilities found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class FacilityListComponent implements OnInit {
  @Output() openAddFacility = new EventEmitter<void>();
  @Output() openInspectionModal = new EventEmitter<Facility>();

  allFacilities: Facility[] = [];
  filteredFacilities: Facility[] = [];

  searchQuery = '';
  statusFilter = '';
  sortOrder = 'score-desc';
  selectedFacilityId: number | null = null;

  constructor(private facilityService: FacilityService) {}

  ngOnInit(): void {
    this.facilityService.getFacilities().subscribe(list => {
      this.allFacilities = list;
      this.applyFilters();
      if (!this.selectedFacilityId && list.length > 0) {
        this.selectedFacilityId = list[0].id;
        this.facilityService.selectFacility(list[0]);
      }
    });
  }

  applyFilters(): void {
    let result = [...this.allFacilities];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(f =>
        f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q)
      );
    }

    if (this.statusFilter) {
      result = result.filter(f => f.status === this.statusFilter);
    }

    if (this.sortOrder === 'score-desc') {
      result.sort((a, b) => b.cleanliness_score - a.cleanliness_score);
    } else if (this.sortOrder === 'score-asc') {
      result.sort((a, b) => a.cleanliness_score - b.cleanliness_score);
    } else if (this.sortOrder === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredFacilities = result;
  }

  onSelect(facility: Facility): void {
    this.selectedFacilityId = facility.id;
    this.facilityService.selectFacility(facility);
  }

  onLogAudit(event: Event, facility: Facility): void {
    event.stopPropagation();
    this.openInspectionModal.emit(facility);
  }

  getScoreColor(score: number): string {
    if (score >= 7.5) return '#10b981';
    if (score >= 5.0) return '#f59e0b';
    return '#ef4444';
  }
}
