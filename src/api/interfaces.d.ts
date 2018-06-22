export interface IGenericName {
    id: number, 
    name: string
}

export interface IMatchInfo {
    gameId: number,
    duration?: number, // Match duration in seconds.
    championId?: number, // id -> name
    outcome?: string, //win lose
    summonerSpellIds?: number[],
    kills?: number,
    assists?: number,
    deaths?: number,
    itemIds?: number[], // names
    championLevel?: number,
    totalCreeps?: number,
    creepsPerMin?: number // totalCreep / (duration/60) round
}