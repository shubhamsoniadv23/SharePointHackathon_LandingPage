import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ILandingPageProps {
  description: string;
  context: WebPartContext
  spHttpClient: SPHttpClient;
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
  userDisplayName: string;
  websiteUrl: string;
}

export interface ISharedComponentProps extends ILandingPageProps {
  // Add any additional shared props here if needed
}
