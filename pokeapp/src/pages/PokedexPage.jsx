import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPokemon, getSpecies } from '../services/pokeapi';

function PokeDex() {
    const [loading, setLoading] = useState(true);
    const [pokemon, setPokemon] = useState(null);
    const [species, setSpecies] = useState(null);

  const { id } = useParams();
 // const navigate = useNavigate();
  // Efecto para cargar pokemons
  useEffect(() => {
    if (id){
        infoPokemon();
    }
  }, [id]);

  const infoPokemon = async () => {
    setLoading(true);
    try {
      const pokemonData = await getPokemon(id);
      const speciesData = await getSpecies(id);
      setPokemon(pokemonData);
      setSpecies(speciesData);
    } catch (error) {
      console.error('Error loading pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Pokemon #{id}</h1>
      <h1 className="text-3xl font-bold text-center mb-8">{pokemon.name}</h1>

      <div className="text-center">
        <Link to="/pokegrid" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Back to Grid
        </Link>
      </div>
    </div>
  );
}

export default PokeDex;