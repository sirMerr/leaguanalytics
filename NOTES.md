20 requests every 1 seconds
100 requests every 2 minutes

matchId = gameId

currentAccountId /== summonerId

matchList(accountId) has list of matches (matchId) => need to go gameId endpoint => has list of players with stats -> stats/playerHistory/resion/currentAccountId

gameID: number
champion: number ==> championId **CHAMPION NAME**

## /lol/summoner/v3/summoners/by-name/{summonerName}
get summonerId and **name** here. LIMIT


## /lol/match/v3/matchlists/by-account/{accountId}
get list of match ids here
get champion --> champion id

## /lol/match/v3/matches/<gameId>
https://na1.api.riotgames.com/lol/match/v3/matches/2808310523?api_key=RGAPI-98e5cc82-27b8-4f1f-ae3e-90e13c583dd5

- gameDuration: 1346 ??-> hhmm? **GAME DURATION**
- teams: WIN LOSE **for OUTCOME**
- gameMode
- teamId -> CHECK TEAM ID TO get **OUTCOME**
- participants:[Object] -> each has teamId and championId
	- accountId -> IDENTIFIER
	- participantId -> IDENTIFIER USED FOR STATS OBJECT AFTER wut
	- teamID for **OUTCOME**
	- spell1Id & spell2Id: numbers **SPELLS**
	- stats: Object
		- win: boolean **OUTCOME EZ**
		- item0-6: id (6 is the ward slot thingy?) **for ITEMS BOUGHT**
		- kills, deaths, assists: numbers **KDA**
		- chamLevel: number **CHAMPION LEVEL**
		- totalMinionsKilled + neutralMinionsKilled = **TOTAL CREEP SCORE** **CREEP SCORE / GAME DURATION MINS= CS/MIN**
- participantIdentities:[Object]
	- participantId --> IDENTIFIER FOR PLAYER AGAIN
	- player: Object
		- summonerName **SUMMONER NAME**


## /lol/static-data/v3/items/{id}
for items bought

## /lol/static-data/v3/summoner-spells/{id}
for summoner spells