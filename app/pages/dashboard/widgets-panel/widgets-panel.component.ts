import { Component, inject } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-widgets-panel',
  standalone: true,
  imports: [MatListModule, MatIcon, CdkDrag, CdkDragPlaceholder, CommonModule],
  templateUrl: './widgets-panel.component.html',
  styleUrl: './widgets-panel.component.scss',
  host: {
    class:
      'bg-primary-container text-on-primary-container absolute right-[10px] top-[80px] w-[200px] z-[2] rounded-2xl',
  },
})
export class WidgetsPanelComponent {
  store = inject(DashboardService);
}
