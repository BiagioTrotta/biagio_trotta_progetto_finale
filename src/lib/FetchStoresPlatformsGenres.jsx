// Fetch per le liste Platforms, Stores and Genres
async function FetchStoresPlatformsGenres(endpoint, setState) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}?key=${import.meta.env.VITE_API_KEY}`);

        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.statusText}`);
        }

        const data = await response.json();

        // Aggiorniamo lo stato con i risultati ricevuti
        setState(data.results);
    } catch (error) {
        console.error(`Errore durante il fetch per ${endpoint}:`, error);
    }
}

export default FetchStoresPlatformsGenres;
