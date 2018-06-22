import './App.css';
import * as React from 'react';
import DataTable from "./components/DataTable";
import Search from "./components/Search";
import {compileData} from './api/calls';

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
    summonerName: 'sirMerr',
    summonerId: null,
    region: 'NA1',
    data: []
  }

  async updateData(summonerName : string, region : string) {
    const data = await compileData(summonerName, region);
    console.log(data);
    this.setState({data});
  }

  setProperty(updatedProperty : {
    [key : string]: any
  }) {
    this.setState(updatedProperty);
  }

  handleSearchClick() {
    this.updateData(this.state.summonerName, this.state.region);
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
        <DataTable/>
      </div>
    );
  }
}

export default App;
