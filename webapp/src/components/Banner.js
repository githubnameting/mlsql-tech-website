import React from 'react';
import banner1 from '../image/banner1.png'
import banner2 from '../image/banner2.png'
import banner3 from '../image/banner3.png'

const LoginText = () => {
  return (
    <div className="register-page-text">
      <h4 className="register-page-text-title">免费试用 MLSQL</h4>
      <div className="register-page-text-min-title">
        无需部署，MLSQL Lab 邀您体验<span className="hightlight">低门槛的一站式数据科学平台</span><br />
        MLSQL Lab 提供快速入门教程和场景化 demo, 助您体验 MLSQL 语言的神奇魅力
      </div>
      <ul className="register-page-text-card">
        <li>
          <img src={banner1} alt='' />
          <h3>更快捷的数据集成</h3>
          <ul className="register-page-text-card-text">
            <li>统一平台对接多种数据源</li>
            <li>端到端的数据清理， 整合和探索能力</li>
          </ul>
        </li>
        <li>
          <img src={banner2} alt='' />
          <h3>更高效的数据探索</h3>
          <ul className="register-page-text-card-text">
            <li>可视化工作流进行交互式数据探索</li>
            <li>实时浏览大数据集</li>
          </ul>
        </li>
        <li>
          <img src={banner3} alt='' />
          <h3>更简单的机器学习</h3>
          <ul className="register-page-text-card-text">
            <li>使用类 SQL 编程语法玩转模型训练和部署</li>
            <li>内置 ML 模型助您获得更快的见解</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default LoginText
