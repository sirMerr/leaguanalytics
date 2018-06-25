
import { IMatchInfo } from './interfaces';
import { Kayn, REGIONS, BasicJSCache } from 'kayn';

const basicCache = new BasicJSCache();

const kayn = Kayn(process.env.REACT_APP_LEAGUE_API_KEY)({
    debugOptions: {
        isEnabled: true,
        showKey: true,
    },
    cacheOptions: {
        cache: basicCache,
        timeToLives: {
            useDefault: true
        }
    }
});

const getAccountId = async (summonerName: string, region: REGIONS) => {
    const summoner = await kayn.Summoner.by.name(summonerName).region(region);
    
    return summoner.accountId;
}

const getMatchList = async (accountId: number) => {
    const matchList = await kayn.Matchlist.by.accountID(accountId).query({
        endIndex: 2
    });

    return matchList.matches;
}

export const getChampionName = async (id: number) => {
    const champion = await kayn.Static.Champion.get(id);

    return champion.name;
}

export const getSummonerSpell = async (id: number) => {
    const spell = await kayn.Static.SummonerSpell.get(id);

    return spell.name
}

export const getItemName = async (id: number) => {
    const item = await kayn.Static.Item.get(id);
    

    return item.name
}

const getMatch = async (matchId: number, accountId: number): Promise<IMatchInfo | null> => {
    const match = await kayn.Match.get(matchId);

    const {participants, participantIdentities, gameDuration} = match;

    if (!participantIdentities || !participants) {
        return null;
    }

    const participantIdentity = participantIdentities.find((el: any) => el.player.accountId === accountId);

    if (!participantIdentity) return null;

    const participantId = participantIdentity.participantId;

    if (!participantId) return null;

    const participant = participants.find((el) => el.participantId === participantId);

    if (!participant) return null;

    const {stats} = participant;

    if (!stats) return null;

    const itemIds = [stats.item0,stats.item1,stats.item2,
        stats.item3,stats.item4,stats.item5];

    const totalCreeps = stats.totalMinionsKilled! + stats.neutralMinionsKilled!;

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
        creepsPerMin: Math.round(totalCreeps / (gameDuration! / 60) * 100) / 100
    } as IMatchInfo;
}

export const getChampList = async () => {
    const list = await kayn.Static.Champion.list().query({
        tags: 'keys'
    });

    return list.keys;
}

export const getItemList = async () => {
    const list = await kayn.Static.Item.list();

    const data = list.data!;

    return data;
}

export const getSpellList = async () => {
    const list = await kayn.Static.SummonerSpell.list();

    const data = list.data!;

    return data;
}

export const compileData = async (summonerName: string, region: REGIONS): Promise<Array<IMatchInfo> | null> => {
    try {
    const accountId = await getAccountId(summonerName, region);

    if (!accountId) return null;

    const matchList = await getMatchList(accountId);

    if (!matchList) return null;

    let matches: IMatchInfo[] = [];

    for (let i = 0; i < matchList.length; i++) {
        const match = matchList[i];

        const holder = await getMatch(match.gameId!, accountId);

        if (holder)
            matches.push(holder);
    }
    console.log('Done matches')

    return matches;
    } catch (err) {
        console.error(err);
        return null;
    }
}