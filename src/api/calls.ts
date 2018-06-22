/**
 * @todo handle bad requests and errors
 * @todo generic URL builder
 * @todo type return values
 * 
 * Ended up not using a library since I had started before
 * knowing that I could ^^
 */
import fetch from 'node-fetch';

// For demo purposes D:!
const LEAGUE_API_KEY='RGAPI-98e5cc82-27b8-4f1f-ae3e-90e13c583dd5'
let baseUrl = '';

const buildUrl = (region: string) => 
     `https://cors-anywhere.herokuapp.com/https://${region}.api.riotgames.com`

console.log(process.env);

// cors is added with cors-anywhere for the purpose of this app to not have to make our own server proxy
const options = {
    headers: {
        'Access-Control-Allow-Origin': '*',
        "X-Riot-Token": LEAGUE_API_KEY
    },
    mode: 'cors'
}

export interface IMatchInfo {
    gameId: number,
    duration?: number, // Match duration in seconds.
    champion?: number | string, // id -> name
    outcome?: string, //win lose
    summonerSpells?: string[2],
    kills?: number,
    assists?: number,
    deaths?: number,
    items?: string[], // names
    championLevel?: number,
    totalCreeps?: number,
    creepsPerMin?: number // totalCreep / (duration/60) round
}

let matchInfo: IMatchInfo[] = [];

const getAccountId = async (summonerName: string, region: string) => {
    const url = baseUrl + '/lol/summoner/v3/summoners/by-name/' + summonerName;

    const res = await fetch(url, options);
    const json = await res.json();

    return json.accountId;
}

// @todo accept start time/index
const getMatchList = async (accountId: number): Promise<Array<any>> => {
    // Should make a url generic builder 
    const url = baseUrl + '/lol/match/v3/matchlists/by-account/' + accountId + '/?endIndex=10';

    const res = await fetch(url, options);
    const json = await res.json();

    return json.matches;
}

const getChampionName = async (championId: number) => {
    const url = baseUrl + '/lol/static-data/v3/champions/' + championId;
    
    const res = await fetch(url, options);
    const json = await res.json();

    return json.name;
}

export const compileData = async (summonerName: string, region: string) => {
    baseUrl = buildUrl(region);
    const accountId = await getAccountId(summonerName, region);
    const matchList = await getMatchList(accountId);
    // get all champion ids from each match
    let championIds: number[] = [];
    
    matchList.forEach(match => {
        const {gameId, champion} = match;

        matchInfo.push({
            gameId,
            champion
        })

        // Only push unique champions for future requests
        if (championIds.indexOf(champion) === -1) {
            championIds.push(champion);
        }
    });

    console.log(matchList);
    console.log(championIds);

    const championNames = await Promise.all(championIds.map(id => {
        getChampionName(id);
    }));

    console.log(championNames);
    
    return championNames;

    // return matchInfo;
}