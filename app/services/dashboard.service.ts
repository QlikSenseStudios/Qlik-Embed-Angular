import { Widget } from '../models/dashboard';
import { ChartWidgetComponent } from './../pages/widgets/chart-widget/chart-widget.component';
import { computed, effect, Injectable, signal } from '@angular/core';
import { QlikAPIService } from './qlik-api.service';

@Injectable()
export class DashboardService {
  private readonly staticWidgets: Widget[] = [];

  public readonly widgets = signal<Widget[]>(this.staticWidgets);
  public readonly addedWidgets = signal<Widget[]>([]);

  public readonly widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map((w) => w.id);
    return this.widgets().filter((w) => !addedIds.includes(w.id));
  });

  constructor(private qlikAPIService: QlikAPIService) {
    this.initializeWidgets();
    // this.saveWidgetsEffect();
    // this.saveWidgetsEffect();
    this.fetchWidgets();
    this.saveWidgetsEffect();
  }
  async initializeWidgets() {
    // Fetch all master items
    const masterItems = await this.qlikAPIService.getMasterItems();
    // Map master visualizations to widgets
    const visualizationWidgets = masterItems.visualizations.map(
      (vis, index) => ({
        id: index + 1,
        label: vis.label,
        content: ChartWidgetComponent,
        rows: 2,
        columns: 2,
        visualizationType: vis.visualizationType,
        data: {
          appId: '8e328c54-92c8-487a-9286-c0aaef69c109',
          objectId: vis.id,
        },
      })
    ) as Widget[];

    // Set the dynamically fetched widgets
    this.widgets.set([...this.staticWidgets, ...visualizationWidgets]);
    // Fetch saved widgets from localStorage
  }
  async fetchWidgets() {
    if (typeof localStorage !== 'undefined') {
      const widgetsAsString = localStorage.getItem('dashboardWidgets');
      console.log(widgetsAsString);
      if (widgetsAsString) {
        const widgets = JSON.parse(widgetsAsString) as Widget[];
        const rehydratedWidgets = widgets.map((widget) => ({
          ...widget,
          content: ChartWidgetComponent, // Rehydrate the content
        })) as Widget[];

        this.addedWidgets.set(rehydratedWidgets);
        //this.addedWidgets.set(dynamicWidgets)
      }
    }
  }

  addWidget(widget: Widget) {
    this.addedWidgets.set([...this.addedWidgets(), { ...widget }]);
  }

  addWidgetAtPosition(sourceWidgetId: number, destWidgetId: number) {
    const widgetToAdd = this.widgetsToAdd().find(
      (w) => w.id === sourceWidgetId
    );
    if (!widgetToAdd) {
      return;
    }

    const indexOfDestWidget = this.addedWidgets().findIndex(
      (w) => w.id === destWidgetId
    );

    const positionToAdd =
      indexOfDestWidget === -1 ? this.addedWidgets().length : indexOfDestWidget;

    const newWidgets = [...this.addedWidgets()];
    newWidgets.splice(positionToAdd, 0, { ...widgetToAdd });
    this.addedWidgets.set(newWidgets);
  }

  updateWidget(id: number, data: Partial<Widget>) {
    const indexToUpdate = this.addedWidgets().findIndex((w) => w.id === id);
    if (indexToUpdate !== -1) {
      const newWidgets = [...this.addedWidgets()];
      newWidgets[indexToUpdate] = { ...newWidgets[indexToUpdate], ...data };
      this.addedWidgets.set(newWidgets);
    }
  }

  moveWidgetRight(id: number) {
    const indexToMove = this.addedWidgets().findIndex((w) => w.id === id);
    if (indexToMove === this.addedWidgets().length - 1) {
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    [newWidgets[indexToMove], newWidgets[indexToMove + 1]] = [
      { ...newWidgets[indexToMove + 1] },
      { ...newWidgets[indexToMove] },
    ];
    this.addedWidgets.set(newWidgets);
  }

  moveWidgetLeft(id: number) {
    const indexToMove = this.addedWidgets().findIndex((w) => w.id === id);
    if (indexToMove === 0) {
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    [newWidgets[indexToMove], newWidgets[indexToMove - 1]] = [
      { ...newWidgets[indexToMove - 1] },
      { ...newWidgets[indexToMove] },
    ];
    this.addedWidgets.set(newWidgets);
  }

  removeWidget(id: number) {
    this.addedWidgets.set([...this.addedWidgets().filter((w) => w.id !== id)]);
  }

  updateWidgetPosition(sourceWidgetId: number, targetWidgetId: number) {
    const sourceIndex = this.addedWidgets().findIndex(
      (w) => w.id === sourceWidgetId
    );
    if (sourceIndex === -1) {
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    const sourceWidget = newWidgets.splice(sourceIndex, 1)[0];

    const targetIndex = newWidgets.findIndex((w) => w.id === targetWidgetId);
    if (targetIndex === -1) {
      return;
    }

    const insertAt =
      sourceIndex === targetIndex ? targetIndex + 1 : targetIndex;

    newWidgets.splice(insertAt, 0, sourceWidget);
    this.addedWidgets.set(newWidgets);
  }
  private saveWidgetsEffect() {
    effect(() => {
      const widgetsToSave = this.addedWidgets().map((w) => ({
        ...w,
        content: w.content?.name,
      }));
      localStorage.setItem('dashboardWidgets', JSON.stringify(widgetsToSave));
    });
  }

  saveWidgets = effect(() => {
    const widgetsWithoutContent: Partial<Widget>[] = this.addedWidgets().map(
      (w) => ({ ...w, content: w.content?.name })
    );
    widgetsWithoutContent.forEach((w) => {
      delete w.content;
    });

    localStorage.setItem(
      'dashboardWidgets',
      JSON.stringify(widgetsWithoutContent)
    );
  });
}
