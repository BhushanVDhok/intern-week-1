import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacilityService } from '../../services/facility.service';

@Component({
  selector: 'app-add-facility-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-main);">Add New Facility Zone</h3>
          <button (click)="close.emit()" style="background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-muted);">&times;</button>
        </div>

        <form [formGroup]="facilityForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Facility Name</label>
            <input type="text" formControlName="name" class="form-control" placeholder="e.g. West Wing Restrooms" />
          </div>

          <div class="form-group">
            <label class="form-label">Physical Location</label>
            <input type="text" formControlName="location" class="form-control" placeholder="e.g. Building D - Level 1" />
          </div>

          <div class="form-group">
            <label class="form-label">Daily Capacity (Persons)</label>
            <input type="number" formControlName="capacity" class="form-control" placeholder="100" />
          </div>

          <div class="form-group">
            <label class="form-label">Initial Status</label>
            <select formControlName="status" class="form-control">
              <option value="Good">Good</option>
              <option value="Needs Cleaning">Needs Cleaning</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button type="button" class="btn btn-outline" (click)="close.emit()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="facilityForm.invalid">Save Facility</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddFacilityModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  facilityForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private facilityService: FacilityService
  ) {}

  ngOnInit(): void {
    this.facilityForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      capacity: [100, [Validators.required, Validators.min(1)]],
      status: ['Good', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.facilityForm.invalid) return;

    this.facilityService.addFacility(this.facilityForm.value).subscribe(() => {
      this.created.emit();
      this.close.emit();
    });
  }
}
