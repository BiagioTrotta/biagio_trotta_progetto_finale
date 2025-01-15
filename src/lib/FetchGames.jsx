async function FetchGames(setGames, page) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}games?key=${import.meta.env.VITE_API_KEY}&page_size=40&page=${page}`);

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.statusText}`);
        }

        const data = await response.json();
        const games = data.results;

        // Aggiorniamo i giochi concatenando quelli esistenti con i nuovi
        setGames((prevGames) => [...prevGames, ...games]);
    } catch (error) {
        console.error("Errore durante il fetch dei giochi:", error);
    }
}

export default FetchGames;
