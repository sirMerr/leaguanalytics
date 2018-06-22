/**
 * @todo handle bad requests and errors
 * @todo generic URL builder
 * @todo type return values
 */
import fetch from 'node-fetch';

const LEAGUE_API_URL='https://cors-anywhere.herokuapp.com/' + process.env.REACT_APP_LEAGUE_API_URL;

// cors is added with cors-anywhere for the purpose of this app to not have to make our own server proxy
const options = {
    headers: {
        'Access-Control-Allow-Origin': '*',
        "X-Riot-Token": process.env.REACT_APP_LEAGUE_API_KEY!
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

const getAccountId = async (summonerName: string) => {
    const url = LEAGUE_API_URL! + '/lol/summoner/v3/summoners/by-name/' + summonerName;
    
    console.log(process.env);
    console.log(url);

    const res = await fetch(url, options);
    const json = await res.json();

    return json.accountId;
}

// @todo accept start time/index
const getMatchList = async (accountId: number): Promise<Array<any>> => {
    // Should make a url generic builder 
    const url = LEAGUE_API_URL! + '/lol/match/v3/matchlists/by-account/' + accountId + '/?endIndex=10';

    const res = await fetch(url, options);
    const json = await res.json();

    return json.matches;
}

const getChampionName = async (championId: number) => {
    const url = LEAGUE_API_URL! + '/lol/static-data/v3/champions/' + championId;
    
    const res = await fetch(url, options);
    const json = await res.json();

    return json.name;
}

export const compileData = async (summonerName: string) => {
    const accountId = await getAccountId(summonerName);
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
        if (championIds.indexOf(champion) !== -1) {
            championIds.push(champion);
        }
    });

    const championNames = await Promise.all(championIds.map(id => {
        getChampionName(id);
    }));



    
    return championNames;

    // return matchInfo;
}