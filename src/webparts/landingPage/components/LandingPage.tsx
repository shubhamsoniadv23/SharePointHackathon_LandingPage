import * as React from 'react';
import type { ILandingPageProps } from './ILandingPageProps';
import DocumentSearch from '../../../components/shared/DocumentSearch/DocumentSearch';
import QuickLinks from '../../../components/shared/QuickLinks/QuickLinks';
import TopNavigation from '../../../components/shared/TopNavigation/TopNavigation';
import { Box } from '@mui/material';
import HeroSection from '../../../components/shared/HeroSection/HeroSection';
import WelcomeSectionComponent from '../../../components/shared/welcomeSection/welcomeSection';
import CalendarComponent from '../../../components/shared/Calendar/Calendar';
import WhatsNewComponent from '../../../components/shared/whatsNew/whatsNew';
import WorkAnniversaryComponent from '../../../components/shared/workAnniversary/workAnniversary';

export default class LandingPage extends React.Component<ILandingPageProps, {}> {
  constructor(props: ILandingPageProps) {
    super(props);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  componentDidMount() {
    const style = document.createElement('style');
    style.innerHTML = `
      #workbenchPageContent {
        padding: 0 !important;
        margin: 0 !important;
        min-width: 100% !important;
      }
      .CanvasComponent.LCS .CanvasZone {
        margin: 0px !important;
        min-width: 100% !important;
        padding: 0px !important;
      }
      .spAppAndPropertyPanelContainer .sp-appBar {
        min-width: 0px !important;
      }
      .n_c_8474018e {
        padding: 0px !important;
      }
      #sp-appBar {
        min-width: 0px !important;
      }
    `;
    document.head.appendChild(style);
  }

  public render(): React.ReactElement<ILandingPageProps> {
    return (
      <>
        <Box sx={{ scrollBehavior: 'smooth' }}>
          <Box>
            <TopNavigation context={this.props.context} />
          </Box>
          <Box>
            <HeroSection {...this.props} />
          </Box>
          <Box>
            <QuickLinks context={this.props.context} spHttpClient={this.props.spHttpClient} />
          </Box>
          <Box sx={{
            display: 'flex',
            gap: 3, justifyContent: "center"
          }}>
            <Box sx={{ flex: '70%' }}>
              <DocumentSearch context={this.props.context} spHttpClient={this.props.spHttpClient} />
            </Box>
            <Box sx={{ flex: '30%' }}>

              <CalendarComponent {...this.props} />
            </Box>
          </Box>
          <Box>
            <WhatsNewComponent {...this.props} />
          </Box>

          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: '70%' }}>
              <WelcomeSectionComponent {...this.props} />
            </Box>
            <Box sx={{ flex: '30%' }}>
              <WorkAnniversaryComponent {...this.props} />
            </Box>
          </Box>
        </Box>
      </>
    );
  }
}