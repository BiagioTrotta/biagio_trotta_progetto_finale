import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FetchStoresPlatformsGenres from '../lib/FetchStoresPlatformsGenres';
import GamesList from '../components/GamesList';

const Store = () => {
    const { storeId } = useParams();
    const [storeName, setStoreName] = useState('');
    const [stores, setStores] = useState([]);

    useEffect(() => {
        FetchStoresPlatformsGenres('stores', setStores);
    }, []);

    useEffect(() => {
        if (stores.length > 0 && storeId) {
            const store = stores.find((s) => s.id === parseInt(storeId));
            setStoreName(store ? store.name : 'Store non trovato');
        }
    }, [stores, storeId]);

    return <GamesList type="stores" id={storeId} title={`Giochi per ${storeName}`} />;
};

export default Store;
