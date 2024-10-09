import { useState } from "react"

export default function Yams() {
    const [NbDice, setNbDice] = useState(5)        // Nombre de dés à lancer
    const [Dices, setDices] = useState([])         // Dés courants
    const [Launched, setLaunched] = useState(false)  // État de lancement
    const [LogLaunch, setLogLaunch] = useState([])    // Historique des lancés par tour
    const [currentTurn, setCurrentTurn] = useState(0)  // Numéro du tour actuel

    // Fonction pour lancer les dés
    const launchdice = () => {
        let newDices = []  // Crée un nouveau tableau pour les nouveaux dés
        for (let i = 0; i < NbDice; i++) {
            const value = getRandomIntInclusive(1, 6)
            newDices.push(value)  // Ajoute chaque valeur de dé dans le tableau
        }

        setDices(newDices)  // Met à jour l'état des dés lancés
        setLaunched(true)   // Indique que les dés ont été lancés

        // Ajoute le jet actuel dans le log pour le tour en cours
        setLogLaunch(prevLogs => {
            const updatedLogs = [...prevLogs]  // Copie des logs actuels
            if (!updatedLogs[currentTurn]) {
                updatedLogs[currentTurn] = []  // Initialise le tour si absent
            }
            updatedLogs[currentTurn].push(newDices)  // Ajoute le jet au tour courant
            return updatedLogs
        })
    }

    // Fonction pour terminer le tour
    const endturn = () => {
        setNbDice(5)             // Réinitialise le nombre de dés à 5
        setDices([])             // Réinitialise les dés lancés
        setLaunched(false)       // Réinitialise l'état de lancement
        setCurrentTurn(currentTurn + 1)  // Passe au tour suivant
    }

    return (
        <div className="border m-2 ">
            <div className="m-8 border-4 flex items-center justify-center">
                {Dices.map((value, index) => (
                    <Dice key={index} value={Launched ? value : "?"} />
                ))}
                <div className="m-4 flex-col border w-4/12 text-center">
                    <button className='btn-circle btn-wide border m-6 mx-10 bg-orange-400' onClick={launchdice}>
                        Lancer les dés
                    </button>
                    {Launched && (
                        <button className='btn-circle btn-wide bg-lime-600 border m-2 mx-10' onClick={endturn}>
                            Fin du tour
                        </button>
                    )}
                </div>
                {Launched && <DiceSelection NbDice={NbDice} setNbDice={setNbDice} />}
            </div>

            <div className="border text-center">
                <p>Log des lancés :</p>

                {/* Affichage du tableau de logs */}
                <table className="table-auto border-collapse border border-slate-500 w-full">
                    <thead>
                        <tr>
                            {/* Affiche les colonnes correspondant aux tours */}
                            {LogLaunch.map((_, index) => (
                                <th key={index} className="border border-slate-600 p-2">Tour {index + 1}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Détermine le nombre de lignes basé sur le nombre maximum de jets dans un tour */}
                        {Array.from({ length: Math.max(...LogLaunch.map(tour => tour.length), 0) }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {/* Affiche les jets pour chaque tour */}
                                {LogLaunch.map((tour, colIndex) => (
                                    <td key={colIndex} className="border border-slate-600 p-2 text-center">
                                        {/* Affiche les dés lancés pour ce jet, sinon vide */}
                                        {tour[rowIndex] ? tour[rowIndex].join(", ") : ""}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function Dice({ value }) {
    return (
        <div className="m-1 py-3 text-center border-gray-700 border w-16 h-16 text-2xl ">
            {value}
        </div>
    )
}

function DiceSelection({ NbDice, setNbDice }) {
    const increaseDices = () => {
        if (NbDice < 5) {
            setNbDice(NbDice + 1)
        }
    }

    const decreaseDices = () => {
        if (NbDice > 1) {
            setNbDice(NbDice - 1)
        }
    }

    return (
        <div className="m-1 text-center ">
            <p> Choisir nombre de dés à relancer :</p>
            <button className="btn btn-md text-2xl m-1" onClick={increaseDices}> + </button>
            <span className="m-2 text-2xl">{NbDice}</span>
            <button className="btn btn-md m-1 text-2xl" onClick={decreaseDices}> - </button>
        </div>
    )
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
