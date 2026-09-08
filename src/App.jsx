import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Games from "./pages/Games";
import Arcade from "./pages/Arcade";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LegalPage from "./pages/LegalPage";
import ColorDrop from "./pages/ColorDrop";
import StackIt from "./StackIt";
import ButtonChaos from "./ButtonChaos";
import PerfectTap from "./PerfectTap";
import MemoryRush from "./MemoryRush";
import QuickSwitch from "./QuickSwitch";

function PlaceholderPage({ title }) {
  return (
    <main
      style={{
        minHeight: "80vh",
        display: "grid",
        placeItems: "center",
        padding: "120px 20px",
        color: "white",
      }}
    >
      <h1>{title}</h1>
    </main>
  );
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* GAMES */}
        <Route path="/games" element={<Games />} />

        {/* ARCADE */}
        <Route path="/arcade" element={<Arcade />} />

        {/* COLOR DROP */}
        <Route
          path="/arcade/color-drop"
          element={<ColorDrop />}
        />

        {/* STACK IT */}
        <Route
          path="/arcade/stack-it"
          element={<StackIt />}
        />

        {/* BUTTON CHAOS */}
        <Route
          path="/arcade/button-chaos"
          element={<ButtonChaos />}
        />

        <Route
  path="/arcade/quick-switch"
  element={<QuickSwitch />}
/>

        <Route
  path="/arcade/memory-rush"
  element={<MemoryRush />}
/>

        <Route
  path="/arcade/perfect-tap"
  element={<PerfectTap />}
/>

        {/* OTHER PAGES */}
        <Route path="/projects" element={<Projects />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route
  path="/privacy-policy"
  element={<LegalPage type="privacy" />}
/>

<Route
  path="/terms"
  element={<LegalPage type="terms" />}
/>

<Route
  path="/cookie-policy"
  element={<LegalPage type="cookies" />}
/>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
