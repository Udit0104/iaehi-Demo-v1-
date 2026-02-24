import EnterPage from "./Components/EnterPage";
import QuestionPage from "./Components/QuestionPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./Components/Users";
import Style from "./App.module.css";
import Result from "./Components/Result";
import Chart from "./Components/Chart";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer"
import DetailedSummary from "./Components/SummaryReport/DetailedSummary";
import MaybeNextTime from "./Components/MaybeNextTime";
import { useState } from "react";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  const [navBarMsg, setNavBarMsg] = useState(true);
  const [userData, setUserData] = useState({});
  return (
    <LanguageProvider>
      <div className={Style.container}>
        <Router>
          <NavBar msg={navBarMsg} />
          <Routes>
            <Route
              path="/"
              element={
                <EnterPage setUserData={setUserData} setMsg={setNavBarMsg} />
              }
            />
            <Route path="/userinfo" element={<Users />} />
            <Route
              path="/question"
              element={
                <QuestionPage userData={userData} setMsg={setNavBarMsg} />
              }
            />
            <Route path="/result" element={<Result setMsg={setNavBarMsg} />} />
            <Route path="/chart" element={<Chart setMsg={setNavBarMsg} />} />
            <Route path="/nexttime" element={<MaybeNextTime />} />
            <Route path="/detailed-summary" element={<DetailedSummary />} />
          </Routes>
        </Router>
        {/* <div className={Style.copyrightText}>
          Copyright © 2025 IaeHi Technology - All Rights Reserved.
        </div> */}
        <Footer/>
      </div>
    </LanguageProvider>
  );
}

export default App;
