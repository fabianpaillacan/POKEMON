const BASE_URL = "https://pokeapi.co/api/v2";

export async function getPokemons(page = 1) {
  const limit = 30;
  const offset = (page - 1) * limit;
  
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Failed to fetch pokemons');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching pokemons:', error);
    throw error;
  }
}

export async function getPokemon(id) {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);
    if (!response.ok) throw new Error('Failed to fetch pokemon');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching pokemon:', error);
    throw error;
  }
}

export async function getSpecies(id) {
  try {
    const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
    if (!response.ok) throw new Error('Failed to fetch species');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching species:', error);
    throw error;
  }
}