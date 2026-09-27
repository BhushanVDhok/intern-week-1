import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FacilityService } from '../../services/facility.service';
import { DashboardMetrics } from '../../models/facility.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metrics-grid" *ngIf="metrics$ | async as m">
      <div class="metric-card">
        <span class="metric-title">Monitored Facilities</span>
        <span class="metric-value">{{ m.total_facilities }}</span>
        <span class="metric-caption">All zones registered</span>
      </div>

      <div class="metric-card">
        <span class="metric-title">Average Hygiene Score</span>
        <span class="metric-value" [style.color]="m.average_cleanliness >= 7 ? '#059669' : '#d97706'">
          {{ m.average_cleanliness }}/10
        </span>
        <span class="metric-caption">Target threshold: ≥ 8.0</span>
      </div>

      <div class="metric-card">
        <span class="metric-title">Critical Attention Zones</span>
        <span class="metric-value" [style.color]="m.critical_facilities > 0 ? '#dc2626' : '#059669'">
          {{ m.critical_facilities }}
        </span>
        <span class="metric-caption">Require immediate cleaning</span>
      </div>

      <div class="metric-card">
        <span class="metric-title">Inspections Recorded</span>
        <span class="metric-value">{{ m.total_inspections }}</span>
        <span class="metric-caption">Audits in past 30 days</span>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  metrics$!: Observable<DashboardMetrics>;

  constructor(private facilityService: FacilityService) {}

  ngOnInit(): void {
    this.metrics$ = this.facilityService.getMetrics();
  }
}
