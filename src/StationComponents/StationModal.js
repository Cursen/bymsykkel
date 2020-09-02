import React from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import {Bicycle, ConeStriped} from "react-bootstrap-icons";

//Will spawn a Modal when a station is clicked, with its information within it.
//Do note that this throws a deprecated warning, however that is from the react-bootstrap modal itself.
const StationModal = props => {
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
        <div>
            <Modal show={props.show} onHide={props.passFunction}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Bicycle/><p >{rentMessage}</p>
                    <ConeStriped/><p>{parkMessage}</p>
                    <p>{message}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.passFunction}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
export default StationModal;