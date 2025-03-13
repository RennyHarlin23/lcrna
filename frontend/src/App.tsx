

import { Routes, Route } from "react-router-dom"
import NcRNASearch from "./pages/SearchPage"
import DetailsPage from "./pages/DetailsPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<NcRNASearch />} />
      <Route path="/details/:id" element={<DetailsPage />} />
    </Routes>
  )
}

