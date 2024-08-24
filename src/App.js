import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login/Login";
import Signin from "./components/Signin/Signin";
import Redirecturl from "./components/Redirecturl/Redirecturl";
import Access from "./components/Access/Access";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/redirecturl" element={<Redirecturl />} />
          <Route path="/access" element={<Access />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
