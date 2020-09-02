import React, {useState, useEffect} from 'react';
import {fetchStationStatus, fetchStationInformation} from "./Api/FetchStations";
import './App.css';
import Station from './StationComponents/Station.js';
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import StationModal from "./StationComponents/StationModal";

const App = () => {
  //Note to self setStations causes a rerender
  //its default value is a Map object, to enable directly inserting values based on ID(due to constant status calls)
  const [stations, setStations] = useState(new Map());

  const [show, setShow] = useState(false);
  const [modalStation, setModalStation] = useState();

  //call get station info once. (This is intended to replace ComponentDidMount, and exclude DidUpdate.)
  //then it will start a interval of 10 seconds to try and update each stations information.
  useEffect(() => {
    getStationInfo();
    let interval = setInterval(() =>{
      renewStationStatus();
    }, 10000);
    //This should act like a ComponendWillUnmount and turn off the interval.
    // I am unsure if this is necessary for the interval itself, but at least it shows how to do unmount
    return () => { clearInterval(interval) }
    //this param is left empty to prevent updates,
    //seems to usually be set to a state so you can call this code when it changes.
  },[]);
  //Initialises the entire set of stations, then fills their statuses once.
  const getStationInfo = async () => {
    const stationsInfo = await fetchStationInformation();
    //after getting all stations, put them in a map, so we can more easily add on their status later.
    stationsInfo.data.stations.forEach(function (val){
      stations.set(val.station_id, val)
    });
    //call once to get all their statuses.
    await renewStationStatus();
  };

  const renewStationStatus = async () => {
    let gottenStationsStatus = await fetchStationStatus();
    updateStations(gottenStationsStatus.data.stations)
  };
  //This function is separated to isolate the update Routine
  //expects an array of station objects to update the station map with.
  function updateStations(stationsStatus){
    let stationsToUpdate = new Map(stations);
    stationsStatus.forEach(function (s){
      let current = stationsToUpdate.get(s.station_id);
      //latch onto the existing objects all the status variables based on need.
      current["is_installed"] = s.is_installed;
      current["is_renting"] = s.is_renting;
      current["is_returning"] = s.is_returning;
      current["last_reported"] = s.last_reported;
      current["num_bikes_available"] = s.num_bikes_available;
      current["num_docks_available"] = s.num_docks_available;
    });
    //change state to cause a rerender
    //From my understanding this happens every time, even if values do not change.
    // as shouldComponentUpdate always is true by default
    setStations(stationsToUpdate);
  }
  //This only demonstrates the sending of events to the child component working.
  function openHandler(station){
    console.log(station);
    setModalStation(station);
    setShow(true);
  }
  function closeHandler(){
    setShow(false);
  }
  function renderStations(){
    const stationsList = [];
    stations.forEach(function(val){
      stationsList.push(val);
    });
    return(
        <div className="App">
          <Container fluid>
            {
              splitArray(stationsList,3).map(stationChunk => (
                  <Row fluid="true">
                    {stationChunk.map(s => <Station key={s.id} name={s.name} passFunction={openHandler.bind(this, s)} address={s.address} is_renting={s.is_renting}
                                                    is_returning={s.is_returning} num_bikes_available={s.num_bikes_available}
                                                    num_docks_available={s.num_docks_available} column={s.column}/>)}
                  </Row>
              ))
            }
          </Container>
        </div>
    );
  }
  //TODO remove the associated code duplication from renderStations
  function renderModal(){
    const stationsList = [];
    stations.forEach(function(val){
      stationsList.push(val);
    });
    return(
        <div className="App">
          <Container fluid>
            {
              splitArray(stationsList,3).map(stationChunk => (
                  <Row fluid="true">
                    {stationChunk.map(s => <Station key={s.id} name={s.name} passFunction={openHandler.bind(this, s)} address={s.address} is_renting={s.is_renting}
                                                    is_returning={s.is_returning} num_bikes_available={s.num_bikes_available}
                                                    num_docks_available={s.num_docks_available} column={s.column}/>)}
                  </Row>
              ))
            }
          </Container>
          <StationModal key={modalStation.id} show = {show} name={modalStation.name} passFunction={closeHandler.bind(this)} address={modalStation.address} is_renting={modalStation.is_renting}
                        is_returning={modalStation.is_returning} num_bikes_available={modalStation.num_bikes_available}
                        num_docks_available={modalStation.num_docks_available} column={modalStation.column}/>
        </div>
    );
  }
  //Best solution i could come up with on the spot for enabling column/row control
  // without refactoring the component structure.
  const splitArray = (array, length) =>
      array.reduce(
          (result, item, index) => {
            if ( index % length === 0 ) result.push([]);
            result[Math.floor(index / length)].push(item);
            return result
          },
          []
      );
  //You could also do return({stations.size>0?<Station /> : <p>Loading..</p>}),
  // however i personally prefer the use of basic if else in terms of code structure.
  if(stations.size>0) {
    //Unexpected complexity arose from directly attempting to use a Map object within this render function, so
    //a Array is created from it as a fix.
    if(show){
      return(
          renderModal()
      )
    }
    return (
        renderStations()
    )
  }
    return (
        // implement loading component logic here.
          <div className="app-loading">
            <p>Loading....</p>
          </div>
    )
};
export default App;
