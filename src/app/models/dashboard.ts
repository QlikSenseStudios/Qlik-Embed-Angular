import { Type } from '@angular/core';

export type Widget = {
  id: number;
  label: string;
  content: any;
  rows?: number;
  columns?: number;
  backgroundColor?: string;
  color?: string;
  data?: any;
  visualizationType?: string;
};
