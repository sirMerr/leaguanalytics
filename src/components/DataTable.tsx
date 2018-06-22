import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import {IMatchInfo} from '../api/interfaces';

interface Props {
  matches?: Array<IMatchInfo>,
  champions: {[key: number]: string},
  itemNames: {[key: number]: {
    description: string,
    id: number,
    name: string,
    plaintext: string
  }},
  summonerSpells: {[key: number]: string}
}

class DataTable extends React.Component<Props> {
  public render() {
    const points = ['Outcome', 'Champion', 'Duration', 'Spells', 'KDA', 'Items bought', 'Champion level', 'Total Creep score', 'Creep score/min' ];

    const tableRow = points.map(((element, index) =>
      <TableCell key={`cell-${index}`}>{element}</TableCell>
      ));
    
    const tableBody = makeTableBody(this.props);

    return (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                {tableRow}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableBody}
            </TableBody>
          </Table>
        </Paper>
    );
  }
}

// const makeItemsString = (allIdNames: Array<IGenericName>, ids: any): string => {
//   if (!allIdNames || !ids || allIdNames.length <= 0 || ids.length <= 0 ) return '';

//   let holder = '';

//   console.log(allIdNames, ids);
  
//   ids.forEach(id => {
//     const itemHolder = allIdNames.find(el => el.id === id);

//     holder += itemHolder ? itemHolder.name + '\n': '\n';
//   });

//   return holder;
// }

const makeTableBody = (props: Props) => {
  const {summonerSpells, champions, matches, itemNames} = props;

  if (!matches) return;

  console.log(summonerSpells);

  return matches.map(element => {
    // const spellsText = makeItemsString(summonerSpells, element.summonerSpellIds!);
    // const itemsText = makeItemsString(itemNames, element.itemIds!);

    // const championHolder = champions ? champions.find(el => el.id === element.championId): null;

    // const championName = championHolder ? championHolder!.name : '';

    const spellsText = element.summonerSpellIds!.map(id => {
      const spell =  Object.values(summonerSpells).find((el:any) => el.id === id);

      if (spell)
        return spell['name'];
      return ''
    })

    console.log(element.summonerSpellIds);

    const championName = champions[element.championId!]

    const itemsText = element.itemIds!.map(id => {
      if (itemNames[id]) return itemNames[id].name;

      return '';
    })

    console.log(spellsText, championName, itemsText);

    return (
      <TableRow key={`table-body-${element.gameId}`}>
        <TableCell component="th" key={`cell-outcome${element.gameId}`}>{element.outcome ? 'WIN' : 'LOSE'}</TableCell>
        <TableCell component="th" key={`cell-champion${element.gameId}`}>{championName}</TableCell>
        <TableCell component="th" key={`cell-duration${element.gameId}`}>{Math.round(element.duration!/60)} mins</TableCell>
        <TableCell component="th" key={`cell-spells${element.gameId}`}>{spellsText.join(', ')}</TableCell>
        <TableCell component="th" key={`cell-kda${element.gameId}`}>{element.kills}/{element.deaths}/{element.assists}</TableCell>
        <TableCell component="th" key={`cell-itemsbought${element.gameId}`}>{itemsText}</TableCell>
        <TableCell component="th" key={`cell-champLevel${element.gameId}`}>{element.championLevel}</TableCell>
        <TableCell component="th" key={`cell-cs${element.gameId}`}>{element.totalCreeps}</TableCell>
        <TableCell component="th" key={`cell-cs-min${element.gameId}`}>{element.creepsPerMin}</TableCell>
      </TableRow>
    );
  });
}

export default DataTable;