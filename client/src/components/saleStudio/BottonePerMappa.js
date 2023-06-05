import React, { useEffect, useState } from 'react';

const BottonePerMappa = (address) => {

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
        handleConvertClick();
    }, [address]);



    const handleConvertClick = () => {

        if (address) {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            address.address
        )}&format=json&limit=1&addressdetails=1`;
    
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    setLatitude(lat);
                    setLongitude(lon);
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
        }
    };



    const handleMapRedirect = () => {
        if (latitude && longitude) {
            const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
            window.open(mapsUrl, '_blank'); 
        } else {
            alert('Indirizzo non trovato');
        }
    };
    
    return (
        <button
            className="bottone-mappa"
            onClick={() => {
                handleMapRedirect()          
        }}>
            Visualizza sulla mappa
        </button>
    );
};

export default BottonePerMappa;