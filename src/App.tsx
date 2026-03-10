import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AssessmentProvider } from './context/AssessmentContext';
import Landing from './pages/Landing/Landing';
import Assessment from './pages/Assessment/Assessment';
import Result from './pages/Result/Result';
import './index.css';

/**
 * 根组件：配置全局主题、路由、状态
 */
function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#58a6ff',
          colorBgBase: '#0a0e1a',
          colorBgContainer: 'rgba(22, 29, 48, 0.8)',
          colorBgElevated: '#1a2035',
          borderRadius: 10,
          fontFamily: "'Inter', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif",
          colorText: 'rgba(255, 255, 255, 0.9)',
          colorTextSecondary: 'rgba(255, 255, 255, 0.6)',
          colorBorder: 'rgba(88, 166, 255, 0.2)',
        },
      }}
    >
      <AssessmentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </BrowserRouter>
      </AssessmentProvider>
    </ConfigProvider>
  );
}

export default App;
