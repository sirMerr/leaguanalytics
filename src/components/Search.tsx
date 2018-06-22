import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

interface Props {
  setProperty: (data: {[key: string]: any}) => void;
  handleSearchClick: () => void;
  summonerName: string;
  region: string;
}

class Search extends React.Component<Props> {
  handleSelect = (event: any) => {
    this.props.setProperty({region: event.target.value});
  };

  handleNameChange = (event: any) => {
    this.props.setProperty({summonerName: event.currentTarget.value});
  }

  public render() {
    const regions = ['NA1', 'RU', 'KR', 'BR1', 'OC1'];

    // could also use lodash.uniqueId
    const menus = regions.map((el, index) => <MenuItem key={`menu-${index}`} value={el}>{el}</MenuItem>);

    return (
      <div>
        <TextField
          label='Summoner Name'
          value={this.props.summonerName}
          onChange={this.handleNameChange}
        />
        <Select
          value={this.props.region}
          onChange={this.handleSelect}
        >
          {menus}
        </Select>
        <Button 
          variant="contained" 
          color="primary"
          onClick={this.props.handleSearchClick}
        >
          Search 
        </Button>
      </div>
    );
  }
}

export default Search;