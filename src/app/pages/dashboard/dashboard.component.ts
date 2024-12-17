import { ChartWidgetComponent } from './../widgets/chart-widget/chart-widget.component';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Inject,
  inject,
  InjectionToken,
  Injector,
  viewChild,
} from '@angular/core';

import { DashboardService } from '../../services/dashboard.service';
import { wrapGrid } from 'animate-css-grid';
import {
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';

import { MatSidenavModule } from '@angular/material/sidenav';
import { WidgetsPanelComponent } from './widgets-panel/widgets-panel.component';
import { NgComponentOutlet } from '@angular/common';
import { WidgetComponent } from '../../components/widget/widget.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { QlikAPIService } from '../../services/qlik-api.service';
import { Widget } from '../../models/dashboard';
import { SelectionBarComponent } from '../../components/selection-bar/selection-bar.component';
export const APP_ID = new InjectionToken<string>('appId');
export const OBJECT_ID = new InjectionToken<string>('objectId');

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgComponentOutlet,
    WidgetComponent,
    DashboardHeaderComponent,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    MatSidenavModule,
    WidgetsPanelComponent,
    ChartWidgetComponent,
    SelectionBarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DashboardService, QlikAPIService],
})
export class DashboardComponent {
  dashboard = viewChild.required<ElementRef>('dashboard');

  store = inject(DashboardService);

  clearAnimations = () => {};
  staticWidgets: Widget[] = [];

  constructor(private injector: Injector) {
    this.staticWidgets.push({
      id: 1,
      content: ChartWidgetComponent,
      rows: 1,
      columns: 1,
      data: {
        appId: '8e328c54-92c8-487a-9286-c0aaef69c109',
        objectId: 'JEBdZz',
      },
    } as Widget);
    this.staticWidgets.push({
      id: 2,
      content: ChartWidgetComponent,
      rows: 1,
      columns: 1,
      data: {
        appId: '8e328c54-92c8-487a-9286-c0aaef69c109',
        objectId: 'GJxgd',
      },
    } as Widget);
    this.staticWidgets.push({
      id: 3,
      content: ChartWidgetComponent,
      rows: 1,
      columns: 1,
      data: {
        appId: '8e328c54-92c8-487a-9286-c0aaef69c109',
        objectId: 'QYthJs',
      },
    } as Widget);
  }
  ngOnInit() {
    const { unwrapGrid } = wrapGrid(this.dashboard().nativeElement, {
      duration: 300,
    });
    this.clearAnimations = unwrapGrid;
  }

  ngOnDestroy() {
    this.clearAnimations();
  }

  drop(event: CdkDragDrop<number, any>) {
    const {
      previousContainer,
      container,
      item: { data },
    } = event;

    if (data) {
      this.store.addWidgetAtPosition(data, container.data);
      return;
    }

    this.store.updateWidgetPosition(previousContainer.data, container.data);
  }
}
