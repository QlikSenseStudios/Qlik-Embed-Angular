import { Component, inject, input, model } from '@angular/core';
import { Widget } from '../../../models/dashboard';
import { DashboardService } from '../../../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-widget-options',
  standalone: true,
  imports: [MatButtonToggleModule, MatIcon, MatButtonModule],
  templateUrl: './widget-options.component.html',
  styleUrl: './widget-options.component.scss',
})
export class WidgetOptionsComponent {
  data = input.required<Widget>();
  showOptions = model.required<boolean>();
  store = inject(DashboardService);
}
