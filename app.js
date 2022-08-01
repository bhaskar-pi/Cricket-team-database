const express = require('express');
const  {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path')

const dbPath = path.join(__dirname,"cricketTeam.db");

const app = express();
module.exports = app;

app.use(express.json());

let db = null;

const initializeAndDBServer = async () =>{
    try {
        db = await open({
        filename:dbPath,
        driver: sqlite3.Database
    });
    app.listen(3000, () =>{
        console.log('Server is running at http://localhost:3000/');
    });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
    }
}

initializeAndDBServer();


// GET players API
app.get('/players/', async (request, response) => {
    const getPlayersQuery = `SELECT * FROM cricket_team;`;
    const playersArray = await db.all(getPlayersQuery);
    response.send(playersArray);
});

//POST players API
app.post('/players/', async (request, response) => {
    const playerDetails = request.body;
    const {
        playerName,
        jerseyNumber,
        role,
    } = playerDetails;
    
    response.send("Player Added to Team");
});

//GET Player/PlayerId API 
app.get('/players/:playerId/', async (request, response) => {
    const {playerId} = request.params;
    const getPlayer = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
    const playerArray = await db.get(getPlayer);
    response.send(playerArray);
});

//PUT /players/:playerId/ API 
app.put('/players/:playerId/', async (request, response) => {
    const {playerId} = request.params;
    const playerDetails = request.body;
    const {
        playerName,
        jerseyNumber,
        role
    } = playerDetails;
    const updateQuery = `
    UPDATE cricket_team
    SET
    player_name = ${playerName},
    jersey_number = ${jerseyNumber},
    role = ${role}
    WHERE player_id = ${playerId};`;
    await db.run(updateQuery);
    response.send("Player Details Updated");
});

///DELETE 

app.delete('/players/:playerId/', async(request, response) => {
    const {playerId} = request.params;
    const delPlayerQuery = `
    DELETE FROM cricket_team WHERE player_id = ${playerId};`;
    await db.run(delPlayerQuery);
    response.send("Player Removed");
})

