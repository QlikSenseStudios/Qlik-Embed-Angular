import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  NgZone,
  Renderer2,
} from '@angular/core';
import { SelectionBarComponent } from '../../components/selection-bar/selection-bar.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { QlikAPIService } from '../../services/qlik-api.service';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-on-the-fly',
  standalone: true,
  imports: [
    SelectionBarComponent,
    MatCheckbox,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    FormsModule,
    CommonModule,
    MatRadioModule,
  ],
  templateUrl: './on-the-fly.component.html',
  styleUrl: './on-the-fly.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OnTheFlyComponent {
  appId = '8e328c54-92c8-487a-9286-c0aaef69c109';
  masterDimensions: { id: string; label: string }[] = [];
  masterMeasures: { id: string; label: string }[] = [];
  /* selectedDimensions: string[] = ['Product Type'];
  selectedMeasures: string[] = ['# of Products']; */
  selectedDimensions: string[] = ['Product Type', 'Product Sub Group'];
  selectedMeasures: string[] = ['# of Products'];

  dimensions = `"[Product Type]"`;
  measures = `"[# of Products]"`;

  selectedChartType: string = 'barchart';
  htmlString: SafeHtml = '';
  chartTypes: string[] = [
    'scatterplot',
    'piechart',
    'barchart',
    'table',
    'linechart',
    'combochart',
  ];
  loading = false; // Loader state

  constructor(
    // @Inject(APP_ID) public appId: string,
    // @Inject(OBJECT_ID) public objectId: string
    private el: ElementRef,
    private renderer: Renderer2,
    private qlikAPIService: QlikAPIService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private zone: NgZone
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = true;
    this.qlikAPIService.getMasterItems().then((data) => {
      // Update the data
      this.masterMeasures = data.measures.map((measure) => ({
        id: measure.id + '',
        label: measure.label as string,
      }));
      this.masterDimensions = data.dimensions.map((dimension) => ({
        id: dimension.id + '',
        label: dimension.label as string,
      }));
      this.loading = false;
      // Trigger change detection
      this.cdr.detectChanges();
    });
  }
  submitSelection() {
    console.log('Selected Dimensions:', this.selectedDimensions);
    console.log('Selected Measures:', this.selectedMeasures);
    console.log('Selected Chart Type:', this.selectedChartType);

    // Update the chart type and recreate the embed
    this.createQlikEmbed();
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.createQlikEmbed();
  }
  private createQlikEmbed(): void {
    this.dimensions = this.selectedDimensions
      .map((dim) => `"[${dim}]"`) // Add double quotes around each dimension
      .join(', '); // Join with a comma and space
    this.measures = this.selectedMeasures
      .map((measure) => `"[${measure}]"`) // Add double quotes around each measure
      .join(', '); // Join with a comma and space
    // Create the qlik-embed element as a string with expected attribute formatting
    const qlikEmbedHtml = `
        <qlik-embed
          id="visualization"
          ui="analytics/chart"
          app-id="${this.appId}"
          type="${this.selectedChartType}"
          dimensions='[${this.dimensions}]'
          measures='[${this.measures}]'
        ></qlik-embed>`;
    this.zone.run(() => {
      const testHtml = '<div>Hello, World!</div>';
      this.htmlString = this.sanitizer.bypassSecurityTrustHtml(qlikEmbedHtml);
    });

    this.cdr.detectChanges();

    console.log('Rendered htmlString:', this.htmlString.toString());
  }
}
