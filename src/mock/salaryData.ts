/**
 * 薪资基准数据模块
 * 对标 UCI Adult / Kaggle AI & Data Science Job Salaries 数据集字段结构
 * 提供各维度的基准薪资与系数配置
 */

/** 城市薪资系数配置（参考国内各城市薪资水平差异） */
export const CITY_COEFFICIENT: Record<string, number> = {
  '北京': 1.35,
  '上海': 1.30,
  '深圳': 1.28,
  '杭州': 1.15,
  '广州': 1.10,
  '成都': 0.90,
  '武汉': 0.88,
  '南京': 0.95,
  '西安': 0.82,
  '苏州': 0.98,
  '重庆': 0.85,
  '天津': 0.87,
  '长沙': 0.83,
  '郑州': 0.80,
  '其他': 0.78,
  // 国际城市
  '美国': 4.50,
  '英国': 2.80,
  '新加坡': 2.50,
  '香港': 2.20,
  '加拿大': 2.10,
  '澳大利亚': 2.00,
};

/** 行业基础薪资配置（单位：万元/年，代表该行业中级岗位3-5年基准） */
export const INDUSTRY_BASE_SALARY: Record<string, number> = {
  '互联网/软件': 30,
  '人工智能/大数据': 38,
  '金融/银行/证券': 32,
  '咨询/管理': 28,
  '电商/新零售': 26,
  '游戏/娱乐': 27,
  '医疗/生物科技': 24,
  '教育/培训': 18,
  '制造业': 16,
  '房地产': 20,
  '新能源/半导体': 30,
  '传媒/广告': 18,
  '汽车/交通': 22,
  '政府/事业单位': 16,
  '快消/零售': 18,
};

/** 岗位系数配置（相对于行业基准薪资的倍数） */
export const POSITION_COEFFICIENT: Record<string, { base: number; label: string }> = {
  '产品经理': { base: 1.0, label: '产品方向' },
  '数据分析师': { base: 1.05, label: '数据方向' },
  '数据科学家': { base: 1.25, label: '数据科学' },
  '机器学习工程师': { base: 1.30, label: 'AI/ML' },
  '算法工程师': { base: 1.35, label: 'AI算法' },
  '后端工程师': { base: 1.05, label: '后端开发' },
  '前端工程师': { base: 0.95, label: '前端开发' },
  '全栈工程师': { base: 1.10, label: '全栈开发' },
  '架构师': { base: 1.45, label: '技术架构' },
  '运维/DevOps': { base: 0.95, label: 'DevOps' },
  '安全工程师': { base: 1.15, label: '信息安全' },
  '项目经理': { base: 0.95, label: '项目管理' },
  '运营': { base: 0.80, label: '运营方向' },
  'UI/UX设计师': { base: 0.90, label: '设计方向' },
  '销售/商务': { base: 0.85, label: '商务方向' },
  '市场营销': { base: 0.82, label: '市场方向' },
  'HR/人力资源': { base: 0.78, label: 'HR方向' },
  '财务/会计': { base: 0.80, label: '财务方向' },
};

/** 工作年限系数配置 */
export const EXPERIENCE_COEFFICIENT: Record<string, number> = {
  '<1年': 0.60,
  '1-3年': 0.85,
  '3-5年': 1.00,
  '5-10年': 1.35,
  '10年+': 1.65,
};

/** 学历系数配置（对标 UCI 数据集中 education 字段） */
export const EDUCATION_COEFFICIENT: Record<string, number> = {
  '大专及以下': 0.82,
  '本科': 1.00,
  '硕士': 1.22,
  '博士': 1.40,
};

/** 公司规模系数配置（对标数据集中 company-size 字段） */
export const COMPANY_SIZE_COEFFICIENT: Record<string, number> = {
  '<50人（初创/小型）': 0.88,
  '50-500人（中型）': 0.98,
  '500-5000人（大型）': 1.08,
  '5000人+（超大型/上市）': 1.22,
};

/** 工作模式系数配置 */
export const WORK_MODE_COEFFICIENT: Record<string, number> = {
  '现场办公': 1.00,
  '混合模式': 1.03,
  '完全远程': 1.07,
};

/** 管理经验系数 */
export const MANAGEMENT_COEFFICIENT: Record<string, number> = {
  '是': 1.18,
  '否': 1.00,
};

/** 技能稀缺度配置（每项技能的加成系数，基于市场供需分析） */
export const SKILL_PREMIUM: Record<string, { premium: number; rarity: '高稀缺' | '中稀缺' | '普通' }> = {
  // AI/ML 领域
  'LLM/大语言模型': { premium: 0.12, rarity: '高稀缺' },
  '深度学习': { premium: 0.10, rarity: '高稀缺' },
  '机器学习': { premium: 0.08, rarity: '中稀缺' },
  'NLP自然语言处理': { premium: 0.09, rarity: '高稀缺' },
  '计算机视觉': { premium: 0.09, rarity: '高稀缺' },
  '强化学习': { premium: 0.11, rarity: '高稀缺' },
  // 数据领域
  '数据建模': { premium: 0.06, rarity: '中稀缺' },
  'A/B测试设计': { premium: 0.05, rarity: '中稀缺' },
  '统计分析': { premium: 0.04, rarity: '普通' },
  '数据可视化': { premium: 0.03, rarity: '普通' },
  '因果推断': { premium: 0.08, rarity: '高稀缺' },
  // 工程领域
  '系统架构设计': { premium: 0.10, rarity: '高稀缺' },
  '分布式系统': { premium: 0.09, rarity: '高稀缺' },
  '性能优化': { premium: 0.06, rarity: '中稀缺' },
  '微服务架构': { premium: 0.07, rarity: '中稀缺' },
  'Kubernetes/云原生': { premium: 0.08, rarity: '中稀缺' },
  // 产品领域
  '用户增长': { premium: 0.07, rarity: '中稀缺' },
  '商业化产品': { premium: 0.08, rarity: '高稀缺' },
  'B端产品': { premium: 0.06, rarity: '中稀缺' },
  'AI产品设计': { premium: 0.09, rarity: '高稀缺' },
  // 通用
  '跨团队协作': { premium: 0.03, rarity: '普通' },
  '项目管理': { premium: 0.04, rarity: '普通' },
  '英文读写': { premium: 0.04, rarity: '普通' },
  '英文工作环境': { premium: 0.08, rarity: '中稀缺' },
};

/** 工具栈主流度加成配置 */
export const TOOL_PREMIUM: Record<string, { premium: number; tier: 'S' | 'A' | 'B' }> = {
  // AI/ML 工具
  'PyTorch': { premium: 0.06, tier: 'S' },
  'TensorFlow': { premium: 0.05, tier: 'S' },
  'scikit-learn': { premium: 0.04, tier: 'A' },
  'HuggingFace': { premium: 0.07, tier: 'S' },
  'LangChain': { premium: 0.07, tier: 'S' },
  // 数据工具
  'Python': { premium: 0.05, tier: 'S' },
  'SQL': { premium: 0.03, tier: 'A' },
  'Spark': { premium: 0.06, tier: 'S' },
  'Flink': { premium: 0.06, tier: 'S' },
  'dbt': { premium: 0.05, tier: 'A' },
  'Airflow': { premium: 0.05, tier: 'A' },
  'Tableau': { premium: 0.03, tier: 'B' },
  'Power BI': { premium: 0.02, tier: 'B' },
  // 云平台
  'AWS': { premium: 0.05, tier: 'A' },
  'Google Cloud': { premium: 0.05, tier: 'A' },
  '阿里云': { premium: 0.04, tier: 'A' },
  // 工程工具
  'Kubernetes': { premium: 0.06, tier: 'S' },
  'Docker': { premium: 0.04, tier: 'A' },
  'Git/GitHub': { premium: 0.02, tier: 'B' },
  // 语言
  'Java': { premium: 0.04, tier: 'A' },
  'Go': { premium: 0.06, tier: 'S' },
  'Rust': { premium: 0.07, tier: 'S' },
  'React': { premium: 0.04, tier: 'A' },
  'TypeScript': { premium: 0.04, tier: 'A' },
};

/** 证书/经历加成配置 */
export const CERT_PREMIUM: Record<string, number> = {
  '国际知名大厂背景（FAANG/BAT/TMD等）': 0.15,
  '独立带过完整项目': 0.08,
  '参与过亿级用户产品': 0.10,
  'PMP项目管理证书': 0.04,
  'CFA/CPA等金融证书': 0.08,
  '开源项目贡献（有影响力）': 0.09,
  '国内外专利': 0.06,
  '论文发表（顶会/期刊）': 0.10,
  '创业经历': 0.07,
  'AWS/GCP等云认证': 0.05,
};

/** 城市列表 */
export const CITY_OPTIONS = [
  { value: '北京', label: '北京' },
  { value: '上海', label: '上海' },
  { value: '深圳', label: '深圳' },
  { value: '杭州', label: '杭州' },
  { value: '广州', label: '广州' },
  { value: '成都', label: '成都' },
  { value: '武汉', label: '武汉' },
  { value: '南京', label: '南京' },
  { value: '西安', label: '西安' },
  { value: '苏州', label: '苏州' },
  { value: '重庆', label: '重庆' },
  { value: '天津', label: '天津' },
  { value: '长沙', label: '长沙' },
  { value: '郑州', label: '郑州' },
  { value: '美国', label: '美国（北美）' },
  { value: '英国', label: '英国（欧洲）' },
  { value: '新加坡', label: '新加坡' },
  { value: '香港', label: '香港' },
  { value: '加拿大', label: '加拿大' },
  { value: '其他', label: '其他城市' },
];

/** 行业选项 */
export const INDUSTRY_OPTIONS = Object.keys(INDUSTRY_BASE_SALARY).map(k => ({ value: k, label: k }));

/** 岗位选项 */
export const POSITION_OPTIONS = Object.entries(POSITION_COEFFICIENT).map(([k, v]) => ({
  value: k,
  label: `${k}（${v.label}）`,
}));

/** 技能选项分组 */
export const SKILL_GROUPS = [
  {
    label: 'AI / 机器学习',
    skills: ['LLM/大语言模型', '深度学习', '机器学习', 'NLP自然语言处理', '计算机视觉', '强化学习', '因果推断', 'AI产品设计'],
  },
  {
    label: '数据分析',
    skills: ['数据建模', 'A/B测试设计', '统计分析', '数据可视化'],
  },
  {
    label: '工程能力',
    skills: ['系统架构设计', '分布式系统', '性能优化', '微服务架构', 'Kubernetes/云原生'],
  },
  {
    label: '产品 / 业务',
    skills: ['用户增长', '商业化产品', 'B端产品', '跨团队协作', '项目管理'],
  },
  {
    label: '通用能力',
    skills: ['英文读写', '英文工作环境'],
  },
];

/** 工具栈选项分组 */
export const TOOL_GROUPS = [
  {
    label: 'AI / ML 框架',
    tools: ['PyTorch', 'TensorFlow', 'scikit-learn', 'HuggingFace', 'LangChain'],
  },
  {
    label: '数据工程',
    tools: ['Python', 'SQL', 'Spark', 'Flink', 'dbt', 'Airflow', 'Tableau', 'Power BI'],
  },
  {
    label: '云平台',
    tools: ['AWS', 'Google Cloud', '阿里云'],
  },
  {
    label: '工程 / DevOps',
    tools: ['Kubernetes', 'Docker', 'Git/GitHub'],
  },
  {
    label: '编程语言',
    tools: ['Java', 'Go', 'Rust', 'React', 'TypeScript'],
  },
];

/** 证书/经历选项 */
export const CERT_OPTIONS = Object.keys(CERT_PREMIUM).map(k => ({ value: k, label: k }));
