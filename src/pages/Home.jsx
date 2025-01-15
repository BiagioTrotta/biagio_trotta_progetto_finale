import { useState, useEffect, useRef } from 'react';
import FetchGames from '../lib/FetchGames';
import CardCustom from '../components/CardCustom';
import SpinnerCustom from '../components/SpinnerCustom';

function Home() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1); // Stato per la pagina
    const observer = useRef();

    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [
        "https://res.cloudinary.com/doyfjbmhk/image/upload/v1735393175/carousel_1_qko1ym.png",
        "https://res.cloudinary.com/doyfjbmhk/image/upload/v1735393175/carousel_2_pscxip.png",
        "https://res.cloudinary.com/doyfjbmhk/image/upload/v1735393176/carousel_3_eraytp.png",
    ];

    useEffect(() => {
        // Carica i giochi ogni volta che cambia la pagina
        setLoading(true); // Mostra lo spinner prima del fetch
        FetchGames(setGames, page)
            .finally(() => setLoading(false)); // Nasconde lo spinner dopo il fetch
    }, [page]);

    useEffect(() => {
        // Avvia il timer per il cambio automatico di slide
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }, 4000); // Cambio slide ogni 4 secondi

        return () => clearInterval(interval); // Pulisci il timer quando il componente si smonta
    }, [images.length]);

    // Funzione per gestire lo scroll infinito
    const lastGameElementRef = (node) => {
        if (loading) return;

        // Crea un osservatore per il caricamento quando l'utente arriva all'ultimo gioco
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1); // Aumenta la pagina quando l'utente raggiunge l'ultimo gioco
            }
        });

        if (node) observer.current.observe(node); // Osserva l'elemento
    };

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
    };

    return (
        <>
            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-4">
                {/* Carousel di 3 immagini */}
                <div className="relative mb-6">
                    <div className="flex overflow-hidden rounded-lg">
                        <div
                            className="transition-all duration-500 flex"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {images.map((image, index) => (
                                <div key={index} className="w-full flex-shrink-0">
                                    <img
                                        src={image}
                                        alt={`Carousel Image ${index + 1}`}
                                        className="w-full"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Controlli prev/next */}
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-md"
                    >
                        &#10094;
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-md"
                    >
                        &#10095;
                    </button>
                </div>

                {/* Spinner per il caricamento iniziale */}
                {loading && page === 1 ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <SpinnerCustom />
                    </div>
                ) : (
                    <>
                        {/* Lista dei giochi */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {games.map((game, index) => (
                                <div
                                    key={game.id}
                                    ref={games.length === index + 1 ? lastGameElementRef : null} // Impostiamo l'osservatore sull'ultimo gioco
                                >
                                    <CardCustom
                                        gameId={game.id}
                                        name={game.name}
                                        background_image={game.background_image}
                                        parent_platforms={game.parent_platforms}
                                        genres={game.genres}
                                        released={game.released}
                                        rating={game.rating}
                                        metacritic={game.metacritic}
                                        reviews_count={game.reviews_count}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Spinner per il caricamento delle pagine successive */}
                        {loading && page > 1 && (
                            <div className="flex items-center justify-center my-4">
                                <SpinnerCustom />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Home;
