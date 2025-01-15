import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

const GameImageEffect = ({ image, alt }) => (

    <LazyLoadImage
        className="w-full h-56 object-cover transition-opacity duration-500 ease-in-out"
        alt={alt}
        effect='opacity'
        wrapperProps={{
            style: {
                transitionDelay: "0.5s",
            },
        }}
        src={image}
        threshold={0.2} // Carica l'immagine poco prima che entri nella visuale
    />
);

export default GameImageEffect;