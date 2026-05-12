import { Link } from "react-router-dom";

function CultureCard({ name }) {
  return (
    <Link to={`/culture/${name}`}>
      <div className="card">
        <h2>{name}</h2>
      </div>
    </Link>
  );
}

export default CultureCard;