import React from 'react';

// components
import Shell from '@components/shell';
import Meta from '@components/meta';

// modules
import Topics from '@modules/topics';
import AppDownload from '@modules/app-download';
import Links from '@modules/Links';
import OpenSource from '@modules/open-source';
import OperatingStatus from '@modules/operating-status';
import Footer from '@modules/footer';
import MixingFeed from '@modules/mixing-feed';


// layout
import ThreeColumns from '../../layout/three-columns';

@Shell
export default class Home extends React.PureComponent {

  render() {

    return(<>
      <Meta />
      
      <ThreeColumns>

        <>
          <Topics />
          <AppDownload />
        </>
        
        <MixingFeed /> 

        {/* <>
          <OpenSource />
          <OperatingStatus />
          <Links />
          <Footer />
        </> */}

      </ThreeColumns>
    </>)
  }

}
