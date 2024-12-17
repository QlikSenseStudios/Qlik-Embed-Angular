import { Component, inject, input, signal } from '@angular/core';
import { Widget } from '../../models/dashboard';
import { DashboardService } from '../../services/dashboard.service';
import { WidgetHeaderComponent } from './widget-header/widget-header.component';
import { WidgetOptionsComponent } from './widget-options/widget-options.component';
import { NgComponentOutlet } from '@angular/common';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [
    WidgetHeaderComponent,
    WidgetOptionsComponent,
    NgComponentOutlet,
    CdkDrag,
    CdkDragPlaceholder,
  ],
  template: `
    <div
      class="h-full w-full p-7 relative mat-elevation-z3 overflow-hidden box-border rounded-[inherit]"
      cdkDrag
      cdkDragPreviewContainer="parent"
      [style.background-color]="
        data().backgroundColor ?? 'var(--sys-surface-bright)'
      "
      [style.color]="data().color ?? 'inherit'"
    >
      <app-widget-header [data]="data()" [(showOptions)]="showOptions" />

      <ng-container
        *ngComponentOutlet="
          data().content;
          inputs: { objectId: data().data.objectId }
        "
      />

      @if (showOptions()) {
      <app-widget-options [data]="data()" [(showOptions)]="showOptions" />
      }

      <div *cdkDragPlaceholder></div>
    </div>
  `,
  host: {
    '[style.grid-area]':
      '"span " + (data().rows ?? 1) + "/ span " + (data().columns ?? 1)',
    class: 'block rounded-2xl',
  },
})
export class WidgetComponent {
  data = input.required<Widget>();

  store = inject(DashboardService);

  showOptions = signal(false);
}
