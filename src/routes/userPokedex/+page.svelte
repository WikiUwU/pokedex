<!-- 
    Aufgaben:
    -Individuelle Pokemonsuche im Pokedex -> zwei Radio-Buttons zur Auswahl

    -Zwei Ansichten: -ein allgemeiner allwissender Pokedex 
                     - ein eigener Pokedex, wo man die einem selber bekannten Pokemons eintragen kann
                            -> die Einträge (oder zumindest die PokemonID der jeweils bekannten Pokemons) irgendwie Sessionübergreifend speichern
                                    -> localStorage ODER ein Backend 'aufsetzen' und darüber auf eine Datenbank (MySQL/SQLite/MongoDB) zugreifen und dort speichern -> nach Node Paackages schauen, 
                                    womit ich fast kein richtiges backend brauche ...oder Laravel als backend aufsetzen
    
    
            
 -->

<script>
    async function getUserPokedexData() {
        const res = await fetch('/api/mysql-conn?query=SELECT * from `test`');
        const data = await res.json();
        promise = data[0];
    }

    async function addNewPokemonToPokedex(pokedex_id) {

        if (isNaN(pokedex_id)) {
            return "The pokemon you want to add doesn't exist"
        }

        const query = `INSERT INTO \`test\` (\`pokedex_id\`) VALUES`;

        const res = await fetch('/api/mysql-conn', {
            method: 'POST',
            body: JSON.stringify({ query, pokedex_id }),
            headers: {
                'content-type': 'application/json'
            }
        });

        const data = await res.json();
        return data
    }



    async function addPokemon(nameORid) {

        if (Number(nameORid) < 1 || isNaN(Number(nameORid))) {
            console.log("Please enter a valid pokemon name or it's ID");
            return
        }

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameORid}`, {method: "GET"});

        if (!res.ok) {
            console.log("Please enter a valid pokemon name or it's ID");
            return
        }

        const pokedexData = await res.json();

        return addNewPokemonToPokedex(pokedexData.id);
    }
    

    let promise = getUserPokedexData();
</script>



<style>
    .wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-family: monospace;
        overflow: hidden;
    }

    h1 {
        font-size: 2.5rem;
        text-decoration: underline;
    }

    /* .add-new-pokemon {
        display: flex;
        flex-direction: column;
    }

    .add-new-pokemon * {
        margin-bottom: 1rem;
    } */

</style>


<nav>
    <a href="/">Pokedex</a>
    <a href="/userPokedex">User Pokedex</a>
</nav>

<div class="wrapper">

    <h1>User Pokedex</h1>

    <!-- <div class="add-new-pokemon">
        <label for="addPokemonInput">Enter the pokemon's name or id you wish to add to your pokedex:</label>
        <input type="text" name="addPokemonInput" id="addPokemonInput" bind:value={input}>

        <button on:click={addPokemon(input)}>Add new pokemon to your pokedex</button>
    </div> -->
    
    {#await promise}
        <p>...waiting</p>
    {:then  res}
        {console.log(res)}
    {/await}
</div>