import CultureCard from "../components/CultureCard";

const countries = [
  "Japan",
  "India",
  "France",
  "Kenya"
];

function Home() {
  return (
    <div className="home">
      <h1>Culture Explorer</h1>

      <div className="cards">
        {countries.map((country, index) => (
          <CultureCard
            key={index}
            name={country}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;