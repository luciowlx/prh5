/**
 * 信息填写页 - 3步骤多步表单
 * Step 1: 基本信息（城市、行业、岗位、年限）
 * Step 2: 能力标签（管理经验、技能、工具栈）
 * Step 3: 背景信息（学历、公司规模、薪资）
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Form,
    Select,
    Radio,
    Button,
    Checkbox,
    message,
} from 'antd';
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { useAssessment } from '../../context/AssessmentContext';
import { calculateSalary } from '../../mock/calculator';
import type { UserProfile } from '../../mock/calculator';
import {
    CITY_OPTIONS,
    INDUSTRY_OPTIONS,
    POSITION_OPTIONS,
    SKILL_GROUPS,
    TOOL_GROUPS,
    CERT_OPTIONS,
} from '../../mock/salaryData';
import styles from './Assessment.module.css';

const { Option } = Select;

/** 步骤配置 */
const STEPS = [
    { title: '基本信息', subtitle: '你的职场坐标' },
    { title: '能力标签', subtitle: '你的核心竞争力' },
    { title: '背景信息', subtitle: '补充完善画像' },
];

/** 子职能选项（按行业/岗位动态配置） */
const SUB_FUNCTION_OPTIONS = [
    '用户增长 / Growth',
    '商业化 / Monetization',
    'B端 SaaS',
    'AI / 算法产品',
    '数据平台',
    '基础架构',
    '推荐系统',
    '搜索 / NLP',
    '风控 / 安全',
    '供应链 / 物流',
    '金融科技 / FinTech',
    '国际化业务',
    '前台业务',
    '中台/平台',
    '其他',
];

/**
 * 信息填写页主组件
 */
export default function Assessment() {
    const navigate = useNavigate();
    const { setProfile, setResult, setIsAnalyzing } = useAssessment();
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [formData, setFormData] = useState<Partial<UserProfile>>({});
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);

    /** 合并步骤数据并前进 */
    const handleNext = async () => {
        try {
            const values = await form.validateFields();
            const merged = { ...formData, ...values };
            setFormData(merged);
            if (currentStep < 2) {
                setCurrentStep(currentStep + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // 最后一步：提交分析
                await handleSubmit(merged);
            }
        } catch {
            message.warning('请完善必填信息再继续');
        }
    };

    /** 返回上一步 */
    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /** 提交分析 */
    const handleSubmit = async (data: Partial<UserProfile>) => {
        const fullProfile: UserProfile = {
            city: data.city || '',
            industry: data.industry || '',
            position: data.position || '',
            subFunction: data.subFunction,
            experience: data.experience || '',
            hasManagement: data.hasManagement || '否',
            education: data.education || '',
            skills: selectedSkills,
            tools: selectedTools,
            companySize: data.companySize || '',
            workMode: data.workMode || '',
            currentSalary: data.currentSalary,
            certs: data.certs || [],
        };

        setProfile(fullProfile);
        setIsAnalyzing(true);

        // 模拟异步分析（setTimeout 模拟接口调用）
        await new Promise(resolve => setTimeout(resolve, 2200));

        const result = calculateSalary(fullProfile);
        setResult(result);
        setIsAnalyzing(false);

        navigate('/result');
    };

    const progressPercent = ((currentStep) / STEPS.length) * 100;

    return (
        <div className={styles.container}>
            {/* 背景装饰 */}
            <div className={styles.bgOrb1} />
            <div className={styles.bgOrb2} />

            {/* 顶部导航 */}
            <div className={styles.nav}>
                <button className={styles.backBtn} onClick={() => currentStep === 0 ? navigate('/') : handlePrev()}>
                    <ArrowLeftOutlined />
                    <span>{currentStep === 0 ? '返回首页' : '上一步'}</span>
                </button>
                <div className={styles.navTitle}>我现在值多少钱</div>
                <div className={styles.stepCount}>{currentStep + 1} / {STEPS.length}</div>
            </div>

            {/* 整体进度条 */}
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progressPercent + 33}%` }} />
            </div>

            {/* 步骤指示器 */}
            <div className={styles.stepIndicator}>
                {STEPS.map((step, index) => (
                    <div key={index} className={`${styles.stepItem} ${index < currentStep ? styles.done : ''} ${index === currentStep ? styles.active : ''}`}>
                        <div className={styles.stepCircle}>
                            {index < currentStep ? '✓' : index + 1}
                        </div>
                        <div className={styles.stepInfo}>
                            <span className={styles.stepTitle}>{step.title}</span>
                            <span className={styles.stepSub}>{step.subtitle}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 表单卡片 */}
            <div className={styles.formCard}>
                <div className={styles.formHeader}>
                    <h2>{STEPS[currentStep].title}</h2>
                    <p>{STEPS[currentStep].subtitle}</p>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    className={styles.form}
                    initialValues={formData}
                    requiredMark={false}
                >
                    {/* ==================== Step 1: 基本信息 ==================== */}
                    {currentStep === 0 && (
                        <div className={styles.stepContent}>
                            <div className={styles.row2}>
                                <Form.Item
                                    label="所在城市 / 地区"
                                    name="city"
                                    rules={[{ required: true, message: '请选择城市' }]}
                                >
                                    <Select
                                        placeholder="选择城市"
                                        size="large"
                                        showSearch
                                        optionFilterProp="label"
                                        options={CITY_OPTIONS}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="所在行业"
                                    name="industry"
                                    rules={[{ required: true, message: '请选择行业' }]}
                                >
                                    <Select placeholder="选择行业" size="large" options={INDUSTRY_OPTIONS} />
                                </Form.Item>
                            </div>

                            <div className={styles.row2}>
                                <Form.Item
                                    label="岗位方向"
                                    name="position"
                                    rules={[{ required: true, message: '请选择岗位' }]}
                                >
                                    <Select placeholder="选择岗位" size="large" options={POSITION_OPTIONS} />
                                </Form.Item>

                                <Form.Item label="子职能 / 具体方向（可选）" name="subFunction">
                                    <Select placeholder="进一步细分方向" size="large" allowClear>
                                        {SUB_FUNCTION_OPTIONS.map(opt => (
                                            <Option key={opt} value={opt}>{opt}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <Form.Item
                                label="工作年限"
                                name="experience"
                                rules={[{ required: true, message: '请选择工作年限' }]}
                            >
                                <Radio.Group className={styles.radioGroup} size="large">
                                    {['<1年', '1-3年', '3-5年', '5-10年', '10年+'].map(v => (
                                        <Radio.Button key={v} value={v}>{v}</Radio.Button>
                                    ))}
                                </Radio.Group>
                            </Form.Item>

                            <div className={styles.tipBox}>
                                <span className={styles.tipIcon}>💡</span>
                                <p>填写信息越准确，估算结果越贴近市场真实水平。所有数据在本地处理，不会上传。</p>
                            </div>
                        </div>
                    )}

                    {/* ==================== Step 2: 能力标签 ==================== */}
                    {currentStep === 1 && (
                        <div className={styles.stepContent}>
                            <Form.Item
                                label="是否有管理经验（直接带过下属）"
                                name="hasManagement"
                                rules={[{ required: true, message: '请选择' }]}
                                initialValue="否"
                            >
                                <Radio.Group className={styles.radioGroupMgmt} size="large">
                                    <Radio.Button value="是">✅ 是，带过团队</Radio.Button>
                                    <Radio.Button value="否">❌ 否，暂无管理经历</Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            {/* 技能标签多选 */}
                            <div className={styles.checkGroupSection}>
                                <div className={styles.checkGroupLabel}>
                                    <span>核心技能标签</span>
                                    <span className={styles.selectedCount}>{selectedSkills.length} 项已选</span>
                                </div>
                                {SKILL_GROUPS.map(group => (
                                    <div key={group.label} className={styles.checkGroup}>
                                        <div className={styles.groupTitle}>{group.label}</div>
                                        <Checkbox.Group
                                            options={group.skills.map(s => ({ label: s, value: s }))}
                                            value={selectedSkills}
                                            onChange={vals => setSelectedSkills(vals as string[])}
                                            className={styles.checkboxGroup}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* 工具栈多选 */}
                            <div className={styles.checkGroupSection}>
                                <div className={styles.checkGroupLabel}>
                                    <span>常用工具 / 技术栈</span>
                                    <span className={styles.selectedCount}>{selectedTools.length} 项已选</span>
                                </div>
                                {TOOL_GROUPS.map(group => (
                                    <div key={group.label} className={styles.checkGroup}>
                                        <div className={styles.groupTitle}>{group.label}</div>
                                        <Checkbox.Group
                                            options={group.tools.map(t => ({ label: t, value: t }))}
                                            value={selectedTools}
                                            onChange={vals => setSelectedTools(vals as string[])}
                                            className={styles.checkboxGroup}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className={styles.tipBox}>
                                <span className={styles.tipIcon}>⚡</span>
                                <p>技能标签和工具栈是判断溢价空间的核心维度，请尽量选择自己真实掌握的项目。</p>
                            </div>
                        </div>
                    )}

                    {/* ==================== Step 3: 背景信息 ==================== */}
                    {currentStep === 2 && (
                        <div className={styles.stepContent}>
                            <Form.Item
                                label="最高学历"
                                name="education"
                                rules={[{ required: true, message: '请选择学历' }]}
                            >
                                <Radio.Group className={styles.radioGroup} size="large">
                                    {['大专及以下', '本科', '硕士', '博士'].map(v => (
                                        <Radio.Button key={v} value={v}>{v}</Radio.Button>
                                    ))}
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                label="公司规模"
                                name="companySize"
                                rules={[{ required: true, message: '请选择公司规模' }]}
                            >
                                <Radio.Group className={styles.radioGroupVertical} size="large">
                                    {[
                                        '<50人（初创/小型）',
                                        '50-500人（中型）',
                                        '500-5000人（大型）',
                                        '5000人+（超大型/上市）'
                                    ].map(v => (
                                        <Radio.Button key={v} value={v}>{v}</Radio.Button>
                                    ))}
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                label="工作模式"
                                name="workMode"
                                rules={[{ required: true, message: '请选择工作模式' }]}
                            >
                                <Radio.Group className={styles.radioGroup} size="large">
                                    {['现场办公', '混合模式', '完全远程'].map(v => (
                                        <Radio.Button key={v} value={v}>{v}</Radio.Button>
                                    ))}
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                label="当前薪资区间（可选，用于对比分析）"
                                name="currentSalary"
                            >
                                <Select placeholder="选择当前薪资区间（可跳过）" size="large" allowClear>
                                    {['<10K/月', '10-15K/月', '15-20K/月', '20-30K/月', '30-50K/月', '50K+/月', '不方便透露'].map(v => (
                                        <Option key={v} value={v}>{v}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="证书 / 特殊背景（可选，多选）"
                                name="certs"
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="选择相关背景加成项"
                                    size="large"
                                    allowClear
                                    options={CERT_OPTIONS}
                                />
                            </Form.Item>

                            <div className={styles.tipBox} style={{ borderColor: 'rgba(210, 168, 255, 0.25)', background: 'rgba(210, 168, 255, 0.06)' }}>
                                <span className={styles.tipIcon}>🔍</span>
                                <p>点击「开始分析」后，系统将对你的 13 个维度进行结构化评估，生成专属的市场身价报告。</p>
                            </div>
                        </div>
                    )}
                </Form>

                {/* 按钮区 */}
                <div className={styles.btnRow}>
                    {currentStep > 0 && (
                        <Button
                            size="large"
                            className={styles.prevBtn}
                            onClick={handlePrev}
                            icon={<ArrowLeftOutlined />}
                        >
                            上一步
                        </Button>
                    )}
                    <Button
                        type="primary"
                        size="large"
                        className={styles.nextBtn}
                        onClick={handleNext}
                        icon={currentStep === 2 ? <SearchOutlined /> : <ArrowRightOutlined />}
                        iconPosition="end"
                    >
                        {currentStep === 2 ? '开始分析我的身价' : '下一步'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
