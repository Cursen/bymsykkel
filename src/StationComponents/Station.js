import React from 'react';
import Card from 'react-bootstrap/Card'
import { Bicycle, ConeStriped, HouseDoorFill } from 'react-bootstrap-icons';

const Station = (props) => {
    const style = {
        margin: '8px',
        //Note it currently only console logs click output.
        cursor: 'pointer',
        flex: 1,
        boxShadow: '0 3px 4px dimgrey'
    };
    //Code related to adapting the messages shown on component based on props values
    let message="";
    let rentMessage=""+props.num_bikes_available + " Ledige Sykler";
    let parkMessage=props.num_docks_available +" Ledige Plasser";
    if(!props.is_renting){
        message = message.concat("Du kan ikke leie her for Øyeblikket.");
    }
    if(!props.is_returning){
        message = message.concat("Du kan ikke parkere her for Øyeblikket.");
    }
    if(props.num_docks_available===0){
        parkMessage = "Ingen ledige Plasser";
    }
    if(props.num_bikes_available===0){
        rentMessage = "Ingen ledige Sykler";
    }

    return (
                            //calls openHandler in the App.js file.
        <div style={style} onClick={props.passFunction}>
            <Card className="z-depth-5 h-100" bg="light">
                <Card.Body>
                    <Card.Header as="h2">{props.name}</Card.Header>
                    <HouseDoorFill className="text-muted"/>
                    <Card.Title className="text-muted">{props.address}</Card.Title>
                    <Card.Body>
                        <Bicycle/><p>{rentMessage}</p>
                        <ConeStriped/><p>{parkMessage}</p>
                        <p>{message}</p>
                    </Card.Body>
                </Card.Body>
            </Card>
        </div>
      )
};

export default Station;