import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import SignUpPages from "./pages/auth/SignUpPages";
import SignInPages from "./pages/auth/SignInPages";
import UserPages from "./pages/users/UserPages";
import MemberList from "./pages/member/memberlist";
import { Toaster } from "sonner";
import { useAuthStore } from "./stores/useAuthStore";

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
          {/* Public Route */}
          <Route path="/signup" element={<SignUpPages />} />
          <Route path="/signin" element={<SignInPages />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/" element={<UserPages />} />
          {/* Private Route example - Keep ProtectedRoute for future private pages */}
          {/* <Route element={<ProtectedRoute />}>
          </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
