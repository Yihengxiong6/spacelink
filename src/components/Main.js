import React, {Component} from 'react';
import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import { NEARBY_SATELLITE, STARLINK_CATEGORY, SAT_API_KEY } from '../constants';
import Axios from 'axios';
import WorldMap from './WorldMap';

class Main extends Component {
    constructor(){
      super();
      this.state = {
        loadingSatellites: false,
        selected: [],
      }
    }

    trackOnClick = () => {
      console.log(`tracking ${this.state.selected}`);
    }

    addOrRemove = (item, status) => { // 点的是谁，勾上了没有(打钩还是反勾)
      let { selected: list } = this.state; // let list = this.state.selected;
      const found = list.some( entry => entry.satid === item.satid); // list 用some函数来找东西，argument是boolean，挨个判断true or false

      if(status && !found){
          list.push(item)
      }

      if(!status && found){
          list = list.filter( entry => {   // filter是过滤 符合callback条件的ele
              return entry.satid !== item.satid; // 为true就提出来，放到新的list里，返回
          });
      }
      
      console.log(list);
      this.setState({
        selected: list
      })
    }

    showNearbySatellite = (setting) => {
      this.fetchSatellite(setting);
    }

    fetchSatellite = (setting) => {
      const {observerLat, observerLong, observerAlt, radius} = setting;
      const url = `${NEARBY_SATELLITE}/${observerLat}/${observerLong}/${observerAlt}/${radius}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;
      this.setState({
        loadingSatellites: true,
      })
      Axios.get(url) // Axios.get()得到的是一个promise的Object
          .then(response => {
              this.setState({
                  satInfo: response.data,
                  loadingSatellites: false,
                  selected: [], // 清空的是selected的list
              })
          })
          .catch(error => {
              console.log('err in fetch satellite -> ', error);
              this.setState({
                loadingSatellites: false,
            })
          })
    }

    render() {  // onshow = {this.showNearbySatellite} 是一个赋值语句，onshow里的 parameter会传到 this.showNearbySatellite里
        return (
          <div className='main'>
            <div className="left-side">
                <SatSetting onShow={this.showNearbySatellite} /> 
                <SatelliteList 
                satInfo={this.state.satInfo} 
                loading={this.state.loadingSatellites} 
                onSelectionChange={this.addOrRemove}
                disableTrack={this.state.selected.length === 0}
                trackOnclick={this.trackOnClick}
              />
            </div>
            <div className="right-side">
              <WorldMap />
            </div>
          </div>
        );
    }
}
export default Main;