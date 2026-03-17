import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import SignUpPages from './pages/auth/SignUpPages'
import SignInPages from './pages/auth/SignInPages'
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

function App() {
  const { accessToken, user, refresh, fetchMe } = useAuthStore();
  const { connect, disconnect } = useSocketStore();
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
    if (accessToken) {
      connect();
    }
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

    if (accessToken) {
      useSocketStore.getState().on("user_banned", handleBanned);
    }

    return () => {
      useSocketStore.getState().off("user_banned", handleBanned);
    };
  }, [accessToken]);

  const pathname = window.location.pathname;
  const isAdminPath = pathname.startsWith('/admin');
  const shouldShowMaintenance = maintenanceMode && !isAdminPath && user?.role !== 'admin';

  if (shouldShowMaintenance) {
    return (
      <>
        <Toaster richColors />
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
          <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-6 text-3xl font-black">
              !
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">{siteName} đang bảo trì</h1>
            <p className="text-slate-500 leading-relaxed">
              Hệ thống đang tạm thời ngừng phục vụ để nâng cấp. Vui lòng quay lại sau.
            </p>
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
