import { Route, Routes } from "react-router"
import Header from "./components/Header/Header"
import Home from "./Page/Home/Home"
import RegisterCompany from "./Page/Company/RegisterCompany"
import LoginPage from "./Page/Auth/LoginPage"
import RegisterPage from "./Page/Auth/RegisterPage"
import useAuthEffect from "./components/useAuthEffect"
import PrivateRoute from "./components/PrivateRoute"
import GetAllCompany from "./Page/Company/GetAllCompany"
import GetCompanyidDetails from "./Page/Company/GetCompanyidDetails"
import ViewById from "./Page/Amount/ViewById"

const App = () => {
  useAuthEffect();
  return (
    <div className="max-w-6xl mx-auto px-2">
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="" element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/company-register" element={<RegisterCompany />} />
          <Route path="/get-company" element={<GetAllCompany />} />
          <Route path="/get-company/:id" element={<GetCompanyidDetails />} />
          <Route path="/get-payment/:id" element={<ViewById />} />
        </Route>
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>

    </div>
  )
}

export default App