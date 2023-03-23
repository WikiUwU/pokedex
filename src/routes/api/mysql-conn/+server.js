/** @type {import('./$types').RequestHandler} */
import { json } from '@sveltejs/kit';
import mysql from 'mysql2/promise';

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'pokedex'
});

console.log('...creating a connection to mySQL...');


export async function GET( { url } ) {

    const results = await (await connection).execute(url.searchParams.get('query'));

    // console.log(results)
    return json(results);
}


export async function POST( { request } ) {

    const { query, pokedex_id } = await request.json();

    let doesExist = await (await connection).execute(`SELECT EXISTS(SELECT * FROM test WHERE pokedex_id ='${pokedex_id}')`);
    doesExist = doesExist[0][0][`EXISTS(SELECT * FROM test WHERE pokedex_id ='${pokedex_id}')`]
    
    if (doesExist) {
        // console.log('it exists');
        return json('This pokemon is already part of your pokedex')
    }else {
        // console.log('such an entry does not exist in the table row,  adding new entry')
        const res = await (await connection).execute(`${query} ('${pokedex_id}')`);
        return json(res)
    }

}

// export async function GET() {
//     let connection = await mysqlconnectionFn();

//     let results = await connection.query('')
//         .then(rows => {
//             console.log(rows);
//             return rows;
//         });


//     console.log(results);

//     return {
//         body: results
//     }
// }