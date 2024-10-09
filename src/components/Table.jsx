
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../App";
import Bet from "./Bet";

export default function Table(){
    const [players, setPlayers] = useState([])
    const [Hand, setHand] = useState([])
    const [GameStarted, setGameStarted] = useState(false)
    const {tableId} = useParams()

    const navigate = useNavigate();
    

    useEffect(() => {

        // Écouter l'événement pour mettre à jour la liste des joueurs
        socket.on('updatePlayers', ({players}) => {
            setPlayers(players);
            console.log("joueurs // update : ", players)
        });

            // Démarrage de la partie lorsqu'une table est complète
        socket.on("startGame", ({ tableId, players }) => {
            setPlayers(players)
            setGameStarted(true)
            console.log("la table est pleine, la partie peut commencer", tableId)
            console.log("joueurs : ", players)
        
      });
        socket.on("dealtCards", ({tableId})=>{
            socket.emit('hand', {tableId}, (response)=>{
                console.log("cartes récupérées")
                setHand(response.hand) 
            })
        })

        socket.on("startBet", ({tableId, players})=>{
            // affiche le component enchère et prépare les enchères, 
            console.log("enchères")
            // rep serveur : Le client reçoit un message à son tour + chrono 30s 
            // et les aytres message en attente (broadcast+socket)
        })

    // Nettoyage lors du démontage du composant
    return () => {
        socket.off('updatePlayers');
        socket.off("startGame");
        socket.off("dealtCards")
        socket.off("startBet")
      
    };
    }, [navigate, tableId]);
    
    // après 30s functin disponible
    const handleClick = () => {
        socket.emit('leaveTable', {tableId})
        navigate('/')
        console.log("table quittée", tableId)
    }

    return (
        <div className="text-center">
            <hr className="mt-4"/>
            <h1 className="p-4"> Table de jeu : {tableId} </h1>
            <hr className="mb-4" />

            <TableArea players={players} GameStarted={GameStarted}/>

            {!GameStarted ?( <WaitingRoom onClick={handleClick}/>) : (<PlayerHand hand={Hand}/>) }
           
        </div>
    )
}

function WaitingRoom ({onClick}) {
    return (
        <div className="border-2 ">
            <p> En attente de joueurs... </p> 
            <button className="btn" onClick={onClick}> Retour au lobby</button>
        </div>
    )
}

function TableArea({ players, GameStarted }) {
    const positions = ['top-0 left-1/2 transform -translate-x-1/2', 'top-1/2 right-0 transform -translate-y-1/2', 'bottom-0 left-1/2 transform -translate-x-1/2', 'top-1/2 left-0 transform -translate-y-1/2'];
    return (
        <div className="relative m-2 mx-48 text-center border-8 border-amber-800 rounded-full bg-green-600 h-64">
            {
                players &&
                players.map((player, index)=>(
                    <PlayerArea playername={player.name} positionClass={positions[index % positions.length]}/>
                ))
            }
             <div className="m-10 text-center items-center">
                 {GameStarted && <Bet/>}
             </div>
            
        </div>
    );
}


function PlayerArea({ playername, positionClass }) {
    return (
        <div className={`absolute ${positionClass} w-20 h-10 bg-white border-2 border-black  flex items-center justify-center`}>
            <p>{playername}</p>
        </div>
    );
}


function PlayerHand ({hand}) {
    return (
        <div>
            <h1> cartes client</h1>
            <div className="flex m-2 border-4 justify-center ">
                {hand &&
                hand.map((card)=>(
                    <Card value={card.value} color={card.color} />
                ))
                }
            </div>
        </div>
    )
}

function Card({ value, color }) {
    const isRed = color === 'Coeur' || color === 'Carreau';
    const isAtout = color === 'Atout';
  
    return (
      <div className="h-36 w-24 border border-black flex  justify-center">
        <button className="btn w-full h-full">
          <p className={"h-full w-full text-xl flex flex-col justify-center" + (isRed ? " text-red-700" : isAtout ? " text-blue-700" : "")}>
            {value}<br />{color}
          </p>
        </button>
      </div>
    );
  }
