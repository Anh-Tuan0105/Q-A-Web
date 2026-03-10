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
import { Toaster } from 'sonner'
import { useAuthStore } from './stores/useAuthStore'
import { useSocketStore } from './stores/useSocketStore'


function App() {
  const { accessToken, user, refresh, fetchMe } = useAuthStore();
  const { connect, disconnect } = useSocketStore();

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
