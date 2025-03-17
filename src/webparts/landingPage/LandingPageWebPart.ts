import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import LandingPage from './components/LandingPage';
import { ILandingPageProps } from './components/ILandingPageProps';

export interface ILandingPageWebPartProps {
  description: string;
}

export default class LandingPageWebPart extends BaseClientSideWebPart<ILandingPageWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ILandingPageProps> = React.createElement(
      LandingPage,
      {
        description: this.properties.description,
        context: this.context,
        spHttpClient: this.context.spHttpClient,
        isDarkTheme: document.body.classList.contains('dark-mode'),
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        websiteUrl: this.context.pageContext.web.absoluteUrl

      }
    );

    ReactDom.render(element, this.domElement);
  }



  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }


}

