import './App.css';
import * as React from 'react';
import DataTable from "./components/DataTable";
import Search from "./components/Search";
import {compileData} from './api/calls';

class App extends React.Component {

  constructor(props: {}) {
    super(props);
    this.updateData = this.updateData.bind(this);
    this.handleSearchClick = this.updateData.bind(this);
  }

	state = {
    summonerName: 'sirMerr',
    summonerId: null,
    region: 'NA1',
    data: []
  }

  async updateData(summonerName: string) {
    const data = await compileData(summonerName);
    this.setState({data})
  }

  handleSearchClick(summonerName: string, region: string) {
    this.setState({ summonerName, region})
  }
  
	handleSearch(summonerName: string) {
    this.setState({summonerName})
  }

  componentDidUpdate(prevProps: any, prevState: any){
    if (this.state.summonerName !== prevState.summonerName) {
      this.updateData(this.state.summonerName);
    }
  }

  public render() {	
    return (
      <div className="App">
          <h1 className="App-title">🎮 Leaguanalytics 📈</h1>
				<Search handleSearchClick={this.handleSearchClick}/>
				<DataTable/>
      </div>
    );
  }
}

export default App;
