import { Component, input, model } from '@angular/core';
import { Widget } from '../../../models/dashboard';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkDragHandle } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-widget-header',
  standalone: true,
  imports: [MatIcon, MatButtonModule, CdkDragHandle],
  templateUrl: './widget-header.component.html',
  styleUrl: './widget-header.component.scss',
})
export class WidgetHeaderComponent {
  data = input.required<Widget>();

  showOptions = model.required<boolean>();
}
