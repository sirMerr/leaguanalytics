// cors is added with cors-anywhere for the purpose of this app to not have to make our own server proxy
import Bottleneck from "bottleneck";

export const limiter = new Bottleneck({
    minTime: 333,
    maxConcurrent: 5
  });


export const options = {
    headers: {
        'Access-Control-Allow-Origin': '*',
        "X-Riot-Token": String(process.env.REACT_APP_LEAGUE_API_KEY)
    },
    mode: 'cors' as any
}

export let baseUrl = 'https://cors-anywhere.herokuapp.com/https://na1.api.riotgames.com';

export const buildUrl = (region: string) => {
    baseUrl = `https://cors-anywhere.herokuapp.com/https://${region}.api.riotgames.com`
}

// Having had issues with a few rate limiting and caching libraries,
// I've had to go to the 'old' fashioned way
export const sleep = (ms: number) => 
    new Promise(resolve => setTimeout(resolve, ms));


// Generic fetcher for an id and path
export const getValue = async (path: string, id: number | string, expectedProperty: string, queryParams?: string) => {
    let url = baseUrl + path + id;
    
    if (queryParams) url += queryParams;

    console.log(path, id);

    let json = await limiter.schedule(() => fetch(url, options)).then(res => res.json());

    console.log(json);
    
    // const res = await fetch(url, options);
    // const json = await res.json();

    return json[expectedProperty];
}

// Generic json fetcher for a path
export const getJson = async (path: string, id: number) => {
    const url = baseUrl + path + id;

    let json = await limiter.schedule(() => fetch(url, options)).then(res => res.json());

    // const res = await fetch(url, options);
    // const json = await res.json();

    return json;
}

// https://NA1.api.riotgames.com/match/v3/matches/2808310523

// https://NA1.api.riotgames.com/lol/match/v3/matches/2808310523?api_key=RGAPI-ba0dbbb2-d8d5-443e-b316-8ce7f8f4de8a