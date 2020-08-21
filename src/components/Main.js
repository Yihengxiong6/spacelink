import React, {Component} from 'react';
import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import { NEARBY_SATELLITE, STARLINK_CATEGORY, SAT_API_KEY } from '../constants';
import Axios from 'axios';

class Main extends Component {
    constructor(){
      super();
      this.state = {
        loadingSatellites: false,
      }
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
                <SatelliteList satInfo={this.state.satInfo} loading={this.state.loadingSatellites} />
            </div>
            <div className="right-side">
              right
            </div>
          </div>
        );
    }
}
export default Main;