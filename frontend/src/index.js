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

function Button({ label }) {
    const [clicks, setClicks] = React.useState(0);

    function handleClick(label) {
        setClicks(prevClicks => prevClicks + 1);
    }

    React.useEffect(() => {
        console.log(`Click count for ${label} is now ${clicks}`);
    }, [clicks]); // This effect runs only when `clicks` changes.

    return (
        <button onClick={handleClick}>
            {label}
        </button>
    );
}



function HomePage() {
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

const div_app = document.getElementById('app-root');
const root = ReactDOM.createRoot(div_app);
root.render(<HomePage />);
