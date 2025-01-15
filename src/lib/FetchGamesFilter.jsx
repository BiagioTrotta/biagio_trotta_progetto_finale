// Fetch dei giochi con query generica per piattaforma, store o genere
async function FetchGamesFilter(setGames, filterType, filterId, page) {
    try {
        // Imposta il parametro della query in base al tipo di filtro (platforms, stores, genres)
        const queryParam =
            filterType === 'platforms' ? 'platforms' :
                filterType === 'stores' ? 'stores' :
                    filterType === 'genres' ? 'genres' : null;

        // Se il filtro non è valido, restituire un errore
        if (!queryParam) {
            throw new Error("Tipo di filtro non valido. Usa 'platforms', 'stores' o 'genres'.");
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}games?key=${import.meta.env.VITE_API_KEY}&${queryParam}=${filterId}&page_size=40&page=${page}`
        );

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.statusText}`);
        }

        const data = await response.json();
        const games = data.results;

        // I giochi sono già filtrati dal server
        setGames((prevGames) => [...prevGames, ...games]);

    } catch (error) {
        console.error("Errore durante il fetch dei giochi:", error);
    }
}

export default FetchGamesFilter;
