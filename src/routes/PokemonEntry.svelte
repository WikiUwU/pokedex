<script>
    export let pokemonName;

    async function getPokemonData(pokemonName) {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`, {method: "GET"});

            if (res.ok) {
                const data = await res.json();
                return data;
            }else {
                console.error(res)
            }
    };

    let promise = getPokemonData(pokemonName);

    // assigns the right background-color acording to the pokemons type paragraph
    function assignBackgroundColor(pokemonType) {
        const typeBackgroundColorPairs= {
            'normal': '#a4acaf',
            'fire': '#fd7d24',
            'water': '#4592c4',
            'grass': '#9bcc50',
            'electric': '#eed535 ',
            'ice': '#51c4e7',
            'fighting': '#d56723',
            'poison': '#b97fc9',
            'ground': '#e0c068',
            'flying': '#77c1d6',
            'psychic': '#f366b9',
            'bug': '#729f3f',
            'rock': '#a38c21',
            'ghost': '#7b62a3',
            'dark': '#7b62a3',
            'dragon': '#9a8c99',
            'steel': '#9eb7b8',
            'fairy': '#fdb9e9',
            'default' : 'transparent'
        }

        return typeBackgroundColorPairs[pokemonType] || drinks['default'];
    }

</script>

<style>
    .pokemon-entry {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border: 2px solid black;
        margin-bottom: 2rem;
        position: relative;
    }
    
    .pokemon-image {
        width: 300px;
        height: 300px;
    }

    .pokemon-stats {
        display: none;
        position: absolute;
        width: 300px;
        top: 0;
        left: 300px;
    }

    .pokemon-image:hover + .pokemon-stats {
        display: block;
    }

    .pokemon-types {
        width: 80%;
        display: flex;
        justify-content: space-around;
    }

    .pokemon-types p {
        padding: 0.5rem;
    }
</style>

{#await promise}
    ...waiting
{:then pokedexEntry}
    <div class="pokemon-entry">
        <h2 class="pokemon-name">{
            pokedexEntry.name.charAt(0).toUpperCase() + pokedexEntry.name.slice(1)
        }</h2>

        <img class="pokemon-image" src={pokedexEntry.sprites.other['official-artwork'].front_default} alt="Image of {pokedexEntry.name}">

        <ul class="pokemon-stats">
            <li>PokedexID: {pokedexEntry.id}</li>
            <li>Weight: {Number(pokedexEntry.weight) / 10} kg</li> 
            <li>Height: {Number(pokedexEntry.height) * 10} cm</li>
            <li>Base Experience: {pokedexEntry.base_experience}</li>
            <li>
                Abilities:
                <ul>
                    {#each pokedexEntry.abilities as ability}
                        <li>{ability.ability.name} {#if ability.is_hidden} <span> - Hidden Ability</span>{/if}</li> 
                        
                    {/each}
                </ul>
            </li>
        </ul>

        <div class="pokemon-types">
            {#each pokedexEntry.types as type}
                <p
                style:background-color={assignBackgroundColor(type.type.name)}
                >{type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</p>
            {/each}
        </div>
        
    </div>
{/await}
