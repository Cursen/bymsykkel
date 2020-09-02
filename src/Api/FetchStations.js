import axios from 'axios';

const API_IDENTIFIER = "ByM-Intervju";
const stationInfoURL = "https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json";
export const fetchStationInformation = async () =>{
    const {data} = await axios.get(stationInfoURL, {
        params: {
            IDENTIFIER: API_IDENTIFIER
        }
    });
    console.log(data);
    return data;
};

const stationStatusURL = "https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json";
export const fetchStationStatus = async () =>{
    const {data} = await axios.get(stationStatusURL, {
        params: {
            IDENTIFIER: API_IDENTIFIER
        }
    });
    console.log(data);
    return data;
};
