import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPokemons } from '../services/pokeapi';


function PokeGrid() {
  // Estados necesarios
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();
  // Efecto para cargar pokemons
  useEffect(() => {
    loadPokemons();
  }, [page]);

  const loadPokemons = async () => {
    setLoading(true);
    try {
      const data = await getPokemons(page);
      setPokemons(data.results);
      setTotalPages(Math.ceil(data.count / 30));
    } catch (error) {
      console.error('Error loading pokemons:', error);
    } finally {
      setLoading(false);
    }
  };

  // Renderizado condicional
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Pokemon Grid</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {pokemons.map((pokemon, index) => (
          <button key={pokemon.name} className="bg-white rounded-lg shadow-md p-4" 
          onClick={() => navigate(`/pokedex/${(page-1)*30 + index + 1}`)}>
            <h3 className="text-lg font-semibold capitalize text-center">{pokemon.name}</h3> 
            {/*<h1 className="text-lg font-semibold capitalize text-center">{}</h1>*/}
            <img 
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${(page-1)*30 + index + 1}.png`}
              alt={pokemon.name}
              className="w-32 h-32 mx-auto"
            />      
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button 
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <button 
          onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      <div className="text-center">
        <Link to="/" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          Back to Landing
        </Link>
      </div>
    </div>
  );
}

export default PokeGrid;