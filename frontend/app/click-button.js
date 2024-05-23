'use client';

import { useState, useEffect, useRef } from 'react';

export default function Button({ label }) {
    const [clicks, setClicks] = useState(0);

    function handleClick() {
        setClicks(prevClicks => prevClicks + 1);
    }

    const firstMount = useRef(true);

    useEffect(() => {
        if (firstMount.current) {
            firstMount.current = false;
            return;
        }
        else {
            console.log(`Click count for ${label} is now ${clicks}`);
        }
    }, [clicks]); // This effect runs only when `clicks` changes.

    return (
        <button onClick={handleClick}>
            {label}
        </button>
    );
}
