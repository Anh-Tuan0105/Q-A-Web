import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import SignUpPages from './pages/auth/SignUpPages'
import SignInPages from './pages/auth/SignInPages'
import ForgotPasswordPages from './pages/auth/ForgotPasswordPages'
import Home from './pages/home/Home'
import QuestionDetail from './pages/question/QuestionDetail'
import CreateQuestion from './pages/question/CreateQuestion'
import Questions from './pages/questions/Questions'
import Profile from './pages/profile/Profile'
import UserQuestions from './pages/profile/UserQuestions'
import UserAnswers from './pages/profile/UserAnswers'
import SettingProfile from './pages/profile/SettingProfile'
import Security from './pages/securities/Security'
import EmailChange from './pages/securities/emailchange'
import EmailAuth from './pages/securities/EmailAuth'
import TagsPages from './pages/tags/TagsPages'
import MemberList from './pages/member/memberlist'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import DetailQuestions from './pages/admin/DetailQuestions'
import AdminTagManagement from './pages/admin/AdminTagManagement'
import AdminSettings from './pages/admin/AdminSettings'
import AdminMembers from './pages/admin/AdminMembers'
import AdminLogin from './pages/admin/AdminLogin'
import { Toaster, toast } from 'sonner'
import { useAuthStore } from './stores/useAuthStore'
import { useSocketStore } from './stores/useSocketStore'
import { useThemeStore } from './stores/useThemeStore'
import { useAdminSettingsStore } from './stores/useAdminSettingsStore'


import AdminProtectedRoute from './components/auth/AdminProtectedRoute'
import NotFoundImage from './assets/404.svg'

function App() {
  const { accessToken, user, refresh, fetchMe } = useAuthStore();
  const { connect, disconnect, socket } = useSocketStore();
  const { theme, loadUserTheme, setTheme } = useThemeStore();
  const { siteName, systemEmail, metaDescription, faviconUrl, maintenanceMode, applySettings } = useAdminSettingsStore();

  useEffect(() => {
    if (user?._id) {
      loadUserTheme(user._id);
    } else {
      setTheme("light");
    }
  }, [user?._id, loadUserTheme, setTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const fetchLatestSettings = async () => {
      await useAdminSettingsStore.getState().fetchSettings();
    };
    fetchLatestSettings();
  }, []);

  useEffect(() => {
    applySettings();
  }, [siteName, systemEmail, metaDescription, faviconUrl, maintenanceMode, applySettings]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!accessToken) {
          await refresh();
        }
        if (accessToken && !user) {
          await fetchMe();
        }
      } catch (error) {
        console.log(error);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [accessToken]);

  // Lắng nghe sự kiện bị cấm realtime
  useEffect(() => {
    const handleBanned = () => {
      toast.error("Tài khoản của bạn đã bị cấm khỏi hệ thống!", {
        description: "Vui lòng liên hệ quản trị viên để biết thêm chi tiết.",
        duration: 5000,
      });
      setTimeout(async () => {
        await useAuthStore.getState().logout();
        window.location.href = '/signin';
      }, 2000);
    };

    if (socket && accessToken) {
      socket.on("user_banned", handleBanned);
    }

    return () => {
      if (socket) {
        socket.off("user_banned", handleBanned);
      }
    };
  }, [accessToken, socket]);

  // Lắng nghe sự kiện bảo trì realtime
  useEffect(() => {
    const handleMaintenance = (status: boolean) => {
      useAdminSettingsStore.getState().setSettings({ maintenanceMode: status });
    };

    if (socket) {
      socket.on("maintenance_mode_changed", handleMaintenance);
    }

    return () => {
      if (socket) {
        socket.off("maintenance_mode_changed", handleMaintenance);
      }
    };
  }, [socket]);

  const pathname = window.location.pathname;
  const isAdminPath = pathname.startsWith('/admin');
  const shouldShowMaintenance = maintenanceMode && !isAdminPath && user?.role !== 'admin';

  if (shouldShowMaintenance) {
    return (
      <>
        <Toaster richColors />
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <img 
              src={NotFoundImage} 
              alt="System Maintenance" 
              className="w-full max-w-[400px] mx-auto drop-shadow-2xl" 
            />
            
            <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-white/50 space-y-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {siteName}
                    <span className="block text-[#137FEC] mt-2">Đang Được Bảo Trì! 🛠️</span>
                </h1>
                <p className="text-slate-600 text-[15px] md:text-base max-w-lg mx-auto leading-relaxed">
                    Hệ thống của chúng tôi hiện đang tạm thời bảo trì để nâng cấp và tối ưu hóa. Mọi dữ liệu của bạn đều an toàn tuyệt đối. Xin lỗi vì sự bất tiện này, vui lòng quay lại sau ít phút!
                </p>
                <div className="pt-4">
                  <button onClick={() => window.location.reload()} className="cursor-pointer px-8 py-3.5 bg-linear-to-r from-[#137FEC] to-blue-600 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
                      Thử tải lại trang
                  </button>
                </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          {/* Public Route */}
          <Route
            path='/signup'
            element={<SignUpPages />}
          />
          <Route
            path='/signin'
            element={<SignInPages />}
          />
          <Route
            path='/forgot-password'
            element={<ForgotPasswordPages />}
          />
          <Route
            path='/home'
            element={<Home />}
          />
          <Route
            path='/questions'
            element={<Questions />}
          />
          <Route
            path='/questions/:id'
            element={<QuestionDetail />}
          />
          <Route
            path='/ask'
            element={<CreateQuestion />}
          />
          <Route
            path='/profile'
            element={<Profile />}
          />
          <Route
            path='/profile/:id'
            element={<Profile />}
          />
          <Route path='/profile/:id/questions' element={<UserQuestions />} />
          <Route path='/profile/:id/answers' element={<UserAnswers />} />
          <Route
            path='/settings/profile'
            element={<SettingProfile />}
          />
          <Route
            path='/security'
            element={<Security />}
          />
          <Route
            path='/security/email-change'
            element={<EmailChange />}
          />
          <Route
            path='/security/email-auth'
            element={<EmailAuth />}
          />
          <Route
            path='/tags'
            element={<TagsPages />}
          />
          <Route
            path='/members'
            element={<MemberList />}
          />

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes - Protected (Admin Only) */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="posts" replace />} />
              <Route path="posts" element={<AdminDashboard />} />
              <Route path="posts/:id" element={<DetailQuestions />} />
              {/* <Route path="reports" element={<AdminReports />} /> */}
              <Route path="tags" element={<AdminTagManagement />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="members" element={<AdminMembers />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
