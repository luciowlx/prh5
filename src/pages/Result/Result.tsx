/**
 * 结果分析页 - 职场身价报告
 * 展示：身价区间、市场排位、溢价/折价因子、提升建议、一句话总结、分享卡片
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin, Tag, Tooltip, message } from 'antd';
import {
    ReloadOutlined,
    ShareAltOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CheckCircleOutlined,
    TrophyOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { useAssessment } from '../../context/AssessmentContext';
import styles from './Result.module.css';

/**
 * 数字滚动动画组件
 * @param target - 目标数值
 * @param duration - 动画时长（ms）
 */
function AnimatedNumber({ target, suffix = '', decimals = 1 }: {
    target: number;
    suffix?: string;
    decimals?: number;
}) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const start = Date.now();
        const duration = 1500;
        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
        };
        const timer = setTimeout(() => requestAnimationFrame(tick), 300);
        return () => clearTimeout(timer);
    }, [target]);

    return <span>{current.toFixed(decimals)}{suffix}</span>;
}

/**
 * 评级徽章颜色配置
 */
const RATING_CONFIG = {
    S: { color: '#d2a8ff', bg: 'rgba(210, 168, 255, 0.15)', border: 'rgba(210, 168, 255, 0.35)', label: 'S级' },
    A: { color: '#58a6ff', bg: 'rgba(88, 166, 255, 0.15)', border: 'rgba(88, 166, 255, 0.35)', label: 'A级' },
    B: { color: '#3fb950', bg: 'rgba(63, 185, 80, 0.15)', border: 'rgba(63, 185, 80, 0.35)', label: 'B级' },
    C: { color: '#f0883e', bg: 'rgba(240, 136, 62, 0.15)', border: 'rgba(240, 136, 62, 0.35)', label: 'C级' },
};

/**
 * 结果分析页主组件
 */
export default function Result() {
    const navigate = useNavigate();
    const { result, profile, isAnalyzing } = useAssessment();
    const shareCardRef = useRef<HTMLDivElement>(null);
    const [showShareHint, setShowShareHint] = useState(false);

    // 如果没有结果，重定向到首页
    useEffect(() => {
        if (!result && !isAnalyzing) {
            navigate('/');
        }
    }, [result, isAnalyzing, navigate]);

    const handleShare = () => {
        setShowShareHint(true);
        message.success('截图分享卡片区域即可一键分享！');
        setTimeout(() => {
            shareCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    };

    if (isAnalyzing) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.loadingCard}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#58a6ff' }} spin />} />
                    <h2>正在分析你的职场数据</h2>
                    <p>基于 13 个结构化维度进行市场估值计算...</p>
                    <div className={styles.loadingSteps}>
                        {['匹配城市薪资基准', '叠加行业/岗位系数', '评估技能溢价因子', '计算市场百分位', '生成可解释分析报告'].map((step, i) => (
                            <div key={i} className={styles.loadingStep} style={{ animationDelay: `${i * 0.4}s` }}>
                                <LoadingOutlined style={{ color: '#58a6ff', fontSize: 12 }} />
                                <span>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!result) return null;

    const ratingCfg = RATING_CONFIG[result.rating];

    return (
        <div className={styles.container}>
            {/* 背景装饰 */}
            <div className={styles.bgOrb1} />
            <div className={styles.bgOrb2} />

            {/* 顶部导航 */}
            <div className={styles.nav}>
                <div className={styles.navTitle}>我现在值多少钱 · 分析报告</div>
                <div className={styles.navActions}>
                    <Button
                        className={styles.restartBtn}
                        icon={<ReloadOutlined />}
                        onClick={() => navigate('/assessment')}
                    >
                        重新测算
                    </Button>
                    <Button
                        type="primary"
                        className={styles.shareBtn}
                        icon={<ShareAltOutlined />}
                        onClick={handleShare}
                    >
                        分享结果
                    </Button>
                </div>
            </div>

            <div className={styles.content}>
                {/* ============ 区块1：身价区间主卡 ============ */}
                <div className={styles.heroCard} style={{ animationDelay: '0s' }}>
                    <div className={styles.heroLeft}>
                        <div className={styles.heroLabel}>你的市场身价估值</div>
                        <div className={styles.heroSalary}>
                            <span className={styles.heroCurrency}>¥</span>
                            <span className={styles.heroNum}>
                                <AnimatedNumber target={result.salaryRangeLow} decimals={1} />
                            </span>
                            <span className={styles.heroSep}>万</span>
                            <span className={styles.heroDash}>–</span>
                            <AnimatedNumber target={result.salaryRangeHigh} decimals={0} />
                            <span className={styles.heroUnit}>万 / 年</span>
                        </div>
                        <div className={styles.heroMonthly}>
                            月薪区间：
                            <strong>
                                <AnimatedNumber target={result.monthlySalaryRange[0]} decimals={1} suffix="K" />
                            </strong>
                            {' '}–{' '}
                            <strong>
                                <AnimatedNumber target={result.monthlySalaryRange[1]} decimals={1} suffix="K" />
                            </strong>
                        </div>
                    </div>
                    <div className={styles.heroRight}>
                        <div
                            className={styles.ratingBadge}
                            style={{ color: ratingCfg.color, background: ratingCfg.bg, border: `1px solid ${ratingCfg.border}` }}
                        >
                            <TrophyOutlined />
                            <span>{ratingCfg.label}</span>
                        </div>
                        <div className={styles.ratingDesc}>{result.ratingDesc}</div>
                        <div className={styles.jobInfo}>
                            {profile.position && <Tag color="blue">{profile.position}</Tag>}
                            {profile.city && <Tag>{profile.city}</Tag>}
                            {profile.experience && <Tag>{profile.experience}</Tag>}
                        </div>
                    </div>
                </div>

                {/* ============ 区块2：市场排位 ============ */}
                <div className={styles.sectionCard} style={{ animationDelay: '0.1s' }}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionIcon}>📊</span>
                        <h3>市场排位分析</h3>
                    </div>
                    <div className={styles.percentileSection}>
                        <div className={styles.percentileLabel}>
                            你超越了同岗位 <strong style={{ color: '#58a6ff' }}>{result.percentile}%</strong> 的同类候选人
                        </div>
                        <div className={styles.percentileBarWrap}>
                            <div className={styles.percentileBar}>
                                <div
                                    className={styles.percentileFill}
                                    style={{ width: `${result.percentile}%` }}
                                />
                                <div
                                    className={styles.percentilePointer}
                                    style={{ left: `${result.percentile}%` }}
                                >
                                    <span className={styles.pointerLabel}>你</span>
                                </div>
                            </div>
                            <div className={styles.percentileScale}>
                                <span>市场底部</span>
                                <span>中位线</span>
                                <span>头部区间</span>
                            </div>
                        </div>
                        <div className={styles.percentileDesc}>
                            {result.percentile >= 80 && '你处于市场头部区间，薪资竞争力强，换岗谈薪时具备主动权。'}
                            {result.percentile >= 60 && result.percentile < 80 && '你处于市场中高位区间，与头部人群还有一定差距，1-2 个核心维度的突破可明显提升排位。'}
                            {result.percentile >= 40 && result.percentile < 60 && '你处于市场中位区间，仍有较大提升空间，建议重点补足技能溢价和平台背景两个维度。'}
                            {result.percentile < 40 && '你目前处于市场发展阶段，专注核心技能积累 2-3 年，排位提升会非常显著。'}
                        </div>
                    </div>
                </div>

                {/* ============ 区块3&4：溢价/折价因子 ============ */}
                <div className={styles.factorGrid}>
                    {/* 溢价因子 */}
                    <div className={`${styles.sectionCard} ${styles.premiumCard}`} style={{ animationDelay: '0.2s' }}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionIcon}>⬆️</span>
                            <h3>主要溢价因子</h3>
                            <Tooltip title="这些因素显著提高了你的市场身价">
                                <span className={styles.helpTip}>?</span>
                            </Tooltip>
                        </div>
                        {result.premiumFactors.length === 0 ? (
                            <div className={styles.emptyFactor}>暂无明显溢价项，技能积累后将逐步产生溢价</div>
                        ) : (
                            <div className={styles.factorList}>
                                {result.premiumFactors.map((f, i) => (
                                    <div key={i} className={styles.factorItem}>
                                        <div className={styles.factorTop}>
                                            <span className={styles.factorIcon}>{f.icon}</span>
                                            <span className={styles.factorLabel}>{f.label}</span>
                                            <span className={`${styles.factorImpact} ${styles.impactGreen}`}>
                                                <ArrowUpOutlined /> +{f.impact}%
                                            </span>
                                        </div>
                                        <p className={styles.factorDesc}>{f.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 折价因子 */}
                    <div className={`${styles.sectionCard} ${styles.discountCard}`} style={{ animationDelay: '0.25s' }}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionIcon}>⬇️</span>
                            <h3>主要折价因子</h3>
                            <Tooltip title="这些因素限制了你的市场身价上限">
                                <span className={styles.helpTip}>?</span>
                            </Tooltip>
                        </div>
                        {result.discountFactors.length === 0 ? (
                            <div className={styles.emptyFactor} style={{ color: '#3fb950' }}>
                                <CheckCircleOutlined /> 暂无明显折价因子，整体结构较为健康
                            </div>
                        ) : (
                            <div className={styles.factorList}>
                                {result.discountFactors.map((f, i) => (
                                    <div key={i} className={styles.factorItem} style={{ borderColor: 'rgba(240, 136, 62, 0.15)' }}>
                                        <div className={styles.factorTop}>
                                            <span className={styles.factorIcon}>{f.icon}</span>
                                            <span className={styles.factorLabel}>{f.label}</span>
                                            <span className={`${styles.factorImpact} ${styles.impactOrange}`}>
                                                <ArrowDownOutlined /> -{f.impact}%
                                            </span>
                                        </div>
                                        <p className={styles.factorDesc}>{f.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ============ 区块5：提升建议 ============ */}
                <div className={styles.sectionCard} style={{ animationDelay: '0.3s' }}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionIcon}>🎯</span>
                        <h3>最值得补齐的能力项</h3>
                    </div>
                    <div className={styles.suggestionList}>
                        {result.suggestions.map((s, i) => (
                            <div key={i} className={styles.suggestionItem}>
                                <div className={styles.suggestionNum}>{i + 1}</div>
                                <p>{s}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ============ 区块6：因子权重可视化 ============ */}
                <div className={styles.sectionCard} style={{ animationDelay: '0.35s' }}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionIcon}>🔍</span>
                        <h3>估值因子拆解</h3>
                    </div>
                    <div className={styles.breakdownGrid}>
                        {[
                            { label: '行业基准薪资', value: `${result.factorBreakdown.base.toFixed(1)} 万`, note: '基准线' },
                            { label: '城市系数', value: `×${result.factorBreakdown.cityCoeff.toFixed(2)}`, note: '地区调整' },
                            { label: '年限系数', value: `×${result.factorBreakdown.expCoeff.toFixed(2)}`, note: '经验调整' },
                            { label: '学历系数', value: `×${result.factorBreakdown.eduCoeff.toFixed(2)}`, note: '教育调整' },
                            { label: '管理系数', value: `×${result.factorBreakdown.mgmtCoeff.toFixed(2)}`, note: '领导力' },
                            { label: '公司规模系数', value: `×${result.factorBreakdown.companySizeCoeff.toFixed(2)}`, note: '平台价值' },
                            { label: '技能溢价', value: `+${(result.factorBreakdown.skillBonus * 100).toFixed(0)}%`, note: '稀缺技能' },
                            { label: '工具栈加成', value: `+${(result.factorBreakdown.toolBonus * 100).toFixed(0)}%`, note: '技术栈' },
                        ].map((item, i) => (
                            <div key={i} className={styles.breakdownItem}>
                                <div className={styles.breakdownValue}>{item.value}</div>
                                <div className={styles.breakdownLabel}>{item.label}</div>
                                <div className={styles.breakdownNote}>{item.note}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ============ 区块7：一句话总结 ============ */}
                <div className={styles.summaryCard} style={{ animationDelay: '0.4s' }}>
                    <div className={styles.summaryQuote}>"</div>
                    <p className={styles.summaryText}>{result.summary}</p>
                    <div className={styles.summaryMeta}>— 基于结构化数据分析，《我现在值多少钱》估值系统</div>
                </div>

                {/* ============ 分享卡片 ============ */}
                <div
                    ref={shareCardRef}
                    className={`${styles.shareCard} ${showShareHint ? styles.shareCardHighlight : ''}`}
                    style={{ animationDelay: '0.45s' }}
                >
                    <div className={styles.shareCardInner}>
                        <div className={styles.shareBrand}>我现在值多少钱 · 职场身价报告</div>

                        <div className={styles.shareSalaryRow}>
                            <div className={styles.shareSalaryNum}>
                                ¥{result.salaryRangeLow}万 – {result.salaryRangeHigh}万
                            </div>
                            <div className={styles.shareYearLabel}>/ 年</div>
                        </div>

                        <div className={styles.shareSubRow}>
                            <span className={styles.sharePercentile}>超越 {result.percentile}% 同类候选人</span>
                            <span
                                className={styles.shareRating}
                                style={{ color: ratingCfg.color, background: ratingCfg.bg }}
                            >
                                {ratingCfg.label} · {result.ratingDesc}
                            </span>
                        </div>

                        <div className={styles.shareFactors}>
                            {result.premiumFactors.slice(0, 3).map((f, i) => (
                                <span key={i} className={styles.shareFactorTag}>
                                    <ArrowUpOutlined style={{ fontSize: 10 }} /> {f.label}
                                </span>
                            ))}
                            {result.discountFactors.slice(0, 2).map((f, i) => (
                                <span key={i} className={`${styles.shareFactorTag} ${styles.discountTag}`}>
                                    <ArrowDownOutlined style={{ fontSize: 10 }} /> {f.label}
                                </span>
                            ))}
                        </div>

                        <div className={styles.shareSummary}>"{result.summary}"</div>

                        <div className={styles.shareProfile}>
                            {profile.position} · {profile.city} · {profile.experience} · {profile.education}
                        </div>

                        <div className={styles.shareFooter}>
                            <span>扫码测算你的身价 →</span>
                            <div className={styles.qrPlaceholder}>
                                <div className={styles.qrInner}>QR</div>
                            </div>
                        </div>
                    </div>
                    {showShareHint && (
                        <div className={styles.shareHint}>📸 截图此区域即可分享</div>
                    )}
                </div>

                {/* 底部按钮 */}
                <div className={styles.bottomBtns}>
                    <Button
                        size="large"
                        className={styles.restartBtnBottom}
                        icon={<ReloadOutlined />}
                        onClick={() => navigate('/assessment')}
                    >
                        重新测算
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        className={styles.shareBtnBottom}
                        icon={<ShareAltOutlined />}
                        onClick={handleShare}
                    >
                        分享我的身价单
                    </Button>
                </div>
            </div>
        </div>
    );
}
