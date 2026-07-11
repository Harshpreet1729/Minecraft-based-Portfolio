import { Navigate, Route, Routes } from "react-router-dom";
import { PageShell } from "./components/PageShell";
import { About } from "./pages/About";
import { Achievements } from "./pages/Achievements";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { Journey } from "./pages/Journey";
import { NotFound } from "./pages/NotFound";
import { Projects } from "./pages/Projects";
import { Resume } from "./pages/Resume";
import { Skills } from "./pages/Skills";

export default function App() {
  return (
    <Routes>
      <Route element={<PageShell />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="skills" element={<Skills />} />
        <Route path="journey" element={<Journey />} />
        <Route path="resume" element={<Resume />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="contact" element={<Contact />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
