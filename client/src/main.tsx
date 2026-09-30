import { createRoot } from "react-dom/client";
import "./lib/design"; // a data-design attribútum már az első festés előtt legyen kint
import App from "./App";
// Betűtípusok saját tárhelyről (nincs Google Fonts kérés → gyorsabb, GDPR-barát).
// Latin + közép-európai (ő, ű) karakterkészlet; a böngésző csak a ténylegesen használtat tölti le.
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-ext-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-ext-500.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-ext-400-italic.css";
import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-ext-300.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-ext-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-ext-500.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
