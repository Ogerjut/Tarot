import { useState, useEffect } from "react";
import { socket } from "../App";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
  const navigate = useNavigate();
  const [nbPlayers, setNbPlayers] = useState(0);
  // const [Tables, setTables] = useState([])
  
  useEffect(() => {
    if (nbPlayers === 4 || nbPlayers === 5) {
      socket.emit("selectedTable", nbPlayers);
    }
  }, [nbPlayers]);

  useEffect(() => {
    // Rejoindre une table existante
    socket.on("joinTable", ({tableId}) => {
      navigate(`/table/${tableId}`); // Rediriger vers la table
      socket.emit("joinTable", {tableId});
      console.log(socket.id, "a rejoint la table :", tableId);
      
    });
    return () => {
      socket.off("joinTable");
    };
  }, [navigate]);

  return (

    <div className=" border-4 m-8 p-2 mx-96 h-40 text-xl rounded-lg text-center ">
      <h2 className="m-2">Choisis une table</h2>
      <button className="btn btn-lg mx-4 m-2" onClick={() => setNbPlayers(4)}>4 joueurs</button>
      <button className="btn btn-lg mx-4 m-2" onClick={() => setNbPlayers(5)}>5 joueurs</button>
    </div>
    
  );
}

