import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FetchStoresPlatformsGenres from '../lib/FetchStoresPlatformsGenres';
import GamesList from '../components/GamesList';

const Genre = () => {
    const { genreId } = useParams();
    const [genreName, setGenreName] = useState('');
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        FetchStoresPlatformsGenres('genres', setGenres);
    }, []);

    useEffect(() => {
        if (genres.length > 0 && genreId) {
            const genre = genres.find((g) => g.id === parseInt(genreId));
            setGenreName(genre ? genre.name : 'Genere non trovato');
        }
    }, [genres, genreId]);

    return <GamesList type="genres" id={genreId} title={`Giochi per ${genreName}`} />;
};

export default Genre;
