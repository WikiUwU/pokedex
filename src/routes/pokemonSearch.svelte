<script>
    async function getPokedexEntry(nameORid) {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameORid}`, {method: "GET"});

            if (res.ok) {
                const data = await res.json();
                return data;
            }else {
                console.error(res)
            }
    };
    let input;
    let debounceTimer;
    let promise = getPokedexEntry(25);

    function handleInput(nameORid) {
        clearTimeout(debounceTimer);

        if (!isNaN(parseInt(nameORid)) && parseInt(nameORid) < 1) { //not not a Number --> if (is a number) ...
            return
        }

        if (isNaN(parseInt(nameORid))) {
            nameORid = nameORid.toLowerCase();
        }

        debounceTimer = setTimeout(()=> {
            promise = getPokedexEntry(nameORid)
        }, 1000);
    };

</script>

<style>
    .pokemon-name-id-input {
        margin-bottom: 1rem;
    }

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

    .pokemon-image:hover + .pokemon-stats{
        display: flex;
        flex-direction: column;
    }
</style>

<input class="pokemon-name-id-input" type="text" bind:value={input} on:input={handleInput(input)}>

<div>
    {#await promise}
        ...waiting...please enter the id or name of the pokemon you would like to search
    {:then pokedexEntry}
        <div class="pokemon-entry">

            <h2 class="pokemon-name">{
                pokedexEntry.name.charAt(0).toUpperCase() + pokedexEntry.name.slice(1)
            }</h2>
    
            <img class="pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pokedexEntry.id}.png" alt="Image of {pokedexEntry.name}">

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
            
        </div>
        
    {/await}
</div>

<!-- 

    userPokedex = [
        {
            pokedex_id: 1,
            name: 'bulbasaur',
            weight: 69,
            height: 7,
            base_experience: 64,
            abilities: [
                {
                    name: overgrow,
                    is_hidden: false
                },
                {
                    name: chlorophyll,
                    is_hidden: true
                }
            ]
        }, 
        {
            ...
        }
    ]


 -->
