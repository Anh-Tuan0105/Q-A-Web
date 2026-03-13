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
import AdminSettings from './pages/admin/AdminSettings'
import AdminMembers from './pages/admin/AdminMembers'
import { Toaster } from 'sonner'
import { useAuthStore } from './stores/useAuthStore'
import { useSocketStore } from './stores/useSocketStore'
import { useThemeStore } from './stores/useThemeStore'


function App() {
  const { accessToken, user, refresh, fetchMe } = useAuthStore();
  const { connect, disconnect } = useSocketStore();
  const { theme, loadUserTheme, setTheme } = useThemeStore();

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
          {/* Private Route example - Keep ProtectedRoute for future private pages */}
          {/* <Route element={<ProtectedRoute />}>
          </Route> */}

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="settings" element={<AdminSettings />} />
            <Route path="members" element={<AdminMembers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
