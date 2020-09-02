import React, {useEffect, useState} from 'react';
import {fetchStationInformation, fetchStationStatus} from "./Api/FetchStations";
import './App.css';
import Station from './StationComponents/Station.js';
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import StationModal from "./StationComponents/StationModal";
import Pagination from 'react-bootstrap/Pagination';

const App = () => {
  //Note to self setStations causes a rerender
  //its default value is a Map object, to enable directly inserting values based on ID(due to constant status calls)
  const [stations, setStations] = useState(new Map());
  const [show, setShow] = useState(false);
  const [modalStation, setModalStation] = useState("");
  const [pageNumber, setPageNUmber] = useState(1);
  //Change this for amount of divs per page
  const numPerPage = 9;

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
  function changePage(number){
    console.log(number);
    setPageNUmber(number);
  }
  //Best solution i could come up with on the spot for enabling column/row control
  // without refactoring the component structure.
  function splitArray (array,length) {
    return array.reduce(
        (result, item, index) => {
          if (index % length === 0) result.push([]);
          result[Math.floor(index / length)].push(item);
          return result
        },
        []
    );
  }
  //This function handles all logic related rendering all the stations with their information.
  function renderStations(){
    //take each station out of the map and put them into an array,
    //i could not figure out a way for react to loop over maps within a decent timeframe.
    // perhaps iterating from entries could work.
    const stationsList = [];
    stations.forEach(function(val){
      stationsList.push(val);
    });
    //calculate the amount of pages to insert in the paging element
    const numPages = Math.floor(stationsList.length/numPerPage);
    //https://react-bootstrap.netlify.app/components/pagination/#pagination
    let items = [];
    for (let number = 1; number <= numPages; number++) {
      items.push(
          <Pagination.Item key={number} id={number} active={number === pageNumber} onClick={changePage.bind(this,number)} >
            {number}
          </Pagination.Item>
      );
    }
    //split the station array into a chunk too show on each page.
    let pageChunks = splitArray(stationsList,numPerPage);
    return(
        <div className="App">
            <Container fluid>
              <div className="PagerBackground">
                <Row>
                {items.map(page => (
                    <Pagination className="Pager" size="sm">{page}</Pagination>
                ))}
                </Row>
              </div>
              {
                splitArray(pageChunks[pageNumber],3).map(stationChunk => (
                    <Row>
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
    )
  }
  //You could also do return({stations.size>0?<Station /> : <p>Loading..</p>}),
  // however i personally prefer the use of basic if else in terms of code structure.
  if(stations.size>0) {
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
