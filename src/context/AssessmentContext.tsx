/**
 * 全局状态管理 Context
 * 管理用户填写的结构化信息和分析结果，跨页面数据保持一致
 */

import { createContext, useContext, useState, ReactNode } from 'react';
import type { UserProfile } from '../mock/calculator';
import type { SalaryResult } from '../mock/calculator';

/** Context 数据结构 */
interface AssessmentContextType {
    /** 用户填写的结构化信息（表单数据） */
    profile: Partial<UserProfile>;
    /** 更新用户信息 */
    setProfile: (profile: Partial<UserProfile>) => void;
    /** 分析结果 */
    result: SalaryResult | null;
    /** 设置分析结果 */
    setResult: (result: SalaryResult | null) => void;
    /** 是否正在分析中 */
    isAnalyzing: boolean;
    /** 设置分析状态 */
    setIsAnalyzing: (v: boolean) => void;
}

const AssessmentContext = createContext<AssessmentContextType>({
    profile: {},
    setProfile: () => { },
    result: null,
    setResult: () => { },
    isAnalyzing: false,
    setIsAnalyzing: () => { },
});

/**
 * Provider 组件：全局状态包裹
 * @param children - 子组件
 */
export function AssessmentProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<Partial<UserProfile>>({});
    const [result, setResult] = useState<SalaryResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    return (
        <AssessmentContext.Provider value={{ profile, setProfile, result, setResult, isAnalyzing, setIsAnalyzing }}>
            {children}
        </AssessmentContext.Provider>
    );
}

/**
 * 自定义 Hook：读取全局 Assessment 状态
 * @returns AssessmentContextType
 */
export function useAssessment() {
    return useContext(AssessmentContext);
}
