import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule, 
    MatListModule, 
    MatIconModule
  ],
  template: `
    <div class="sidebar-container">
      <mat-nav-list>
        <mat-list-item 
          routerLink="/gadgets" 
          routerLinkActive="active">
          <mat-icon matListItemIcon>devices</mat-icon>
          <span matListItemTitle>Gadgets</span>
        </mat-list-item>
        <!-- Add more sidebar items as needed -->
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .sidebar-container {
      width: 250px;
      height: 100%;
      background-color: #f0f0f0;
    }
    .active {
      background-color: rgba(0,0,0,0.1);
    }
  `]
})
export class SidebarComponent {}