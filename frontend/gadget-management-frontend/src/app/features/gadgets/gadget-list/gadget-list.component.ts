import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Gadget } from '../../../core/models/gadget';
import { GadgetService } from '../../../core/services/gadget.service';
import { GadgetCreateComponent } from '../gadget-create/gadget-create.component';
import { GadgetDetailComponent } from '../gadget-detail/gadget-detail.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-gadget-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule
  ],
  template: `
    <div class="gadget-list-container">
      <div class="actions-container">
        <button 
          mat-raised-button 
          color="primary" 
          (click)="openCreateDialog()"
          matTooltip="Add New Gadget">
          <mat-icon>add</mat-icon>
          Add New Gadget
        </button>
        
        <button 
          mat-raised-button 
          color="warn"
          (click)="bulkDelete()"
          [disabled]="selection.selected.length === 0"
          matTooltip="Delete Selected Gadgets">
          <mat-icon>delete</mat-icon>
          Bulk Delete ({{ selection.selected.length }})
        </button>
      </div>

      <div class="gadgets-grid">
        <div 
          *ngFor="let gadget of gadgets" 
          class="gadget-card-wrapper"
          (click)="toggleSelection(gadget)">
          <mat-card 
            [class.selected]="selection.isSelected(gadget)"
            class="gadget-card">
            <mat-checkbox 
              class="selection-checkbox"
              [checked]="selection.isSelected(gadget)"
              (click)="$event.stopPropagation()"
              (change)="selection.toggle(gadget)">
            </mat-checkbox>
            
            <img 
              mat-card-image 
              [src]="gadget.image_url" 
              [alt]="gadget.name"
              class="gadget-image"
            >
            
            <mat-card-content>
              <h3>{{ gadget.name }}</h3>
              <p>{{ gadget.description }}</p>
              <p>Price: ₹{{ gadget.price | number:'1.0-0' }}</p>
              <p>Quantity: {{ gadget.quantity }}</p>
            </mat-card-content>
            
            <mat-card-actions>
              <button 
                mat-icon-button 
                color="primary" 
                (click)="$event.stopPropagation(); viewGadgetDetails(gadget)"
                matTooltip="View Details">
                <mat-icon>visibility</mat-icon>
              </button>
              <button 
                mat-icon-button 
                (click)="$event.stopPropagation(); editGadget(gadget)"
                matTooltip="Edit Gadget">
                <mat-icon>edit</mat-icon>
              </button>
              <button 
                mat-icon-button 
                color="warn" 
                (click)="$event.stopPropagation(); deleteGadget(gadget)"
                matTooltip="Delete Gadget">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <div *ngIf="gadgets.length === 0" class="no-gadgets">
        <mat-icon>devices_other</mat-icon>
        <p>No gadgets found. Add a new gadget!</p>
      </div>
    </div>
  `,
  styles: [`
    .gadget-list-container {
      padding: 20px;
    }
    .actions-container {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      align-items: center;
    }
    .gadgets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    .gadget-card-wrapper {
      position: relative;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .gadget-card-wrapper:hover {
      transform: scale(1.02);
    }
    .gadget-card {
      position: relative;
      transition: box-shadow 0.3s ease;
    }
    .gadget-card.selected {
      box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
      border: 2px solid rgba(0, 123, 255, 0.5);
    }
    .selection-checkbox {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 10;
    }
    .gadget-image {
      height: 250px;
      object-fit: cover;
    }
    .no-gadgets {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      text-align: center;
      color: rgba(0, 0, 0, 0.54);
    }
  `]
})
export class GadgetListComponent implements OnInit {
  gadgets: Gadget[] = [];
  selection = new SelectionModel<Gadget>(true, []);

  constructor(
    private gadgetService: GadgetService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadGadgets();
  }

  loadGadgets() {
    this.gadgetService.getAllGadgets().subscribe({
      next: (response) => {
        this.gadgets = response.gadgets;
        // Reset selection after loading
        this.selection.clear();
      },
      error: (error) => {
        this.snackBar.open(
          'Failed to load gadgets', 
          'Close', 
          { duration: 3000 }
        );
      }
    });
  }

  toggleSelection(gadget: Gadget) {
    this.selection.toggle(gadget);
  }

  viewGadgetDetails(gadget: Gadget) {
    this.dialog.open(GadgetDetailComponent, {
      width: '400px',
      data: gadget
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(GadgetCreateComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGadgets();
        this.snackBar.open('Gadget created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  editGadget(gadget: Gadget) {
    const dialogRef = this.dialog.open(GadgetCreateComponent, {
      width: '400px',
      data: gadget
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGadgets();
        this.snackBar.open('Gadget updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  deleteGadget(gadget: Gadget) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${gadget.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gadgetService.deleteGadget(gadget.id!).subscribe({
          next: () => {
            this.loadGadgets();
            this.snackBar.open('Gadget deleted successfully', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to delete gadget', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  bulkDelete() {
    const selectedGadgets = this.selection.selected;
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Bulk Delete',
        message: `Are you sure you want to delete ${selectedGadgets.length} gadgets?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedIds = selectedGadgets.map(gadget => gadget.id!);
        
        this.gadgetService.bulkDeleteGadgets(selectedIds).subscribe({
          next: () => {
            this.loadGadgets();
            this.snackBar.open(`${selectedGadgets.length} gadgets deleted successfully`, 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to delete gadgets', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}