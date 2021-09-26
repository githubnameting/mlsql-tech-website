import React, {Component, Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import pineTree from '../image/pine-tree.png';
import github from '../image/github.png';
import search from '../image/search.png';
import menu from '../image/menu.png';
import language from '../image/language.png';
import {FormattedMessage} from "react-intl";
import { Menu, Dropdown } from 'antd';
import UserInfo from './UserInfo'
// import ReactGA from 'react-ga'
class MLSQLHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: 'Search docs',
      navs: [
        { text: <FormattedMessage id={"downloads"}/>, url: 'https://mlsql-downloads.kyligence.io' },
        { text: <FormattedMessage id={"tutorial"}/>, url: 'https://mlsql-docs.kyligence.io/latest/zh-hans/' },
        { text: <FormattedMessage id={"community"}/>, url: 'https://github.com/allwefantasy/mlsql' },
        { text: <FormattedMessage id={"blog"}/>, url: 'http://blog.mlsql.tech/' },
        { text: <FormattedMessage id={"video"}/>, url: 'https://space.bilibili.com/22610047/video' }
      ],
      isDropMenuOpen: false,
      isDisplayLanguage: false
    };

    this.onChange = this.onChange.bind(this);
    this.displayDropMenu = this.displayDropMenu.bind(this);
    this.displayDropLanguage = this.displayDropLanguage.bind(this);
    this.handleChangeLang = this.handleChangeLang.bind(this)
  }

  displayDropMenu() {
    if (this.state.isDisplayLanguage) {
      this.displayDropLanguage()
    }
    this.setState({
      isDropMenuOpen: !this.state.isDropMenuOpen
    })
  }

  displayDropLanguage () {
    if (this.state.isDropMenuOpen) {
      this.displayDropMenu()
    }
    this.setState({
      isDisplayLanguage: !this.state.isDisplayLanguage
    })
  }
  handleChangeLang (lang) {
    this.props.onLocaleChange(lang.key)
  }

  render() {
    const langMenu = (<Menu onClick={this.handleChangeLang}>
      <Menu.Item key="zh">中文</Menu.Item>
      <Menu.Item key="en">English</Menu.Item>
    </Menu>)
    const { pathname } = this.props.history.location

    return (
      <div className="header">
        <div className="header-wrap">
          <div className="header-nav-left">
            <div className="nav-item logo logo-color" style={{ paddingLeft: 0 }}>
                <img alt='' src={pineTree} width="22"/>MLSQL
            </div>
            {
              this.state.navs.map((nav, index) => {
                return (
                  <div key={index} className="nav-item">
                    <a rel="noopener noreferrer" href={ nav.url } target="_blank">{ nav.text }</a>
                  </div>
                )
              })
            }
            <div className="clearfix"></div>
          </div>
          <div className="nav-menu" >
            <img alt='' src={menu} width="20" onClick={ this.displayDropMenu }/>
            <div className="nav-menu-drop" style={{ display: this.state.isDropMenuOpen ? 'block' : 'none' }}>
              {
                this.state.navs.map((nav, index) => {
                  return (
                    <div key={index} className="nav-menu-drop-item">
                      <a rel="noopener noreferrer" href={ nav.url } target="_blank">{ nav.text }</a>
                    </div>
                  )
                })
              }
            </div>
          </div>
          {
            pathname === '/home' ? (
              <Fragment>
                <div className="nav-item header-nav-right">
                  <UserInfo />
                </div>
                <div className="nav-item nav-small header-nav-right">
                  <div className="nav-menu">
                    <img alt='' src={menu} width="16" style={{ float: 'right' }}/>
                  </div>
                  <div className="nav-gitlab">
                    <a rel="noopener noreferrer" href="https://github.com/allwefantasy/mlsql" target="_blank">GitHub</a>
                    <img alt='' src={github} width="16" style={{ float: 'right' }}/>
                  </div>
                </div>
                <div className="nav-lang">
                  <Dropdown overlay={langMenu} placement="bottomLeft">
                    <img alt='' src={language} width="20" />
                  </Dropdown>
                </div>
                <div className="nav-item header-nav-right">
                  <div className="nav-search">
                    <div id="nav-search-form">
                      <img alt='' src={search} width="22"/>
                      <input
                        type="text"
                        className="nav-search-text"
                        value={ this.state.keyword }
                        onChange={ this.onChange }
                        onFocus={() => { this.setState({ keyword: '' }) }}
                        onBlur={() => { this.setState({ keyword: 'Search docs' }) }}
                      />
                      <input type="submit" value="" style={{display: 'none'}}/>
                    </div>
                  </div>
                </div>
                <div className="clearfix"></div>
              </Fragment>) : (
                pathname === '/login' ? (null) : (
                <div className="nav-item header-nav-right">
                  <UserInfo />
                </div>
                )
              )
          }
        </div>
      </div>
    );
  }

  onChange(e) {
    const val = e.target.value || '';

    this.setState({
      keyword: val.trim(),
    })
  }
}

export default withRouter(MLSQLHeader);
