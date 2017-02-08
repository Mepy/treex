
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import utils from '../../helpers/utils'

const styles = require('./sidebar.scss')

export default class SideBar extends Component {

  static propTypes = {
    params: PropTypes.object,
    fileModifiedCount: PropTypes.number.isRequired,
    localBranches: PropTypes.array.isRequired,
    remoteBranches: PropTypes.array.isRequired,
    onCheckoutBranchClick: PropTypes.func.isRequired,
    onCheckoutRemoteBranchClick: PropTypes.func.isRequired,
    repo: PropTypes.object.isRequired,
    projectName: PropTypes.string.isRequired,
    stashes: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
    this.isShowLocalBranches = false
    this.isShowRemoteBranches = false
    this.isShowStashes = false
    this.isShowTags = false
  }

  showLocalBranches() {
    this.isShowLocalBranches = true
    this.forceUpdate()
  }

  hideLocalBranches() {
    this.isShowLocalBranches = false
    this.forceUpdate()
  }

  showRemoteBranches() {
    this.isShowRemoteBranches = true
    this.forceUpdate()
  }

  hideRemoteBranches() {
    this.isShowRemoteBranches = false
    this.forceUpdate()
  }

  showStashes() {
    this.isShowStashes = true
    this.forceUpdate()
  }

  hideStashes() {
    this.isShowStashes = false
    this.forceUpdate()
  }

  showTags() {
    this.isShowTags = true
    this.forceUpdate()
  }

  hideTags() {
    this.isShowTags = false
    this.forceUpdate()
  }

  handleRemoteBranches(remoteBranches) {
    return utils.getOrigins(remoteBranches)
  }

  onCheckoutBranchClick(branch) {
    return () => {
      this.props.onCheckoutBranchClick(this.props.repo, branch)
    }
  }

  render() {
    const origins = this.handleRemoteBranches(this.props.remoteBranches)
    return (
      <div className={styles.sidebar}>
        <div className={styles.item}>
          <div className={styles.title}>
            <div className={styles.icon}>
              <i className={'pc big'}></i>
            </div>
            <span className={styles.text}>WORKSPACE</span>
          </div>
          <Link className={styles.subTitle} to={`/repo/${this.props.params.project}/fileState`}
                activeClassName={styles.active}>
            文件状态{this.props.fileModifiedCount}
          </Link>
          <Link className={styles.subTitle} to={`/repo/${this.props.params.project}/history`}
                activeClassName={styles.active}>
            历史
          </Link>
          <Link className={styles.subTitle} to={`/repo/${this.props.params.project}/search`}
                activeClassName={styles.active}>
            搜索
          </Link>
        </div>
        <div className={`${styles.item} ${!this.isShowLocalBranches? styles.hideSubTitle : ''}`}>
          <div className={styles.title}>
            <div className={styles.icon}>
              <i className={'codeFork big'}></i>
            </div>
            <span className={styles.text}>分支</span>
            <span></span>
            <span
              className={this.isShowLocalBranches? styles.hoverShow : styles.hidden}
              onClick={::this.hideLocalBranches}
            >隐藏</span>
            <span
              className={!this.isShowLocalBranches? styles.hoverShow : styles.hidden}
              onClick={::this.showLocalBranches}
            >显示</span>
          </div>
          {
            this.props.localBranches.map((obj, index) => {
              return <Link key={`local-branch-name-${index}`}
                           className={styles.subTitle}
                           activeClassName={styles.active}
                           to={`/repo/${this.props.params.project}/branches/${obj.name}`}>
                <div className={styles.headMark} style={{ display: obj.isHead? 'inline-block': 'none' }}></div>
                <span className={`ellipsis ${styles.branchName}`} title={obj.name}>{obj.name}</span>
                <span className={styles.hoverText}
                      onClick={::this.onCheckoutBranchClick(obj.name)}
                      style={{
                        display: obj.isHead? 'none':'inline',
                      }}
                >切换</span>
              </Link>
            })
          }
        </div>
        <div className={`${styles.item} ${!this.isShowTags? styles.hideSubTitle : ''}`}>
          <div className={styles.title}>
            <div className={styles.icon}>
              <i className={'tag big'}></i>
            </div>
            <span className={styles.text}>标签</span>
            <span className={this.isShowTags? styles.hoverShow : styles.hidden}
              onClick={::this.hideTags}
            >隐藏</span>
            <span className={!this.isShowTags? styles.hoverShow : styles.hidden}
              onClick={::this.showTags}
            >显示</span>
          </div>
          {
            this.props.tags.map((obj, index) => {
              return <Link key={`sidebar-tag-${index}`}
                           className={styles.subTitle}
                           activeClassName={styles.active}
                           to={`/repo/${this.props.params.project}/tags/${obj}`}>
                <span className={`ellipsis ${styles.branchName}`}
                      title={obj}
                      style={{
                        maxWidth: 100,
                      }}
                >{obj}</span>
              </Link>
            })
          }
        </div>
        <div className={`${styles.item} ${!this.isShowRemoteBranches? styles.hideSubTitle : ''}`}>
          <div className={styles.title}>
            <div className={styles.icon}>
              <i className={'cloud big'}></i>
            </div>
            <span className={styles.text}>远端</span>
            <span
              className={this.isShowRemoteBranches? styles.hoverShow : styles.hidden}
              onClick={::this.hideRemoteBranches}
            >隐藏</span>
            <span
              className={!this.isShowRemoteBranches? styles.hoverShow : styles.hidden}
              onClick={::this.showRemoteBranches}
            >显示</span>
          </div>
          {
            origins.map((origin, index) => {
              return <div className={styles.subTitle} style={{
                paddingLeft: 0,
              }} key={`remote-origin-${index}`}><Origin
                     origin={origin.origin}
                     branches={origin.branches}
                     onBranchClick={(branch) => {
                       this.props.onCheckoutRemoteBranchClick(this.props.projectName, branch)
                     }}
              >{origin.origin}</Origin></div>
            })
          }
        </div>
        <div className={`${styles.item} ${!this.isShowStashes? styles.hideSubTitle : ''}`}>
          <div className={styles.title}>
            <div className={styles.icon}>
              <i className={'boxDot big'}></i>
            </div>
            <span className={styles.text}>已贮藏</span>
            <span
              className={this.isShowStashes? styles.hoverShow : styles.hidden}
              onClick={::this.hideStashes}
            >隐藏</span>
            <span
              className={!this.isShowStashes? styles.hoverShow : styles.hidden}
              onClick={::this.showStashes}
            >显示</span>
          </div>
          {
            this.props.stashes.map((obj, index) => {
              return <Link key={`sidebar-stash-${index}`}
                           className={styles.subTitle}
                           activeClassName={styles.active}
                           to={`/repo/${this.props.params.project}/stashes/${obj.index}`}>
                <span className={`ellipsis ${styles.branchName}`}
                      title={obj.stash}
                      style={{
                        maxWidth: 100,
                      }}
                >{obj.stash}</span>
              </Link>
            })
          }
        </div>
        {/*<div className={styles.item}>
          <div className={styles.title}>
            <div className={styles.icon}></div>
            <span className={styles.text}>子模块</span>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <div className={styles.icon}></div>
            <span className={styles.text}>子树</span>
          </div>
        </div>*/}
      </div>
    )
  }
}

class Origin extends Component {

  static propTypes = {
    onOriginClick: PropTypes.func,
    onBranchClick: PropTypes.func,
    style: PropTypes.object,
    origin: PropTypes.string.isRequired,
    branches: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
    this.showed = false
  }

  handleOriginClick() {
    this.showed = !this.showed
    this.props.onOriginClick && this.props.onOriginClick()
    this.forceUpdate()
  }

  handleBranchClick(e, branch) {
    e.stopPropagation()
    e.preventDefault()
    this.props.onBranchClick && this.props.onBranchClick(branch)
  }

  render() {
    const branches = this.showed? (
      this.props.branches.map((branch) => {
        return <div key={`remote-${this.props.origin}-branch-${branch.name}`}
          title={branch.name}
          onClick={(e) => {
            ::this.handleBranchClick(e, branch.name)
          }}
          style={{
            padding: '4px 0 4px 10px',
          }}
        >{branch.name}</div>
      })
    ) : ''
    return (
      <div onClick={::this.handleOriginClick} style={{
        paddingLeft: 20,
      }}>
        <div>
          {this.props.origin}
          <div className={`${styles.triangle} ${!this.showed?styles.up:''}`}></div>
        </div>
        <div>
          {branches}
        </div>
      </div>
    )
  }
}
