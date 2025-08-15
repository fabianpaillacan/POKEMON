import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPokemon, getSpecies } from '../services/pokeapi';

function PokeDex() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);

  useEffect(() => {
    if (id) {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-2xl font-light text-slate-300">Loading Pokémon</div>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700">
          <div className="text-3xl font-light text-slate-300 mb-8">Pokémon not found</div>
          <Link 
            to="/pokegrid" 
            className="inline-block bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium"
          >
            Return to Grid
          </Link>
        </div>
      </div>
    );
  }

  const getTypeColor = (typeName) => {
    const colors = {
      normal: 'bg-slate-500',
      fire: 'bg-orange-600',
      water: 'bg-blue-600',
      electric: 'bg-yellow-500',
      grass: 'bg-emerald-600',
      ice: 'bg-cyan-500',
      fighting: 'bg-red-700',
      poison: 'bg-violet-600',
      ground: 'bg-amber-600',
      flying: 'bg-indigo-500',
      psychic: 'bg-pink-600',
      bug: 'bg-lime-600',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-slate-600',
      fairy: 'bg-pink-500'
    };
    return colors[typeName] || 'bg-slate-500';
  };

  const getStatColor = (statValue) => {
    if (statValue >= 100) return 'bg-emerald-500';
    if (statValue >= 80) return 'bg-blue-500';
    if (statValue >= 60) return 'bg-amber-500';
    if (statValue >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <div className="container mx-auto px-6 py-8">
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600/20 to-slate-800/40 rounded-full blur-2xl"></div>
                  <img 
                    src={pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default} 
                    alt={pokemon.name}
                    className="w-48 h-48 mx-auto relative z-10 drop-shadow-2xl"
                  />
                </div>
                
                <h1 className="text-4xl font-bold text-white capitalize mb-2 tracking-tight">
                  {pokemon.name}
                </h1>
                <div className="inline-flex items-center bg-slate-700/50 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-600">
                  <span className="text-slate-300 text-lg font-mono">#{String(id).padStart(3, '0')}</span>
                </div>
                <div className="mt-4">
                  {pokemon.types?.map((type, index) => (
                  <span 
                    key={index}
                    className={`${getTypeColor(type.type.name)} text-white px-6 py-3 rounded-2xl font-medium text-sm uppercase tracking-wider shadow-lg ml-2`}
                  >
                    {type.type.name}
                  </span>
                ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-slate-200 mb-6">Physical Attributes</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-slate-700/50 rounded-2xl p-6 border border-slate-600/50">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {(pokemon.height / 10).toFixed(1)}
                  </div>
                  <div className="text-slate-400 text-sm uppercase tracking-wide">Height (m)</div>
                </div>
                <div className="text-center bg-slate-700/50 rounded-2xl p-6 border border-slate-600/50">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">
                    {(pokemon.weight / 10).toFixed(1)}
                  </div>
                  <div className="text-slate-400 text-sm uppercase tracking-wide">Weight (kg)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
              <h3 className="text-2xl font-semibold text-slate-200 mb-8">Base Statistics</h3>
              <div className="space-y-6">
                {pokemon.stats?.map((stat, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-medium capitalize text-lg">
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-100 font-bold text-xl min-w-[3rem] text-right flex flex-grow">
                          {stat.base_stat} <p className='text-gray-400'>/255</p>
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full ${getStatColor(stat.base_stat)} transition-all duration-700 ease-out rounded-full`}
                          style={{width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
              <h3 className="text-2xl font-semibold text-slate-200 mb-6">Description</h3>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-600/30">
                <p className="text-slate-300 text-lg leading-relaxed font-light">
                  {species?.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text?.replace(/\f|\n|\r/g, ' ') || 'No description available'}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link 
                to="/pokegrid" 
                className="group flex items-center gap-3 bg-slate-700/70 hover:bg-slate-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-medium backdrop-blur-sm border border-slate-600/50"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Grid
              </Link>
              
              <div className="flex gap-3">
                {parseInt(id) > 1 && (
                  <Link
                    to={`/pokedex/${parseInt(id) - 1}`}
                    className="group flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/70 text-slate-300 hover:text-white px-6 py-3 rounded-xl transition-all duration-300 border border-slate-600/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Link>
                )}
                
                <Link
                  to={`/pokedex/${parseInt(id) + 1}`}
                  className="group flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/70 text-slate-300 hover:text-white px-6 py-3 rounded-xl transition-all duration-300 border border-slate-600/30"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokeDex;