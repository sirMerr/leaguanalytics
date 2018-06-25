import './App.css';
import * as React from 'react';
import DataTable from "./components/DataTable";
import Search from "./components/Search";
import {IMatchInfo} from '../../server/interfaces';

interface State {
  response: any,
  summonerName: string,
  summonerId: number | null,
  region: string,
  data: Array<IMatchInfo>,
  champions: {[key: number]: string},
  itemNames: {[key: number]: {
    description: string,
    id: number,
    name: string,
    plaintext: string
  }},
  summonerSpells: {[key: number]: string}
}

class App extends React.Component {
  constructor(props : {}) {
    super(props);
    this.updateData = this
      .updateData
      .bind(this);
    this.handleSearchClick = this
      .handleSearchClick
      .bind(this);
    this.setProperty = this
      .setProperty
      .bind(this);
  }

  state = {
    response: '',
    summonerName: 'sirMerr',
    summonerId: null,
    region: 'NA1',
    data: [],
    champions: [],
    itemNames: [],
    summonerSpells: []
  } as State

  async updateData(summonerName : string, region : string) {
    const data = await fetch(`/summoner/na/${summonerName}`);
    const json = await data.json();

    this.setState({data: json['matches']});
    return;
  }

  setProperty(updatedProperty : {
    [key : string]: any
  }) {
    this.setState(updatedProperty);
  }

  handleSearchClick() {
    this.updateData(this.state.summonerName, this.state.region);
  }

  async componentDidMount() {
    const spellData = await fetch(`/spells`);
    const spells = await spellData.json();

    const itemData = await fetch(`/items`);
    const items = await itemData.json();

    const champNameData = await fetch(`/champnames`);
    const champs = await champNameData.json();
  
    this.setState({summonerSpells: spells['spells'], champions: champs, itemNames: items})
  }

  public render() {
    return (
      <div className="App">
        <h1 className="App-title">🎮 Leaguanalytics 📈</h1>
        <Search
          setProperty={this.setProperty}
          handleSearchClick={this.handleSearchClick}
          summonerName={this.state.summonerName}
          region={this.state.region}
        />
        <DataTable 
          matches={this.state.data}
          champions={this.state.champions}
          summonerSpells={this.state.summonerSpells}
          itemNames={this.state.itemNames}
        />
      </div>
    );
  }
}

export default App;
