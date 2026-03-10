import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import {
    BarChartOutlined,
    BulbOutlined,
    ShareAltOutlined,
    ArrowRightOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import styles from './Landing.module.css';

/**
 * 首页 Landing Page
 * 展示产品核心价值主张，引导用户开始测算
 */
export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* 背景装饰球 */}
            <div className={styles.orb1} />
            <div className={styles.orb2} />
            <div className={styles.orb3} />

            {/* 顶部标签 */}
            <div className={styles.badge}>
                <ThunderboltOutlined />
                <span>结构化数据分析引擎 · 免费使用</span>
            </div>

            {/* 主标题区 */}
            <div className={styles.hero}>
                <h1 className={styles.title}>
                    我现在
                    <span className={styles.highlight}> 值多少钱</span>
                    ？
                </h1>
                <p className={styles.subtitle}>
                    基于结构化职场数据分析的市场身价判断器
                    <br />
                    <span className={styles.subtitleSub}>
                        输入你的职场信息 · 3 分钟 · 获得可解释的市场估值报告
                    </span>
                </p>

                <Button
                    type="primary"
                    size="large"
                    className={styles.ctaBtn}
                    onClick={() => navigate('/assessment')}
                    icon={<ArrowRightOutlined />}
                    iconPosition="end"
                >
                    开始测算我的身价
                </Button>

                <p className={styles.hint}>无需注册 · 数据本地处理 · 结果可分享</p>
            </div>

            {/* 展示数字 */}
            <div className={styles.statsRow}>
                <div className={styles.statItem}>
                    <span className={styles.statNum}>13</span>
                    <span className={styles.statLabel}>结构化分析维度</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                    <span className={styles.statNum}>50+</span>
                    <span className={styles.statLabel}>技能溢价因子</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                    <span className={styles.statNum}>100%</span>
                    <span className={styles.statLabel}>可解释性输出</span>
                </div>
            </div>

            {/* 特性卡片区 */}
            <div className={styles.features}>
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon} style={{ background: 'rgba(88, 166, 255, 0.15)' }}>
                        <BarChartOutlined style={{ color: '#58a6ff', fontSize: 24 }} />
                    </div>
                    <h3>结构化输入</h3>
                    <p>
                        参考 UCI Census Income、Kaggle Job Salaries 等公开数据集字段设计，通过城市、行业、技能、工具栈等 13 个维度精确刻画你的职场坐标。
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.featureIcon} style={{ background: 'rgba(63, 185, 80, 0.15)' }}>
                        <BulbOutlined style={{ color: '#3fb950', fontSize: 24 }} />
                    </div>
                    <h3>可解释性分析</h3>
                    <p>
                        不只是给一个数字，而是告诉你哪些因素抬高了你的市场身价、哪些因素限制了你的上限、你与高薪人群的差距究竟在哪里。
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.featureIcon} style={{ background: 'rgba(210, 168, 255, 0.15)' }}>
                        <ShareAltOutlined style={{ color: '#d2a8ff', fontSize: 24 }} />
                    </div>
                    <h3>结果可分享</h3>
                    <p>
                        生成专属「职场身价单」，清晰展示你的市场估值、排位区间和核心竞争力，一键分享给朋友或用于求职参考。
                    </p>
                </div>
            </div>

            {/* 示例结果预览 */}
            <div className={styles.previewSection}>
                <p className={styles.previewLabel}>预览：结果报告长这样</p>
                <div className={styles.previewCard}>
                    <div className={styles.previewLeft}>
                        <div className={styles.previewSalary}>
                            <span className={styles.previewCurrency}>¥</span>
                            <span className={styles.previewNum}>35<span style={{ fontSize: 24 }}>万</span></span>
                            <span className={styles.previewRange}>~ 48 万 / 年</span>
                        </div>
                        <div className={styles.previewBadge}>超越同类人群 72%</div>
                    </div>
                    <div className={styles.previewRight}>
                        <div className={styles.previewTag} style={{ background: 'rgba(63, 185, 80, 0.15)', border: '1px solid rgba(63, 185, 80, 0.3)', color: '#3fb950' }}>
                            ⚡ 稀缺技能溢价 +24%
                        </div>
                        <div className={styles.previewTag} style={{ background: 'rgba(63, 185, 80, 0.15)', border: '1px solid rgba(63, 185, 80, 0.3)', color: '#3fb950' }}>
                            🏙️ 北京城市溢价 +35%
                        </div>
                        <div className={styles.previewTag} style={{ background: 'rgba(240, 136, 62, 0.15)', border: '1px solid rgba(240, 136, 62, 0.3)', color: '#f0883e' }}>
                            ⚠️ 工具栈结构偏弱 -8%
                        </div>
                    </div>
                </div>
            </div>

            {/* 底部 CTA */}
            <div className={styles.bottomCta}>
                <Button
                    type="primary"
                    size="large"
                    className={styles.ctaBtn}
                    onClick={() => navigate('/assessment')}
                >
                    立即测算，3 分钟出结果
                </Button>
            </div>

            {/* 底部说明 */}
            <footer className={styles.footer}>
                <p>本产品使用结构化数据模型进行市场估算，结果仅供参考，不构成薪资谈判依据。</p>
            </footer>
        </div>
    );
}
