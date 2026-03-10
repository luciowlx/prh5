/**
 * 薪资计算引擎
 * 基于加权因子模型，对用户输入的结构化数据进行身价估算
 * 输出：市场薪资区间、排位百分位、溢价/折价因子、提升建议
 */

import {
    CITY_COEFFICIENT,
    INDUSTRY_BASE_SALARY,
    POSITION_COEFFICIENT,
    EXPERIENCE_COEFFICIENT,
    EDUCATION_COEFFICIENT,
    COMPANY_SIZE_COEFFICIENT,
    WORK_MODE_COEFFICIENT,
    MANAGEMENT_COEFFICIENT,
    SKILL_PREMIUM,
    TOOL_PREMIUM,
    CERT_PREMIUM,
} from './salaryData';

/** 用户输入的结构化信息 */
export interface UserProfile {
    city: string;
    industry: string;
    position: string;
    subFunction?: string;
    experience: string;
    hasManagement: string;
    education: string;
    skills: string[];
    tools: string[];
    companySize: string;
    workMode: string;
    currentSalary?: string;
    certs?: string[];
}

/** 溢价/折价因子详情 */
export interface SalaryFactor {
    label: string;
    type: 'premium' | 'discount';
    impact: number; // 影响幅度（百分比，如 15 代表 +15%）
    description: string;
    icon: string;
}

/** 薪资分析结果 */
export interface SalaryResult {
    /** 预计年薪（万元/年），中位数 */
    estimatedSalary: number;
    /** 年薪区间下限 */
    salaryRangeLow: number;
    /** 年薪区间上限 */
    salaryRangeHigh: number;
    /** 月薪中位数（K） */
    monthlySalaryMid: number;
    /** 月薪区间 */
    monthlySalaryRange: [number, number];
    /** 市场百分位（超越了同类人群的X%） */
    percentile: number;
    /** 溢价因子列表 */
    premiumFactors: SalaryFactor[];
    /** 折价因子列表 */
    discountFactors: SalaryFactor[];
    /** 提升建议列表 */
    suggestions: string[];
    /** 一句话总结 */
    summary: string;
    /** 竞争力评级 */
    rating: 'S' | 'A' | 'B' | 'C';
    /** 评级描述 */
    ratingDesc: string;
    /** 计算过程中的系数明细（用于解释性展示） */
    factorBreakdown: {
        base: number;
        cityCoeff: number;
        expCoeff: number;
        eduCoeff: number;
        mgmtCoeff: number;
        companySizeCoeff: number;
        workModeCoeff: number;
        skillBonus: number;
        toolBonus: number;
        certBonus: number;
    };
}

/**
 * 核心计算函数：根据用户结构化输入估算市场身价
 * @param profile - 用户填写的结构化信息
 * @returns 完整的薪资分析结果
 */
export function calculateSalary(profile: UserProfile): SalaryResult {
    // ===== Step 1：获取行业基准薪资 =====
    const industryBase = INDUSTRY_BASE_SALARY[profile.industry] ?? 22;
    const positionCoeff = POSITION_COEFFICIENT[profile.position]?.base ?? 1.0;
    const baseSalary = industryBase * positionCoeff;

    // ===== Step 2：应用各维度系数 =====
    const cityCoeff = CITY_COEFFICIENT[profile.city] ?? 1.0;
    const expCoeff = EXPERIENCE_COEFFICIENT[profile.experience] ?? 1.0;
    const eduCoeff = EDUCATION_COEFFICIENT[profile.education] ?? 1.0;
    const mgmtCoeff = MANAGEMENT_COEFFICIENT[profile.hasManagement] ?? 1.0;
    const companySizeCoeff = COMPANY_SIZE_COEFFICIENT[profile.companySize] ?? 1.0;
    const workModeCoeff = WORK_MODE_COEFFICIENT[profile.workMode] ?? 1.0;

    // ===== Step 3：计算技能与工具加成 =====
    const skillBonus = (profile.skills || []).reduce((sum, skill) => {
        return sum + (SKILL_PREMIUM[skill]?.premium ?? 0);
    }, 0);

    const toolBonus = (profile.tools || []).reduce((sum, tool) => {
        return sum + (TOOL_PREMIUM[tool]?.premium ?? 0);
    }, 0);

    // 技能和工具加成上限为 50%（避免过度加成）
    const cappedSkillBonus = Math.min(skillBonus, 0.35);
    const cappedToolBonus = Math.min(toolBonus, 0.25);

    // ===== Step 4：证书/经历加成 =====
    const certBonus = (profile.certs || []).reduce((sum, cert) => {
        return sum + (CERT_PREMIUM[cert] ?? 0);
    }, 0);
    const cappedCertBonus = Math.min(certBonus, 0.30);

    // ===== Step 5：计算最终薪资 =====
    const estimated = baseSalary
        * cityCoeff
        * expCoeff
        * eduCoeff
        * mgmtCoeff
        * companySizeCoeff
        * workModeCoeff
        * (1 + cappedSkillBonus + cappedToolBonus + cappedCertBonus);

    // 区间：基于正态分布，±15% 为 1 个标准差范围
    const rangeLow = Math.round(estimated * 0.85 * 10) / 10;
    const rangeHigh = Math.round(estimated * 1.16 * 10) / 10;
    const mid = Math.round(estimated * 10) / 10;

    // 月薪转换（年薪 / 14 薪，按中国市场惯例）
    const monthlyMid = Math.round(mid * 10000 / 14 / 1000 * 10) / 10;
    const monthlyLow = Math.round(rangeLow * 10000 / 14 / 1000 * 10) / 10;
    const monthlyHigh = Math.round(rangeHigh * 10000 / 14 / 1000 * 10) / 10;

    // ===== Step 6：计算百分位（正态分布拟合） =====
    // 基于行业中位数，估算当前用户在同类群体中的位置
    const marketMedian = industryBase * positionCoeff * cityCoeff * 0.95;
    const zScore = (estimated - marketMedian) / (marketMedian * 0.3);
    const percentile = Math.min(98, Math.max(15, Math.round(50 + zScore * 18)));

    // ===== Step 7：生成溢价因子 =====
    const premiumFactors: SalaryFactor[] = [];
    const discountFactors: SalaryFactor[] = [];

    // 城市溢价
    if (cityCoeff > 1.1) {
        premiumFactors.push({
            label: '城市溢价',
            type: 'premium',
            impact: Math.round((cityCoeff - 1) * 100),
            description: `${profile.city}作为核心就业市场，薪资水平显著高于全国均值 +${Math.round((cityCoeff - 1) * 100)}%`,
            icon: '🏙️',
        });
    } else if (cityCoeff < 0.9) {
        discountFactors.push({
            label: '城市折价',
            type: 'discount',
            impact: Math.round((1 - cityCoeff) * 100),
            description: `${profile.city}就业市场薪资水平相对一线城市有明显差距，约 -${Math.round((1 - cityCoeff) * 100)}%`,
            icon: '📍',
        });
    }

    // 管理经验溢价
    if (profile.hasManagement === '是') {
        premiumFactors.push({
            label: '管理经验溢价',
            type: 'premium',
            impact: 18,
            description: '具备管理经验的候选人在同年限群体中薪资溢价约 +18%，市场稀缺度高',
            icon: '👤',
        });
    } else if (['5-10年', '10年+'].includes(profile.experience)) {
        discountFactors.push({
            label: '缺乏管理经验',
            type: 'discount',
            impact: 8,
            description: '工作年限较长但尚无管理经历，在高级岗位竞争中相对处于弱势',
            icon: '⚠️',
        });
    }

    // 学历溢价/折价
    if (['硕士', '博士'].includes(profile.education)) {
        premiumFactors.push({
            label: '学历溢价',
            type: 'premium',
            impact: Math.round((eduCoeff - 1) * 100),
            description: `${profile.education}学历在技术/研究类岗位具有明显溢价，招聘门槛筛选带来竞争优势`,
            icon: '🎓',
        });
    } else if (profile.education === '大专及以下') {
        discountFactors.push({
            label: '学历限制',
            type: 'discount',
            impact: 18,
            description: '大专学历在部分企业的简历筛选阶段会有明显阻碍，需以项目经历弥补',
            icon: '📚',
        });
    }

    // 公司规模溢价/折价
    if (profile.companySize === '5000人+（超大型/上市）') {
        premiumFactors.push({
            label: '平台背景加成',
            type: 'premium',
            impact: 22,
            description: '大型/上市公司背景在求职市场中具有显著品牌溢价，跳槽谈薪空间更大',
            icon: '🏢',
        });
    } else if (profile.companySize === '<50人（初创/小型）') {
        discountFactors.push({
            label: '平台背景偏弱',
            type: 'discount',
            impact: 12,
            description: '小型公司背景在涨幅谈判时参考力度较弱，建议补充项目成果数据佐证',
            icon: '🏠',
        });
    }

    // 稀缺技能溢价
    const rareSkills = (profile.skills || []).filter(s => SKILL_PREMIUM[s]?.rarity === '高稀缺');
    if (rareSkills.length >= 2) {
        premiumFactors.push({
            label: '稀缺技能溢价',
            type: 'premium',
            impact: Math.round(Math.min(rareSkills.length * 8, 30)),
            description: `你持有 ${rareSkills.length} 项高稀缺技能（${rareSkills.slice(0, 2).join('、')}等），市场供给明显不足，溢价空间显著`,
            icon: '⚡',
        });
    } else if ((profile.skills || []).length < 3) {
        discountFactors.push({
            label: '技能结构不完整',
            type: 'discount',
            impact: 10,
            description: '当前技能标签较少，在竞争中难以形成差异化，建议补充 2-3 个具有市场辨识度的核心技能',
            icon: '🔧',
        });
    }

    // 高级工具栈溢价
    const sTierTools = (profile.tools || []).filter(t => TOOL_PREMIUM[t]?.tier === 'S');
    if (sTierTools.length >= 2) {
        premiumFactors.push({
            label: '主流工具栈加成',
            type: 'premium',
            impact: Math.round(Math.min(sTierTools.length * 5, 20)),
            description: `你掌握的 ${sTierTools.slice(0, 2).join('、')} 等工具处于行业主流，降低了用人成本，是面试中的加分项`,
            icon: '🛠️',
        });
    } else if ((profile.tools || []).length < 2) {
        discountFactors.push({
            label: '工具栈偏基础',
            type: 'discount',
            impact: 8,
            description: '当前工具栈选择较少或以基础工具为主，在技术成熟度判断上可能低于同年限候选人',
            icon: '📊',
        });
    }

    // 远程溢价
    if (profile.workMode === '完全远程') {
        premiumFactors.push({
            label: '远程工作溢价',
            type: 'premium',
            impact: 7,
            description: '能适应完全远程协作的候选人可接触更广泛的雇主市场（含海外机会），综合竞争力更强',
            icon: '🌐',
        });
    }

    // 证书/经历加成
    if ((profile.certs || []).length > 0) {
        const topCert = profile.certs![0];
        premiumFactors.push({
            label: '项目/背景加成',
            type: 'premium',
            impact: Math.round(cappedCertBonus * 100),
            description: `凭借"${topCert}"等背景经历，你的简历具备额外的差异化竞争优势`,
            icon: '🏆',
        });
    }

    // 高年限折价（年限高但位置期望不匹配）
    if (profile.experience === '10年+' && ['后端工程师', '前端工程师', '数据分析师'].includes(profile.position)) {
        discountFactors.push({
            label: '年限与发展路径不匹配',
            type: 'discount',
            impact: 5,
            description: '10年+工作年限期待匹配更高级的职级（主任/总监/架构师），当前定位可能造成薪资谈判锚点偏低',
            icon: '📈',
        });
    }

    // ===== Step 8：生成提升建议 =====
    const suggestions: string[] = [];
    const missingSkills: string[] = [];

    if (rareSkills.length === 0) {
        missingSkills.push('至少 1-2 个高市场价值的稀缺技能（如 LLM、因果推断、系统架构等）');
    }
    if (sTierTools.length === 0) {
        missingSkills.push('主流 AI/数据/工程工具（如 PyTorch、Spark、Kubernetes）');
    }
    if (profile.hasManagement === '否' && ['5-10年', '10年+'].includes(profile.experience)) {
        suggestions.push('⭐ 优先级：高 | 争取带领 1-2 人的小组或主导完整项目，积累管理/主导经历，这是打开高级薪资区间的关键门槛');
    }
    if (missingSkills.length > 0) {
        suggestions.push(`⭐ 优先级：高 | 补齐核心能力：${missingSkills.join('；')}，可显著提升简历差异化程度`);
    }
    if (profile.education === '大专及以下') {
        suggestions.push('📌 优先级：中 | 建议系统整理 2-3 个完整项目案例（含数据/指标/结论），以项目实力弥补学历筛选阻碍');
    }
    if (profile.companySize !== '5000人+（超大型/上市）' && ['5-10年', '10年+'].includes(profile.experience)) {
        suggestions.push('📌 优先级：中 | 有意识地向知名大厂/上市公司流动，平台背景的品牌溢价会在每次跳槽中持续放大');
    }
    if ((profile.certs || []).length === 0) {
        suggestions.push('💡 优先级：低 | 适当补充行业认可的证书或开源贡献记录，有助于在简历初筛阶段建立信任感');
    }
    suggestions.push('💡 优先级：持续 | 构建个人品牌（技术博客、行业分享、GitHub/作品集），是突破单纯工作年限估值的有效杠杆');

    // ===== Step 9：生成一句话总结 =====
    let summary = '';
    if (percentile >= 85) {
        summary = '你已经处于同类市场的高分位区间——真正的上限不是年限，而是稀缺性和不可替代性。';
    } else if (percentile >= 70) {
        summary = '你的基础扎实，与头部人群的差距不是年限，而是在某 1-2 个高溢价维度上的深度积累。';
    } else if (percentile >= 50) {
        summary = '你目前处于市场可流动区间，再补齐 1-2 个核心能力项，身价可明显跃升一个台阶。';
    } else if (percentile >= 35) {
        summary = '当前估值处于市场中偏下区间，主要限制来自技能结构或平台背景——这两个方向是下一步的突破重点。';
    } else {
        summary = '你目前的市场估值有明显提升空间，聚焦 1 个核心方向深耕 2-3 年，薪资跃升是可预期的。';
    }

    // ===== Step 10：评级 =====
    let rating: 'S' | 'A' | 'B' | 'C';
    let ratingDesc: string;
    if (percentile >= 85) {
        rating = 'S';
        ratingDesc = '高溢价区间·市场抢手';
    } else if (percentile >= 65) {
        rating = 'A';
        ratingDesc = '中高区间·竞争力较强';
    } else if (percentile >= 40) {
        rating = 'B';
        ratingDesc = '市场中位·有提升空间';
    } else {
        rating = 'C';
        ratingDesc = '发展阶段·重点突破期';
    }

    return {
        estimatedSalary: mid,
        salaryRangeLow: rangeLow,
        salaryRangeHigh: rangeHigh,
        monthlySalaryMid: monthlyMid,
        monthlySalaryRange: [monthlyLow, monthlyHigh],
        percentile,
        premiumFactors,
        discountFactors,
        suggestions,
        summary,
        rating,
        ratingDesc,
        factorBreakdown: {
            base: baseSalary,
            cityCoeff,
            expCoeff,
            eduCoeff,
            mgmtCoeff,
            companySizeCoeff,
            workModeCoeff,
            skillBonus: cappedSkillBonus,
            toolBonus: cappedToolBonus,
            certBonus: cappedCertBonus,
        },
    };
}
