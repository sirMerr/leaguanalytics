/**
 * @todo handle bad requests and errors
 * @todo type return values
 * @todo replace god awful sleeps and have a dedicated server api
 * with rate limiting
 * 
 * Ended up not using a library since I had started before
 * knowing that I could ^^
 */
import {buildUrl, getValue, getJson} from './utils';
import {IGenericName, IMatchInfo} from './interfaces';

const getAccountId = async (summonerName: string) => {
    return await getValue('/lol/summoner/v3/summoners/by-name/', summonerName, 'accountId');
}

// @todo accept start time/index
const getMatchList = async (accountId: number): Promise<Array<any>> => {
    const json = await getValue('/lol/match/v3/matchlists/by-account/', accountId, 'matches', '?endIndex=10');

    return json ? json : undefined;

}

export const getChampionName = async (championId: number) => {
    const json = await getValue('/lol/static-data/v3/champions/', championId, 'name');

    return json ? json : undefined;
}

// Build match object
const getMatch = async (matchId: number, accountId: number) => {
    const json = await getJson('/lol/match/v3/matches/', matchId);

    console.log(json);
    const {gameDuration, participants, participantIdentities} = json;

    console.log(participantIdentities);

    const participantIdentity = participantIdentities.find((el: any) => el.player.accountId === accountId);

    console.log(participantIdentity);

    const participantId = participantIdentity.participantId;


    const participant = participants.find((el: any) => el.participantId = participantId);

    const {stats} = participant;

    const itemIds = [stats.item0,stats.item1,stats.item2,
        stats.item3,stats.item4,stats.item5];

    const totalCreeps = stats.totalMinionsKilled + stats.neutralMinionsKilled;

    console.log(stats.win);
    return {
        gameId: matchId,
        duration: gameDuration,
        outcome: stats.win,
        championId: participant.championId,
        itemIds,
        summonerSpellIds: [participant.spell1Id, participant.spell2Id],
        kills: stats.kills,
        assists: stats.assists,
        deaths: stats.deaths,
        championLevel: stats.champLevel,
        totalCreeps,
        creepsPerMin: totalCreeps / (gameDuration / 60)
    } as IMatchInfo;
}

export const getSummonerSpell = async (id: number) => {
    const json = await getValue('/lol/static-data/v3/summoner-spells/', id, 'name');

    return json ? json : undefined;

}

export const getItemName = async (id: number) => {
    const json = await getValue('/lol/static-data/v3/items/', id, 'name');

    return json ? json : undefined;

}

export const compileData = async (summonerName: string, region: string) => {
    buildUrl(region);

    try {
        const accountId = await getAccountId(summonerName);

        const matchList = await getMatchList(accountId);

        let matches = [];

        for (let i = 0; i < matchList.length; i++) {
            const match = matchList[i];

            matches.push(await getMatch(match.gameId, accountId));
        }

        return matches;
    } catch (err) {
        console.log('Error getting data');

        return undefined;
    }
}

export const getAllIdNames = async (property: string, call: any, currentItems: Array<IGenericName>, match?: IMatchInfo) => {
    if (!match) return [];

    const currentIds = currentItems && currentItems.length >= 0 ? currentItems.map(el => el.id): [];
    let newIds: number[] = [];

    if (Array.isArray(match[property])) {
        match[property].forEach((id: number) => {
            if (currentIds.length === 0 || currentIds.indexOf(id) === -1)
                newIds.push(id);
        })
    } else {
        if (currentIds.length === 0 || currentIds.indexOf(match[property]!) === -1)
                newIds.push(match[property]);
    }

    const length = newIds.length;
    let newItems: any = [];
    for (let i = 0; i < length; i++) {     const name = await call(newIds[i]);
        if (name === '') continue;
        newItems.push({id: newIds[i], name});
    }
    // const newItems = newIds.map(async (id, index) => {
    //     sleep(5000);
    //     return {id, name: await call(id)};
    // })

    // const newItems = await Promise.all(
    //     newIds.map(async (id, index) => {
    //         sleep(5000);
    //         return {id, name: await call(id)};
    //     })
    // );
    
    return [...currentItems, ...newItems] as any;
}