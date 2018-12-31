import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';

import { name, Goole_AdSense, client_download_url, contact_email, ICP_number } from '../../../config';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember, getProfile } from '../../store/reducers/user';
import { getOnlineUserCount } from '../../store/reducers/website';


// style
import './style.scss';

// components
import AdsByGoogle from '../../components/adsbygoogle';
import Links from '../../modules/links';
import OpenSource from '../../modules/open-source';
import APPDownload from '../../modules/app-download';
import Footer from '../../modules/footer';
import OperatingStatus from '../../modules/operating-status';
import Case from '../../modules/case';

@connect(
  (state, props) => ({
    me: getProfile(state),
    isMember: isMember(state),
    onlineCount: getOnlineUserCount(state)
  }),
  dispatch => ({
  })
)
export default class Sidebar extends React.Component {

  static defaultProps = {
    // 推荐帖子html
    recommendPostsDom: '',
    showFooter: true
  }

  constructor(props) {
    super(props);
    this.state = {
      appsUrl: '',
      loadCompleted: false
    }
  }

  componentDidMount() {

    this.setState({
      loadCompleted: true,
      appsUrl: window.location.origin+'/apps'
    })

  }

  render() {

    const { isMember, me, recommendPostsDom, onlineCount, showFooter } = this.props
    const { appsUrl, loadCompleted } = this.state;

    let footer = (<div styleName="footer">
                    <div>
                      {contact_email && <a href={`mailto:${contact_email}`}>联系作者</a>}
                      {isMember ?
                        <Link to="/new-posts?topic_id=58b7f69ee2c9ef85541619d5">建议与反馈</Link> :
                        <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-in">建议与反馈</a>}
                    </div>
                    
                    {new Date().getFullYear()} {name+' '}
                    {ICP_number ? <a href="http://www.miitbeian.gov.cn" target="_blank">浙ICP备14013796号-3</a> : null}

                    {loadCompleted && <div>当前 {onlineCount} 人在线</div>}
                    
                  </div>);
                  
    if (!showFooter) footer = null;
                        
    if (this.props.children) {
      return (<div>
        {this.props.children}
        <br />
        {footer}
      </div>);
    }

    return(<div>

      {isMember ?
          <div>
          <Link to='/new-posts' styleName="new-posts" className="d-none d-md-block d-lg-block d-xl-block">创建帖子</Link>
          </div>
        :
        null}

      {!isMember ?
        <div className="card">
          <div className="card-body" styleName="slogan" style={{borderRadius:'12px'}}>
            <h1>{name}是什么社区？</h1>
            <h2>自然生成的社区</h2>
            <div>
              <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-in" className="btn btn-primary btn-sm">加入社区</a>
            </div>
          </div>
        </div>
        : null}
        
      {Goole_AdSense.sidebar ?
        <div className="card">
          <div className="card-body text-center" style={{borderRadius:'12px'}}>
            <div style={{margin:"5px auto 0 auto"}}><AdsByGoogle {...Goole_AdSense.sidebar} /></div>
          </div>
        </div>
        : null}

      {recommendPostsDom ?
        <div className="card">
          <div className="card-header">最热讨论</div>
          <div className="card-body">
            <div styleName="recommend">
              {recommendPostsDom}
            </div>
          </div>
        </div>
        : null}

      {/* <APPDownload /> */}
      <OpenSource />   
      <Case />   
      <Links />
      <OperatingStatus />
      <Footer />
        
    </div>)
  }

}
