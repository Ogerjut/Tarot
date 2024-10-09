import { io } from "socket.io-client"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Lobby from "./components/Lobby"
import Table from "./components/Table";
import Yams from "./components/Yams";

export const socket = io('http://localhost:3000')

export default function App() {

  return (
    <>
    <header className="text-3xl font-bold underline text-center"> Jeu de tarot multijoueurs</header>
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/table/:tableId" element={<Table />} />
      </Routes>
    </Router>
    {/* <header className="text-3xl font-bold underline text-center"> YAM'S</header>
    <Yams /> */}

    </>
  )
}

