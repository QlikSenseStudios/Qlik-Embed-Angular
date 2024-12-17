import { Injectable } from '@angular/core';
import { apps, auth } from '@qlik/api';
import { HostConfig } from '@qlik/api/auth';
import { openAppSession } from '@qlik/api/qix';
import { setDefaultHostConfig } from '@qlik/api/auth';

@Injectable({
  providedIn: 'root',
})
export class QlikAPIService {
  qlikConfig: HostConfig = {
    authType: 'oauth2', // The type of authentication to use
    host: 'karthikburra93.us.qlikcloud.com', // The host of the Qlik cloud tenant
    clientId: '5b7dfa0121e8ef0e3a5b17c50e41c23b', // The client ID for OAuth2 authentication
    redirectUri: 'https://localhost:4200/assets/oauth-redirect.html', // The redirect URI after successful authentication
    accessTokenStorage: 'session', // Where to store the access token
  };

  constructor() {
    this.initQlik();
  }
  private initQlik(): void {
    auth.setDefaultHostConfig(this.qlikConfig);
  }
  async getMasterItems() {
    const appSession = openAppSession({
      appId: '8e328c54-92c8-487a-9286-c0aaef69c109',
    });
    const app = await appSession.getDoc();
    // Retrieve all objects in the app
    const allObjects = await app.getAllInfos();
    // Filter master dimensions, measures, and visualizations
    const masterDimensions = [];
    const masterMeasures = [];
    const masterVisualizations = [];

    for (const obj of allObjects) {
      const { qId, qType } = obj;
      // Check for master items
      if (qType === 'dimension') {
        const dimension = await app.getDimension(obj.qId as string);
        const layout = await dimension.getLayout();
        const label = (layout.qMeta as any)?.title || qId;
        masterDimensions.push({
          id: qId,
          label,
          type: 'dimension',
        });
      } else if (qType === 'measure') {
        const measure = await app.getMeasure(obj.qId as string);
        const layout = await measure.getLayout();
        const label = (layout.qMeta as any)?.title || qId;
        masterMeasures.push({
          id: qId,
          label,
          type: 'measure',
        });
        // Check for master visualizations
      } else if (obj.qType === 'masterobject') {
        const objectHandle = await app.getObject(obj.qId as string);
        // Fetch layout to retrieve metadata
        const layout = await objectHandle.getLayout();
        console.log('layout', layout);
        // Extract the title or fallback to the ID if unavailable
        const label = (layout.qMeta as any)?.title || obj.qId;
        // console.log('objectName', label);
        // Extract visuliazation from the layout
        const visualizationType = (layout as any)?.visualization || 'vis';

        masterVisualizations.push({ id: obj.qId, label, visualizationType });
      }
    }

    // Log the results
    console.log('Master Dimensions:', masterDimensions);
    console.log('Master Measures:', masterMeasures);
    console.log('Master Visualizations:', masterVisualizations);
    // Return all master items
    //return masterDimensions;
    //return masterMeasures;
    //return masterVisualizations;
    return {
      visualizations: masterVisualizations,
      dimensions: masterDimensions,
      measures: masterMeasures,
    };
  }
}
