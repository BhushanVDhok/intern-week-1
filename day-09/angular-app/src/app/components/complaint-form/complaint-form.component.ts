import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { Facility } from '../../models/facility.model';

@Component({
  selector: 'app-complaint-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 16px; font-weight: 700; color: var(--text-main);">Log Complaint Ticket</h3>
            <span style="font-size: 12px; color: var(--text-muted);">{{ facility?.name }}</span>
          </div>
          <button (click)="close.emit()" style="background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-muted);">&times;</button>
        </div>

        <form [formGroup]="complaintForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Issue Summary / Title</label>
            <input
              type="text"
              formControlName="complaint_title"
              class="form-control"
              placeholder="e.g. Broken faucet in stall 2"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Priority</label>
            <select formControlName="priority" class="form-control">
              <option value="Low">Low (Cosmetic/Non-urgent)</option>
              <option value="Medium">Medium (Attention required)</option>
              <option value="High">High (Impacting usability)</option>
              <option value="Urgent">Urgent (Immediate safety / blockage)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Detailed Description</label>
            <textarea
              formControlName="description"
              class="form-control"
              rows="3"
              placeholder="Provide specific details of the issue..."
            ></textarea>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button type="button" class="btn btn-outline" (click)="close.emit()">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="complaintForm.invalid">
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ComplaintFormComponent implements OnInit {
  @Input() facility: Facility | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  complaintForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    this.complaintForm = this.fb.group({
      complaint_title: ['', [Validators.required, Validators.minLength(3)]],
      priority: ['Medium', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit(): void {
    if (this.complaintForm.invalid || !this.facility) return;

    this.complaintService.addComplaint({
      facility_id: this.facility.id,
      complaint_title: this.complaintForm.value.complaint_title,
      priority: this.complaintForm.value.priority,
      description: this.complaintForm.value.description
    }).subscribe(() => {
      this.submitted.emit();
      this.close.emit();
    });
  }
}
