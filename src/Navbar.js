import React from 'react';
import { useState, useEffect, useReducer } from 'react';
import { withRouter } from 'react-router-dom';

const Navbar = function (props) {

  function inputChange(e) {
    if (e.key == 'Enter') {
      props.search(props.searchTerm, props.sortOrder, true);
      props.history.push(`/search/`);
    }
    props.mainDispatch({type: 'SET_INPUT', field: e.currentTarget.name, value: e.currentTarget.value })
  }

  return <div id="navbar" 
      style={props.bigNavbar ? 
      { position: "absolute", width: "300px", height: "auto", } : 
      { position: "fixed", minHeight: "50px", height: "50px", borderBottom: "1px solid lightgray", width: "100%" }}>

    <div style={{padding: props.bigNavbar ? "25px" : "15px", width: "250px", color: "white", cursor: "pointer", fontSize: "22px"}}
      onClick={() => {
        props.history.push(`/welcome/`);
        props.mainDispatch({type: 'SET_NAVBAR_OPEN', navbarOpen: false });
      }}>
      PENGUIN CLASSICS
    </div>

    {props.client.width < 1000 && 
      <div id="navbar-toggler" style={{position: "absolute", width: "40px", right: "10px", top: props.bigNavbar ? "19px" : "9px", cursor: "pointer"}}
        onClick={() => {
          props.mainDispatch({type: 'SET_NAVBAR_OPEN', navbarOpen: !props.navbarOpen });
          window.scrollTo(0,0);
        }}>
        <div style={{height: "5px", margin: "4px"}}></div>
        <div style={{height: "5px", margin: "4px"}}></div>
        <div style={{height: "5px", margin: "4px"}}></div>
      </div>}

    {props.bigNavbar && <div>
      <div className="ui input" style={{width: "100%"}}>
        <input onKeyUp={inputChange} name="searchTerm" type="text" style={{ borderRadius: "0px"}} placeholder="Search..."/>
        <button style={{ borderRadius: "0px", width: "40px", margin: "0px"}} 
          onClick={(e) => {
            props.search(props.searchTerm, props.sortOrder, true);
            props.mainDispatch({type: 'SET_NAVBAR_OPEN', navbarOpen: false });
            props.history.push(`/search/`);
          }}
          className="ui icon button">
          <i aria-hidden="true" className="search icon"></i>
        </button>
      </div>
      <div className="option" style={{padding: "15px", paddingLeft: "25px", paddingTop: "20px", width: "calc(100%)", color: "white", cursor: "pointer", fontSize: "22px"}}
        onClick={() => {
          props.history.push(`/picks/`);
          props.mainDispatch({type: 'SET_NAVBAR_OPEN', navbarOpen: false });
        }}>
        Your picks
      </div>
      <div className="divider" style={{margin: "0px", width: "100%"}}></div>
      {props.sidebarSubjects.map((subject, i) => {
        return <div key={'navbar'+i} className="option" style={{width: "100%", color: "white", cursor: "pointer"}}
          onClick={() => {
            props.fetchCategory(subject.name, props.sortOrder);
            props.mainDispatch({type: 'SET_NAVBAR_OPEN', navbarOpen: false });
            props.history.push(`/category/${subject.name}`);
          }}>
          <div style={{display: "inline-block", padding: "8px", paddingLeft: "25px", fontSize: "18px", paddingTop: (i == 0 ? "15px": "8px")}}>
          {subject.name + ` (${subject.number})`}
          </div>
        </div>
      })}
      
      <div className="ui vertical ui overlay visible sidebar menu" style={{opacity: 1, zIndex: -1, width: "300px", backgroundColor: "black"}}></div>

      <div style={{height: "300px", width: "100%"}}></div>
    </div>}
  </div>

}

export default withRouter(Navbar);