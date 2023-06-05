import React from 'react';

const BottonePerMappa = (latitude, longitude) => {
    const handleMapRedirect = () => {
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`; // URL di Google Maps con le coordinate
        
        window.open(mapsUrl, '_blank'); // Apre il link in una nuova finestra o scheda del browser
    };
    
    return (
        <button className="bottone-mappa" onClick={handleMapRedirect}>
            Visualizza sulla mappa
        </button>
    );
};

export default BottonePerMappa;