import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [],
  templateUrl: './chart-widget.component.html',
  styleUrl: './chart-widget.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChartWidgetComponent {
  @Input() objectId!: string;
  constructor(
    // @Inject(APP_ID) public appId: string,
    // @Inject(OBJECT_ID) public objectId: string
    private el: ElementRef
  ) {}

  ngOnInit() {
    console.log('ChartWidgetComponent initialized with:');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['objectId'] && this.objectId) {
      console.log('Object ID updated to:', this.objectId);
      this.setQlikEmbedAttribute();
    }
  }

  private setQlikEmbedAttribute() {
    // Select the qlik-embed element and set the object-id attribute
    const qlikEmbedElement = this.el.nativeElement.querySelector('qlik-embed');
    if (qlikEmbedElement) {
      qlikEmbedElement.setAttribute('object-id', this.objectId);
      console.log('object-id set on qlik-embed:', this.objectId);
    } else {
      console.warn('qlik-embed element not found.');
    }
  }
}
