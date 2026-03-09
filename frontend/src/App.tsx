import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import SignUpPages from './pages/auth/SignUpPages'
import SignInPages from './pages/auth/SignInPages'
import Home from './pages/home/Home'
import QuestionDetail from './pages/question/QuestionDetail'
import CreateQuestion from './pages/question/CreateQuestion'
import { Toaster } from 'sonner'
import { useAuthStore } from './stores/useAuthStore'

function App() {
  const { accessToken, user, refresh, fetchMe } = useAuthStore();

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
            path='/questions/:id'
            element={<QuestionDetail />}
          />
          <Route
            path='/ask'
            element={<CreateQuestion />}
          />
          {/* Private Route example - Keep ProtectedRoute for future private pages */}
          {/* <Route element={<ProtectedRoute />}>
          </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
