import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

interface Props {
  handleSearchClick: (summonerName: string, region: string) => void;
}

class Search extends React.Component<Props> {
  state = {
    summonerName: 'sir Merr',
    region: 'NA1'
  }

  handleSelect = (event: any) => {
    this.setState({region: event.target.value});
  };

  handleNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({summonerName: event.currentTarget.value});
  }

  // change any to proper event type in later iterations
  handleClick = () => {
    this.props.handleSearchClick(this.state.summonerName, this.state.region);
  }

  public render() {
    const regions = ['NA1', 'RU', 'KR', 'BR1', 'OC1'];

    // could also use lodash.uniqueId
    const menus = regions.map((el, index) => <MenuItem key={`menu-${index}`} value={el}>{el}</MenuItem>);

    return (
      <div>
        <TextField
          label='Summoner Name'
          value={this.state.summonerName}
          onChange={this.handleNameChange}
        />
        <Select
          value={this.state.region}
          onChange={this.handleSelect}
        >
          {menus}
        </Select>
        <Button 
          variant="contained" 
          color="primary"
          onClick={this.handleClick}
        >
          Search 
        </Button>
      </div>
    );
  }
}

export default Search;