import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { 
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule 
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { Gadget } from '../../../core/models/gadget';
import { GadgetService } from '../../../core/services/gadget.service';

@Component({
  selector: 'app-gadget-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="gadget-create-container">
      <h2>{{ isEditMode ? 'Edit Gadget' : 'Create New Gadget' }}</h2>
      
      <form [formGroup]="gadgetForm" (ngSubmit)="onSubmit()">
        <!-- Image Upload Section -->
        <div class="image-upload-container">
          <input 
            type="file" 
            #fileInput 
            style="display: none" 
            (change)="onFileSelected($event)"
            accept="image/*"
          >
          <button 
            mat-raised-button 
            color="primary" 
            type="button"
            (click)="fileInput.click()">
            <mat-icon>cloud_upload</mat-icon>
            Upload Image
          </button>
          
          <!-- Display selected file name or existing image -->
          <div *ngIf="imagePreview" class="image-preview-container">
            <img 
              [src]="imagePreview" 
              alt="Image Preview" 
              class="image-preview"
            >
          </div>
        </div>

        <mat-form-field>
          <mat-label>Name</mat-label>
          <input 
            matInput 
            formControlName="name" 
            placeholder="Enter Gadget Name"
            required
          >
          <mat-error *ngIf="name?.invalid && (name?.dirty || name?.touched)">
            <span *ngIf="name?.errors?.['required']">Name is required</span>
            <span *ngIf="name?.errors?.['minlength']">Name must be at least 3 characters</span>
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Description</mat-label>
          <textarea 
            matInput 
            formControlName="description" 
            placeholder="Enter Gadget Description"
            required
          ></textarea>
          <mat-error *ngIf="description?.invalid && (description?.dirty || description?.touched)">
            <span *ngIf="description?.errors?.['required']">Description is required</span>
            <span *ngIf="description?.errors?.['minlength']">Description must be at least 10 characters</span>
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Price</mat-label>
          <input 
            matInput 
            type="number" 
            formControlName="price" 
            placeholder="Enter Price"
            required
          >
          <mat-error *ngIf="price?.invalid && (price?.dirty || price?.touched)">
            <span *ngIf="price?.errors?.['required']">Price is required</span>
            <span *ngIf="price?.errors?.['min']">Price must be greater than 0</span>
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Quantity</mat-label>
          <input 
            matInput 
            type="number" 
            formControlName="quantity" 
            placeholder="Enter Quantity"
            required
          >
          <mat-error *ngIf="quantity?.invalid && (quantity?.dirty || quantity?.touched)">
            <span *ngIf="quantity?.errors?.['required']">Quantity is required</span>
            <span *ngIf="quantity?.errors?.['min']">Quantity must be at least 0</span>
          </mat-error>
        </mat-form-field>

        <div class="button-container">
          <button 
            mat-raised-button 
            type="button" 
            (click)="onCancel()">
            Cancel
          </button>
          <button 
            mat-raised-button 
            color="primary" 
            type="submit"
            [disabled]="gadgetForm.invalid">
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .gadget-create-container {
      padding: 20px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }
    .button-container {
      display: flex;
      justify-content: space-between;
    }
    .image-upload-container {
      margin-bottom: 15px;
    }
    .image-preview-container {
      margin-top: 10px;
      text-align: center;
    }
    .image-preview {
      max-width: 200px;
      max-height: 200px;
      object-fit: contain;
    }
  `]
})
export class GadgetCreateComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  gadgetForm: FormGroup;
  isEditMode: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private gadgetService: GadgetService,
    public dialogRef: MatDialogRef<GadgetCreateComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Gadget | null
  ) {
    this.isEditMode = !!data;
    this.gadgetForm = this.fb.group({
      name: [
        this.isEditMode ? data?.name : '', 
        [Validators.required, Validators.minLength(3)]
      ],
      description: [
        this.isEditMode ? data?.description : '', 
        [Validators.required, Validators.minLength(10)]
      ],
      price: [
        this.isEditMode ? data?.price : null, 
        [Validators.required, Validators.min(1)]
      ],
      quantity: [
        this.isEditMode ? data?.quantity : null, 
        [Validators.required, Validators.min(0)]
      ],
      image_url: [this.isEditMode ? data?.image_url : '']
    });
    if (this.isEditMode) {
      try {
        this.imagePreview = data?.image_url 
          ? this.gadgetService.getFullImageUrl(data.image_url)
          : '/assets/placeholder-image.png';
      } catch (error) {
        console.error('Error processing image URL:', error);
        this.imagePreview = '/assets/placeholder-image.png';
      }
    }
  }

  ngOnInit() {}
  get name() { return this.gadgetForm.get('name'); }
  get description() { return this.gadgetForm.get('description'); }
  get price() { return this.gadgetForm.get('price'); }
  get quantity() { return this.gadgetForm.get('quantity'); }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = reader.result;
        this.gadgetForm.get('image_url')?.setValue(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.gadgetForm.valid) {
      const formData = this.gadgetForm.value;
      if (this.isEditMode) {
        this.gadgetService.updateGadget(this.data!.id!, formData).subscribe({
          next: (updatedGadget) => {
            this.dialogRef.close(updatedGadget);
            this.snackBar.open('Gadget updated successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Update error', error);
            this.snackBar.open('Failed to update gadget', 'Close', { duration: 3000 });
          }
        });
      } 
      
      else {
        this.gadgetService.createGadget(formData).subscribe({
          next: (createdGadget) => {
            this.dialogRef.close(createdGadget);
            this.snackBar.open('Gadget created successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Create error', error);
            this.snackBar.open('Failed to create gadget', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}