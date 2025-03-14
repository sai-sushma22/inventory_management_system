import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterModule,
    CommonModule,
    MatSidenavModule,
    SidebarComponent
  ],
  template: `
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened>
        <app-sidebar></app-sidebar>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    mat-sidenav-container {
      height: 100vh;
    }
    mat-sidenav {
      width: 250px;
    }
  `]
})
export class AppComponent {
  title = 'Gadgets Management';
}