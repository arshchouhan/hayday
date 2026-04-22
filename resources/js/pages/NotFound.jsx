import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section>
            <p>404</p>
            <h1>Page not found</h1>
            <p>The route you requested does not exist in the React application.</p>
            <Link to="/">Go home</Link>
        </section>
    );
}