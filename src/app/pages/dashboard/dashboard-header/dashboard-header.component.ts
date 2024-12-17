import { Component, inject, signal } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { WidgetsPanelComponent } from '../widgets-panel/widgets-panel.component';
@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [
       MatIcon,
    MatMenuModule,
    MatButtonModule,
    WidgetsPanelComponent,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss'
})
export class DashboardHeaderComponent {
  store = inject(DashboardService);

  widgetsOpen = signal(false);

  widgetDroppedInPanel(event: CdkDragDrop<number, any>) {
    const { previousContainer } = event;
    this.store.removeWidget(previousContainer.data);
  }
}
