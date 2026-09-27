import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FacilityListComponent } from './components/facility-list/facility-list.component';
import { FacilityDetailsComponent } from './components/facility-details/facility-details.component';
import { InspectionFormComponent } from './components/inspection-form/inspection-form.component';
import { ComplaintFormComponent } from './components/complaint-form/complaint-form.component';
import { AddFacilityModalComponent } from './components/add-facility-modal/add-facility-modal.component';
import { Facility } from './models/facility.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DashboardComponent,
    FacilityListComponent,
    FacilityDetailsComponent,
    InspectionFormComponent,
    ComplaintFormComponent,
    AddFacilityModalComponent
  ],
  template: `
    <!-- Top Bar Navigation -->
    <header class="navbar">
      <div class="navbar-brand">
        <div class="brand-icon">F</div>
        <div>
          <h1 class="brand-title">FacilityHygiene Pro</h1>
          <span class="brand-subtitle">Smart Facility Inspection & Management Dashboard</span>
        </div>
      </div>
      <div class="nav-status">
        <span class="status-dot"></span>
        <span>PostgreSQL API Connected</span>
      </div>
    </header>

    <main class="container">
      <!-- Executive KPI Cards -->
      <app-dashboard></app-dashboard>

      <!-- Split Layout: Facility Directory + Active Zone Details -->
      <div class="dashboard-layout">
        <app-facility-list
          (openAddFacility)="showAddFacilityModal = true"
          (openInspectionModal)="openInspection($event)"
        ></app-facility-list>

        <app-facility-details
          (openInspection)="openInspection($event)"
          (openComplaint)="openComplaint($event)"
        ></app-facility-details>
      </div>
    </main>

    <!-- Inspection Modal Dialog -->
    <app-inspection-form
      *ngIf="showInspectionModal"
      [facility]="activeFacility"
      (close)="showInspectionModal = false"
      (submitted)="onInspectionSubmitted()"
    ></app-inspection-form>

    <!-- Complaint Ticket Modal Dialog -->
    <app-complaint-form
      *ngIf="showComplaintModal"
      [facility]="activeFacility"
      (close)="showComplaintModal = false"
      (submitted)="onComplaintSubmitted()"
    ></app-complaint-form>

    <!-- Add Facility Modal Dialog -->
    <app-add-facility-modal
      *ngIf="showAddFacilityModal"
      (close)="showAddFacilityModal = false"
      (created)="onFacilityCreated()"
    ></app-add-facility-modal>
  `
})
export class AppComponent {
  showInspectionModal = false;
  showComplaintModal = false;
  showAddFacilityModal = false;
  activeFacility: Facility | null = null;

  openInspection(facility: Facility): void {
    this.activeFacility = facility;
    this.showInspectionModal = true;
  }

  openComplaint(facility: Facility): void {
    this.activeFacility = facility;
    this.showComplaintModal = true;
  }

  onInspectionSubmitted(): void {
    this.showInspectionModal = false;
  }

  onComplaintSubmitted(): void {
    this.showComplaintModal = false;
  }

  onFacilityCreated(): void {
    this.showAddFacilityModal = false;
  }
}
