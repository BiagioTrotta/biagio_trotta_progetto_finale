// Funzione per ottenere i dettagli di un singolo gioco
async function FetchGameDetail(setGameData, id) {
    const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${import.meta.env.VITE_API_KEY}`);
    const gameData = await response.json();

    setGameData(gameData); // Memorizza i dettagli del gioco
}

export default FetchGameDetail;
