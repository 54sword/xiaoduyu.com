import React from 'react';

import Follow from '@components/follow';
import ReportMenu from '@components/report-menu';

// styles
import './index.scss';

export default class PeopleDetailHead extends React.PureComponent {

  render() {
    
    const { people } = this.props;
    
    return (

        <div styleName="header">

          <div styleName="profile">
            <div styleName="actions">
              <Follow user={people} />
              <ReportMenu user={people} />
            </div>
            <img styleName="avatar" src={people.avatar_url.replace('thumbnail/!50', 'thumbnail/!300')} />
            <div styleName="nickname">
              {people.nickname}
              {/* styleName={people.gender == 1 ? 'male' : 'female'} */}
            </div>
            {Reflect.has(people, 'gender') && people.gender != null ?
                <div>性别：{people.gender == 1 ? '男' : '女'}</div>
                : null}
            <div>{people.brief}</div>
            
          </div>

        </div>

    
      )

  }

}