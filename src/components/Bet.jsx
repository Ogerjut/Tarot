import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { socket } from "../App"

let bets = ["Passer", "Prise", "Garde", "Garde Sans", "Garde Contre"]



export default function Bet () {
    const [SetBet, setSetBet] = useState("")
    const {tableId} = useParams()

    // appel serveur pour donner info bet actuelle, et envoyer maj client
    // passer ou miser et passer au joueur suivant
    // bouton désactiver si pas le tour
    useEffect(() => {
      socket.emit('bet', {SetBet}, (response) => {
        console.log("mise reçue", response.message)
      })
    
      return () => {
        socket.off('bet')
      }
    }, [SetBet])
    

    return (

        <div className="border-gray-700 border m-12 p-2">
            <span>Enchères : </span>
            {bets.map((bet)=>(
                <BtnBet onClick={()=> setSetBet(bet)} bet={bet}/>
            ))}
            <br/>
            <span> Mise actuelle : {SetBet} </span>
        </div>
    )
}

function BtnBet(props){

    return (
        <button className="btn m-2 btn-primary" onClick={props.onClick}>{props.bet}</button>
    )
}