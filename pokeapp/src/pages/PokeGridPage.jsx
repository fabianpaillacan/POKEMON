import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemons } from '../services/pokeapi';
import { Heart, Search, ArrowBigRightDash, ArrowBigLeftDash} from 'lucide-react';

function PokeGrid() {
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    loadPokemons();
  }, [page]);

  const loadPokemons = async () => {
    setLoading(true);
    try {
      const data = await getPokemons(page);
      const pokemonsWithId = data.results.map((pokemon, index) => ({
        ...pokemon,
        id: (page - 1) * 30 + index + 1
      }));
      setPokemons(pokemonsWithId);
      setTotalPages(Math.ceil(data.count / 30));
    } catch (error) {
      console.error('Error loading pokemons:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPokemonId = (pokemon) => {
    return pokemon.id || pokemon.url.split('/').slice(-2, -1)[0];
  };

  const filteredPokemons = pokemons.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorites = showOnlyFavorites ? favorites.includes(getPokemonId(pokemon)) : true;
    return matchesSearch && matchesFavorites;
  });

  const toggleFavorite = (pokemonId) => {
    setFavorites(prev => {
      if (prev.includes(pokemonId)) {
        return prev.filter(id => id !== pokemonId);
      } else {
        return [...prev, pokemonId];
      }
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900">
        <div className="text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent animate-pulse mb-4">
            LOADING POKÉMON
          </div>
          <div className="w-16 h-16 mx-auto border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-lg shadow-cyan-400/50"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">

      <div className="relative z-10 p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-black bg-clip-text text-transparent mb-4 drop-shadow-lg">
           POKÉMON GRID
          </h1>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search Pokemon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-black/90 backdrop-blur-sm border-2 border-green-400 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 shadow-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-500 text-xl">
                <Search />
              </div>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                showOnlyFavorites
                  ? 'bg-red-500 text-white font-extralight'
                  : 'bg-blue-500 text-white font-extralight '
              } hover:scale-105`}
            >
              {showOnlyFavorites ? 'Show All Pokemon' : 'Show Only Favorites'}
            </button>
          </div>

          <div className="text-center text-cyan-400 font-light mb-4">
            Showing {filteredPokemons.length} of {pokemons.length} Pokemon
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-12">
          {filteredPokemons.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-2xl text-yellow-400 mb-4">No Pokemon found</div>
              <div className="text-cyan-400">Try adjusting your search or favorites filter</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {filteredPokemons.map((pokemon) => {
                const pokemonId = getPokemonId(pokemon);
                const isFavorite = favorites.includes(pokemonId);
                
                return (
                  <button 
                    key={pokemon.name} 
                    className="group relative bg-black/70 rounded-lg border-2 border-cyan-400/50 p-4 transition-all duration-300 hover:border-pink-500 hover:scale-105 hover:rotate-1 shadow-lg hover:shadow-2xl"
                    onClick={() => navigate(`/pokedex/${pokemonId}`)}
                    style={{
                      boxShadow: '0 0 20px rgba(0,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-pink-500/0 group-hover:from-cyan-500/20 group-hover:to-pink-500/20 rounded-lg transition-all duration-300"></div>
                    
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg blur-sm group-hover:blur-none transition-all duration-300 border-stone-600 border-2"></div>
                      <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                        alt={pokemon.name}
                        className="w-40 h-40 mx-auto relative z-10 filter contrast-125 brightness-110 drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
                      />
                    </div>

                    <h3 className="flex items-center justify-center text-lg font-bold capitalize text-center text-yellow-400 mb-2 tracking-wide group-hover:text-white transition-colors duration-300" style={{
                      textShadow: '0 0 8px rgba(255,255,0,0.5)'
                    }}>
                      {pokemon.name}
                    </h3>

                    <div className="absolute top-2 right-2 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(pokemonId);
                        }}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          isFavorite 
                            ? 'text-pink-500 scale-110' 
                            : 'text-gray-400 hover:text-pink-400'
                        } hover:scale-125`}
                      >
                        <Heart 
                          className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`}
                          style={{
                            filter: isFavorite ? 'drop-shadow(0 0 8px rgba(236,72,153,0.8))' : 'none'
                          }}
                        />
                      </button>
                    </div>

                    <div className="text-center">
                      <span className="text-cyan-400 font-mono text-sm bg-black/50 px-2 py-1 rounded border border-cyan-400/30" style={{
                        textShadow: '0 0 5px rgba(0,255,255,0.5)'
                      }}>
                        #{String(pokemonId).padStart(3, '0')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex justify-center items-center gap-8 mb-12">
          <button 
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-lg border-2 border-white/30 disabled:from-gray-700 disabled:to-gray-800 disabled:border-gray-600 disabled:text-gray-500 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-2xl"
            style={{
              boxShadow: '0 0 25px rgba(147,51,234,0.4)',
              textShadow: '0 0 10px rgba(0,0,0,0.8)'
            }}
          >
            <span className="relative z-10 tracking-wider flex flex-row items-center justify-center"><ArrowBigLeftDash className='mr-2'/>PREV</span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
            {!page === 1 && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-lg transition-opacity duration-300"></div>}
          </button>
          
          <div className="bg-black border-4 border-yellow-400 rounded-lg p-6 shadow-lg shadow-yellow-400/30">
            <div className="text-center">
              <div className="text-yellow-400 font-mono text-lg mb-2" style={{
                textShadow: '0 0 10px rgba(255,255,0,0.6)'
              }}>
                PAGE
              </div>
              <div className="text-4xl font-bold text-cyan-400 bg-black/70 px-4 py-2 rounded border border-cyan-400/50" style={{
                textShadow: '0 0 15px rgba(0,255,255,0.8)'
              }}>
                {String(page).padStart(2, '0')}
              </div>
              <div className="text-yellow-400 font-mono text-sm mt-2 opacity-70">
                OF {String(totalPages).padStart(2, '0')}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xl rounded-lg border-2 border-white/30 disabled:from-gray-700 disabled:to-gray-800 disabled:border-gray-600 disabled:text-gray-500 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-2xl"
            style={{
              boxShadow: '0 0 25px rgba(59,130,246,0.4)',
              textShadow: '0 0 10px rgba(0,0,0,0.8)'
            }}
          >
            <span className="relative z-10 tracking-wider flex flex-row items-center justify-center">NEXT<ArrowBigRightDash className='ml-2' /></span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
            {!page === totalPages && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-lg transition-opacity duration-300"></div>}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-block relative bg-black/80 text-red-400 px-12 py-6 rounded-lg text-xl font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 border-4 border-blue-900 shadow-2xl"
            style={{
              textShadow: '0 0 10px rgba(0,0,0,0.8)',
              boxShadow: '0 0 30px rgba(255,255,255,0.3), inset 0 1px 0 rgba(255,255,255,0.4)'
            }}
          >
            <span className="relative z-10"> BACK TO LANDING </span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
            <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-lg transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PokeGrid;