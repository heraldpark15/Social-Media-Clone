import { Navigate, Route, Routes } from "react-router";
import HomePage from "./Pages/Homepage/HomePage";
import AuthPage from "./Pages/HomePage/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import { Toaster } from "./components/Misc/toaster.jsx"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";

function App() {
  const [authUser] = useAuthState(auth)
  return (
    <>
    <PageLayout>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/auth"/>} />
        <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to="/"/>} />
        <Route path='/:username' element={<ProfilePage />} />
      </Routes>
    </PageLayout>
    <Toaster />
    </>
  );
}

export default App;