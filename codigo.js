const buttonGetPokemon = document.getElementById("buttonGetPokemon");
const getName = document.getElementById("getName");
const validation = document.getElementById("validation");
const userGets = document.getElementById("userGets");

const getResults = (e)=> {
    e.preventDefault();
    let error = validateName();
    if (error[0]) {
        validation.innerHTML = error[1];
        validation.classList.remove("validName");
        validation.classList.add("invalidName");

    } else {
        validation.classList.remove("invalidName");
        validation.classList.add("validName");
        returnPokemon()
    } 
}

const validateName = ()=>{
    let error = [];
    if (getName.value.length < 3 || getName.value.length > 10) {
        error[0] = true;
        error[1] = "Please introduce a valid name.";
        return error;
    }
    error [0] = false;
    return [false]; 
}

const getRandomPokemonIndex = () => {
    return Math.floor(Math.random() * 152);
}

const obtainPokemonName = async (id) => {
    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}?limit=151`);
    const pokemonData = await pokemonResponse.json();
    return pokemonData;
}

const obtainPokemonDescription = async (id) => {
    const pokemonDescription = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}?limit=151`);
    const pokemonData = await pokemonDescription.json();
    const flavorTextEntry = pokemonData.flavor_text_entries.find(entry => entry.language.name === 'en');
    
    if (flavorTextEntry) {
        let flavorText = flavorTextEntry.flavor_text;
        flavorText = flavorText.replace(/\f/g, ' ');
        return flavorText;
    } else {
        return "There is no description";
    }
}

const obtainPokemonImg = async (id) => {
    const formattedId = id.toString().padStart(3, '0');
    const imageUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${formattedId}.png`;
    return imageUrl;
}


const returnPokemon = async () => {
    try {
        let pokemonResultElement = document.querySelector("#pokemonResult");
        let pokemonTypeElement = document.querySelector("#pokemonType"); 
        let pokemonDescriptionElement = document.querySelector("#pokemonDescription"); 
        let pokemonImgElement = document.querySelector("#pokemonImg"); 
        const pokemonId = getRandomPokemonIndex();
        const pokemon = await obtainPokemonName(pokemonId);
        const pokemonDescription = await obtainPokemonDescription(pokemonId);
        const imageUrl = await obtainPokemonImg(pokemonId);

        const existingDiv = document.querySelector('#pokemonContainer');
        existingDiv.classList.add('pokemonCard');

        userGets.innerHTML = `<b>${getName.value}</b> your pokemon is:`;
        pokemonTypeElement.innerHTML = `<b>Type:</b> ${pokemon.types.map(type => type.type.name).join(', ')}`;
        pokemonResultElement.innerHTML = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        pokemonDescriptionElement.innerHTML = pokemonDescription;
        pokemonImgElement.src = imageUrl;

        const types = []
        for (let i = 0; i < pokemon.types.length; i++) {
            types.push(pokemon.types[i].type.name)
        }
        } catch (e) {
        console.log(e);
    } 
}

buttonGetPokemon.addEventListener("click",getResults);
getName.addEventListener("keypress", function(e) {
    if (e && e.key === "Enter") {
        e.preventDefault();
        getResults(e);
    }
});
