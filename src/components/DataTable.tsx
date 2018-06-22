import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {IMatchInfo} from '../api/calls';

interface Props {
  matches?: Array<IMatchInfo>
}

class DataTable extends React.Component<Props> {
  public render() {
    const points = ['Outcome', 'Champion', 'Duration', 'Spells', 'KDA', 'Items bought', 'Champion level', 'Total Creep score', 'Creep score/min' ];

    const tableRow = points.map(((element, index) =>
      <TableCell key={`cell-${index}`}>{element}</TableCell>
      ));
    
    return (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                {tableRow}
              </TableRow>
            </TableHead>

          </Table>
        </Paper>
    );
  }
}

export default DataTable;