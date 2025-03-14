import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MAT_DIALOG_DATA, 
  MatDialogRef, 
  MatDialogModule 
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { Gadget } from '../../../core/models/gadget';
import { GadgetService } from '../../../core/services/gadget.service';

@Component({
  selector: 'app-gadget-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="gadget-detail-container">
      <h2 mat-dialog-title>
        Gadget Details
        <button 
          mat-icon-button 
          color="primary" 
          (click)="onEdit()"
          *ngIf="gadget">
          <mat-icon>edit</mat-icon>
        </button>
      </h2>
      
      <mat-dialog-content *ngIf="gadget">
        <mat-card>
          <img 
            mat-card-image 
            [src]="gadget.image_url" 
            [alt]="gadget.name"
            class="gadget-image"
          >
          
          <mat-card-content>
            <div class="detail-grid">
              <div class="detail-item">
                <strong>ID:</strong>
                <span>{{ gadget.id }}</span>
              </div>
              <div class="detail-item">
                <strong>Name:</strong>
                <span>{{ gadget.name }}</span>
              </div>
              <div class="detail-item">
                <strong>Description:</strong>
                <span>{{ gadget.description }}</span>
              </div>
              <div class="detail-item">
                <strong>Price:</strong>
                <span>₹{{ gadget.price | number:'1.0-0' }}</span>
              </div>
              <div class="detail-item">
                <strong>Quantity:</strong>
                <span>{{ gadget.quantity }}</span>
              </div>
              <div class="detail-item" *ngIf="gadget.category">
                <strong>Category:</strong>
                <span>{{ gadget.category }}</span>
              </div>
              <div class="detail-item" *ngIf="gadget.brand">
                <strong>Brand:</strong>
                <span>{{ gadget.brand }}</span>
              </div>
              <div class="detail-item" *ngIf="gadget.created_at">
                <strong>Created At:</strong>
                <span>{{ gadget.created_at | date:'medium' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </mat-dialog-content>

      <mat-dialog-content *ngIf="!gadget && !isLoading">
        <p>No gadget details available.</p>
      </mat-dialog-content>

      <mat-dialog-content *ngIf="isLoading">
        <p>Loading gadget details...</p>
      </mat-dialog-content>
      
      <mat-dialog-actions>
        <button mat-button (click)="onClose()">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .gadget-detail-container {
      width: 500px;
      max-width: 100%;
    }
    .gadget-image {
      height: 300px;
      object-fit: cover;
      margin-bottom: 20px;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    .detail-item strong {
      margin-bottom: 5px;
      color: rgba(0, 0, 0, 0.6);
    }
    .detail-item span {
      font-weight: 500;
    }
    mat-dialog-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class GadgetDetailComponent implements OnInit {
  gadget: Gadget | null = null;
  isLoading: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Gadget | { id: number },
    private dialogRef: MatDialogRef<GadgetDetailComponent>,
    private gadgetService: GadgetService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Check if full gadget object or just ID is passed
    if (this.isFullGadget(this.data)) {
      this.gadget = this.data;
      this.isLoading = false;
    } else {
      this.fetchGadgetDetails(this.data.id);
    }
  }

  // Type guard to check if data is a full Gadget
  private isFullGadget(data: any): data is Gadget {
    return data && data.id && data.name;
  }

  // Fetch gadget details by ID
  private fetchGadgetDetails(id: number) {
    this.gadgetService.getGadgetById(id).subscribe({
      next: (gadget) => {
        this.gadget = gadget;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(
          'Failed to load gadget details', 
          'Close', 
          { duration: 3000 }
        );
        this.dialogRef.close();
      }
    });
  }

  // Edit gadget method
  onEdit() {
    if (this.gadget) {
      this.dialogRef.close({
        action: 'edit',
        gadget: this.gadget
      });
    }
  }

  // Close dialog
  onClose() {
    this.dialogRef.close();
  }
}