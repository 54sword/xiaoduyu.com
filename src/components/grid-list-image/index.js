import React, { PureComponent } from 'react';

import './index.scss';

export default class GridListImage extends PureComponent {

  render() {

    const { images = [] } = this.props;

    if (images.length == 0) return null;

    return (<div styleName="box">

      {images.map(src=>{
        return(
          <div
            key={src}
            styleName="item"
            className="load-demand"
            data-load-demand={`<div style="background-image:url('${src}')"></div>`}>
          </div>
        )
      })}

    </div>)
  }

}
