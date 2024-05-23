// Vanilla JS Without React
/*
const div_app = document.getElementById('app-root');
const header = document.createElement('h1');
const text = "Next JS Tutorial - 1";
const headerContent = document.createTextNode(text);
header.appendChild(headerContent);
div_app.appendChild(header);
*/

// With React

import React from 'react';
import ReactDOM from 'react-dom';
import Button from './click-button';

function createTitle(title) {
    return title ? title : "Default Title";
}

// function Header(props) {
function Header({ title }) {
    return (
        <h1>
            {/* {props.title} */}
            {/* {`Title: ${title}`} */}
            {/* {title} */}
            {createTitle(title)}
        </h1>
    )
}

function ItemList({ items }) {
    return (
        <ul>
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    )
}

export default function HomePage() {
    const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

    const buttons = [
        { label: "Button 1", id: 1 },
        { label: "Button 2", id: 2 },
        { label: "Button 3", id: 3 }
    ]

    return (
        <div>
            <Header />
            <Header title="Master Next.js - Essentials!" />
            <ItemList items={names} />
            {buttons.map((button) => (
                <Button key={button.id} label={button.label} />
            ))}
        </div>
    )
}
