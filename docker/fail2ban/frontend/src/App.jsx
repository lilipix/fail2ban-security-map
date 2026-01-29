import useBans from "../hooks/useBans";
import "./App.css";
import MapView from "./components/MapView";

function App() {
  const { bans, loading, error } = useBans();

  if (loading) return <p>Chargement des données…</p>;
  if (error) return <p>Erreur de chargement</p>;

  return (
    <>
      <div className="app">
        <h1>Fail2Ban Security App</h1>
        <MapView bans={bans} />
      </div>
    </>
  );
}

export default App;
