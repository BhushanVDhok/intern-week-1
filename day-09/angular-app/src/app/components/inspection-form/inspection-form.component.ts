import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InspectionService } from '../../services/inspection.service';
import { Facility } from '../../models/facility.model';

@Component({
  selector: 'app-inspection-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 16px; font-weight: 700; color: var(--text-main);">Log Facility Inspection</h3>
            <span style="font-size: 12px; color: var(--text-muted);">{{ facility?.name }} (ID #{{ facility?.id }})</span>
          </div>
          <button (click)="close.emit()" style="background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-muted);">&times;</button>
        </div>

        <form [formGroup]="inspectionForm" (ngSubmit)="onSubmit()">
          <!-- Cleanliness Score Slider -->
          <div class="form-group">
            <div style="display: flex; justify-content: space-between;">
              <label class="form-label">Cleanliness Rating (1 - 10)</label>
              <span style="font-weight: 700; color: var(--primary);">{{ inspectionForm.get('cleanliness_score')?.value }}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              formControlName="cleanliness_score"
              class="form-control"
              style="padding: 2px 0;"
            />
            <div class="form-hint">1 = Extreme Neglect, 10 = Spotless Standard</div>
          </div>

          <!-- Odor Score Slider -->
          <div class="form-group">
            <div style="display: flex; justify-content: space-between;">
              <label class="form-label">Odor Intensity (1 - 10)</label>
              <span style="font-weight: 700; color: #d97706;">{{ inspectionForm.get('odor_score')?.value }}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              formControlName="odor_score"
              class="form-control"
              style="padding: 2px 0;"
            />
            <div class="form-hint">1 = Completely Neutral, 10 = Severe Foul Odor</div>
          </div>

          <!-- Waste Level Dropdown -->
          <div class="form-group">
            <label class="form-label">Waste Receptacle Status</label>
            <select formControlName="waste_level" class="form-control">
              <option value="Low">Low (&lt; 30% full)</option>
              <option value="Medium">Medium (30% - 70% full)</option>
              <option value="High">High (&gt; 70% / Overflowing)</option>
            </select>
          </div>

          <!-- Water Availability Checkbox -->
          <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="waterCheck" formControlName="water_available" style="width: 16px; height: 16px;" />
            <label for="waterCheck" class="form-label" style="margin-bottom: 0; cursor: pointer;">
              Water supply & faucets functioning
            </label>
          </div>

          <!-- Inspection Date -->
          <div class="form-group">
            <label class="form-label">Audit Date</label>
            <input type="date" formControlName="inspection_date" class="form-control" />
          </div>

          <!-- Notes -->
          <div class="form-group">
            <label class="form-label">Inspector Observations / Notes</label>
            <textarea
              formControlName="notes"
              class="form-control"
              rows="3"
              placeholder="e.g. Replenished hand soap, scheduled tile deep cleaning."
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button type="button" class="btn btn-outline" (click)="close.emit()">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="inspectionForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Saving...' : 'Submit Inspection' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class InspectionFormComponent implements OnInit {
  @Input() facility: Facility | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  inspectionForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private inspectionService: InspectionService
  ) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.inspectionForm = this.fb.group({
      cleanliness_score: [8, [Validators.required, Validators.min(1), Validators.max(10)]],
      odor_score: [2, [Validators.required, Validators.min(1), Validators.max(10)]],
      waste_level: ['Low', Validators.required],
      water_available: [true],
      inspection_date: [today, Validators.required],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.inspectionForm.invalid || !this.facility) return;

    this.isSubmitting = true;
    const formVal = this.inspectionForm.value;

    this.inspectionService.addInspection({
      facility_id: this.facility.id,
      cleanliness_score: Number(formVal.cleanliness_score),
      odor_score: Number(formVal.odor_score),
      waste_level: formVal.waste_level,
      water_available: formVal.water_available,
      inspection_date: formVal.inspection_date,
      notes: formVal.notes
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitted.emit();
        this.close.emit();
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }
}
