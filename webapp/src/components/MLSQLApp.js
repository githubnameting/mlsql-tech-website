import React from 'react';
// import mlsqlLogo from "../image/mlsql-logo.png";
import mlsqlLogo from '../image/10123ad2-5314-475d-9a2d-8ca915b1fc85.png'
import demo1 from '../image/19cdeddf-037e-402c-b113-5f9956143934.png'
import demo2 from '../image/84b75606-f59d-43ab-b35f-6a27e3a47c2e.png'
import demo3 from '../image/25121b80-dcd0-4ca9-9581-87c15a9016af.png'
import codeImage from '../image/WechatIMG80.png'
import { FormattedMessage } from "react-intl";
import { Button } from 'antd'
import { useHistory } from 'react-router-dom'

const MLSQLHome = () => {
  const history = useHistory();
  const handleFreeTrial = () => {
    window.gtag('event', 'freetrail', {
      'event_callback': function () {
        console.log('freetrail')
      }
    })
    history.push({ pathname: '/register' })
  }

    return (<div className="MLSQLApp">
            <div className="body">
                <div className="p1">
                    <div className="p1-wrap">
                        <div className="p1-logo logo-color">
                            <img alt='' src={mlsqlLogo}/>
                        </div>
                        <p className="p1-text"><FormattedMessage id="desc"/></p>
                        <p className="p1-text"><FormattedMessage id="desc2"/></p>
                        <div className="p1-bar">
                            <Button size="large" className="red-btn mr10" onClick={handleFreeTrial}>
                                <FormattedMessage id='free_trail'/>
                            </Button>
                            <Button size="large">
                                <a href="https://mlsql-downloads.kyligence.io">
                                    <FormattedMessage id="download"/>
                                </a>
                            </Button>
                            {/* <a className="p1-bar-item"
                                href="https://mlsql-docs.kyligence.io/latest/zh-hans/"><FormattedMessage id="started"/></a> */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p2-item">

                <div className="col-3" style={{marginLeft: 0}}>
                    <h2><FormattedMessage id={"ease_of_use"}/></h2>
                    <p>
                        <FormattedMessage id={"ease_of_use_desc"}/>
                    </p>

                </div>

                <div className="col-3">
                    <h2><FormattedMessage id={"data_security"}/></h2>
                    <p>
                        <FormattedMessage id={"data_security_desc"}/>
                    </p>
                </div>

                <div className="col-3">
                    <h2><FormattedMessage id={"aliyun_support"}/></h2>
                    <p>
                        <FormattedMessage id={"aliyun_support_desc2"}/>
                    </p>
                </div>
                <div className="clearfix"></div>
                <div className="hr"></div>
            </div>


            <div className="p2-item">

                <div className="col-1">
                    <h2><FormattedMessage id={"load_save_2"}/></h2>
                    <p><FormattedMessage id={"load_save_2_desc"}/></p>
                    <div className="pre-container">
                        <h3>MLSQL</h3>
                        <div className="pre-container-code">
                            <img width={"800px"} alt='' src={demo1}></img>
                            {/*<SyntaxHighlighter language='sql' style={dark}>*/}
                            {/*    <FormattedMessage id={"load_save_2_code"}/>*/}
                            {/*</SyntaxHighlighter>*/}


                        </div>
                    </div>
                </div>

                <div className="col-1">
                    <h2><FormattedMessage id={"load_save_1"}/></h2>
                    <p><FormattedMessage id={"load_save_1_desc"}/></p>
                    <div className="pre-container">
                        <h3>MLSQL</h3>
                        <div className="pre-container-code">
                            <img width={"1000px"} alt='' src={demo2}></img>
                        </div>
                    </div>
                </div>

                <div className="col-1">
                    <h2><FormattedMessage id={"load_save_3"}/></h2>
                    <p><FormattedMessage id={"load_save_3_desc"}/></p>
                    <div className="pre-container">
                        <h3>MLSQL</h3>
                        <div className="pre-container-code">
                            <img width={"1000px"} alt='' src={demo3}></img>
                            {/*<SyntaxHighlighter language='sql' style={dark}>*/}
                            {/*    {<FormattedMessage id={"load_save_4_code"}/>}*/}
                            {/*</SyntaxHighlighter>*/}


                        </div>
                    </div>
                </div>
                <div className="hr"></div>
            </div>

            <div className="p2-item">
                <div className="col-3" style={{marginLeft: 0}}>
                    <h2><a href={"http://blog.mlsql.tech/blog/demo.html"}><FormattedMessage id={"try_online_guide"}/></a></h2>
                    <p>
                        <FormattedMessage id={"try_online_guide_desc"}/>。<a href={"http://blog.mlsql.tech/blog/demo.html"}>Go</a>
                    </p>
                </div>

                <div className="col-3">
                    <h2><a href={"http://blog.mlsql.tech/blog/cloud_oss_analysis.html"}><FormattedMessage id={"aliyun_support"}/></a></h2>
                    <p>
                        <FormattedMessage id={"aliyun_support_desc"}/> <a href={"http://blog.mlsql.tech/blog/cloud_oss_analysis.html"}>Go</a>
                    </p>
                </div>

                <div className="col-3">
                    <h2><FormattedMessage id={"join_wechat_group"}/></h2>
                    <p><FormattedMessage id={"join_wechat_group_desc"}/> </p>
                    <p>
                    <img  height="200" alt='' src={codeImage}></img>
                    </p>
                </div>
                
                <div className="clearfix"></div>
            </div>

            <div className="hr"></div>

            <div className="p2-item copyright">
                MLSQL Licensed under the Apache License, Version 2.0. @<a className="copyright"
                                                                            href="http://www.miitbeian.gov.cn/">浙ICP备18052520号</a>
                <div>@<a target="_blank" rel="noopener noreferrer"
                            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010802009683"><img
                    src="" alt=""/>浙公网安备 33010802009683号</a></div>
            </div>
        </div>
    )
}
export default MLSQLHome
