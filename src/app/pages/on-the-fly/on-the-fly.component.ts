import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
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
  selectedDimensions: string[] = ['[Product Type]', '[Product Sub Group]'];
  selectedMeasures: string[] = ['[# of Products]'];
  selectedChartType: string = 'barchart';
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
    private cdr: ChangeDetectorRef
  ) {
    this.createQlikEmbed();
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createQlikEmbed();
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

  private createQlikEmbed(): void {
    const container = this.el.nativeElement.querySelector('#embed-container');
    if (container) {
      // Clear the existing content
      this.renderer.setProperty(container, 'innerHTML', '');

      // Create the qlik-embed element
      const qlikEmbed = this.renderer.createElement('qlik-embed');

      // Set attributes using Renderer2
      this.renderer.setAttribute(qlikEmbed, 'id', 'visualization');
      this.renderer.setAttribute(qlikEmbed, 'ui', 'analytics/chart');
      this.renderer.setAttribute(qlikEmbed, 'app-id', this.appId);
      this.renderer.setAttribute(qlikEmbed, 'type', this.selectedChartType);
      // Construct dimensions and measures as JSON arrays of strings
      //const dimensionsJson = JSON.stringify(this.selectedDimensions.map((dim)=>`[${dim}]`));
      // const measuresJson = JSON.stringify(this.selectedMeasures.map((meas)=>`[${meas}]`));

      // Construct dimensions and measures JSON strings without escaping
      const dimensions = `[${this.selectedDimensions
        .map((dim) => `"${dim}"`)
        .join(',')}]`;
      const measures = `[${this.selectedMeasures
        .map((meas) => `"${meas}"`)
        .join(',')}]`;

      this.renderer.setAttribute(qlikEmbed, 'dimensions', dimensions);
      this.renderer.setAttribute(qlikEmbed, 'measures', measures);

      // Append the qlik-embed element to the container
      this.renderer.appendChild(container, qlikEmbed);

      console.log(qlikEmbed);
    } else {
      console.warn('Embed container not found.');
    }
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.createQlikEmbed();
  }

  /*  private createQlikEmbed(): void {
    const container = this.el.nativeElement.querySelector('#embed-container');
    const dimensions = `["FiscalMonth", "YYYYMM"]`;
    const measures = `["=Sum(ARSalesPerDay)"]`;
    if (container) {
      // Create the qlik-embed element
      const qlikEmbed = this.renderer.createElement('qlik-embed');

      // Set attributes using Renderer2
      this.renderer.setAttribute(qlikEmbed, 'id', 'visualization');
      this.renderer.setAttribute(qlikEmbed, 'ui', 'analytics/chart');
      this.renderer.setAttribute(qlikEmbed, 'app-id', this.appId);
      this.renderer.setAttribute(qlikEmbed, 'type', this.type);
      this.renderer.setAttribute(qlikEmbed, 'dimensions', dimensions);
      this.renderer.setAttribute(qlikEmbed, 'measures', measures);

      // Append the qlik-embed element to the container
      this.renderer.appendChild(container, qlikEmbed);

      console.log('qlik-embed created:', qlikEmbed);
    } else {
      console.warn('Embed container not found.');
    }
  } */
}
