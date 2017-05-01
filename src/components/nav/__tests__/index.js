import React from 'react'
import { Link } from 'react-router'
import { shallow, mount, render } from 'enzyme'

// https://github.com/airbnb/enzyme/issues/341
import 'jsdom-global/register'

import { Navbar } from '../index'
import styles from '../style.scss'

describe('<Nav />', ()=>{

  it('应该有 `我的` 链接，没有 `通知` 链接', function() {

    let props = {
      profile: {},
      showSign: ()=>{},
      unreadNotice: 0
    }

    let wrapper = shallow(<Navbar {...props} />)

    expect(wrapper.contains(<li><a href="javascript:void(0)" onClick={props.showSign}>我的</a></li>)).toBe(true);

    expect(wrapper.contains(<Link to="/notifications" activeClassName={styles.active}>
      通知{props.unreadNotice > 0 ? <span className={styles['unread-notice']}>{props.unreadNotice}</span> : null}
    </Link>)).toBe(false);

  })

  it('应该有 `/me` 和 `通知` 链接', function() {

    let props = {
      profile: {
        _id: '586658ea1985b4532700fd0a',
        nickname : "吴世剑"
      },
      showSign: ()=>{},
      unreadNotice: 1
    }

    let wrapper = shallow(<Navbar {...props} />)

    expect(wrapper.contains(<Link to="/me" activeClassName={styles.active}>{props.profile.nickname}</Link>)).toBe(true);

    expect(wrapper.contains(<Link to="/notifications" activeClassName={styles.active}>
      通知{props.unreadNotice > 0 ? <span className={styles['unread-notice']}>{props.unreadNotice}</span> : null}
    </Link>)).toBe(true);
  })

})
