import React from 'react';
import { useState, useEffect, useReducer } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { withRouter, Switch, Route } from 'react-router-dom';

function Thumbnails (props) {

  const highlightString = (target, searchTerm) => {
    const lowercaseTitle = (target).toLowerCase().trim();
    const realTitle = (target).trim();
    let idx = lowercaseTitle.indexOf(searchTerm);
    if (idx == -1) return [target];
    let firstPart = realTitle.substring(0, idx);
    let secondPart = realTitle.substring(idx, idx + searchTerm.length);
    let startOf3rd = firstPart.length + secondPart.length;
    let thirdPart = realTitle.substring(startOf3rd);
    let arr = [firstPart, secondPart, thirdPart].map((part, i) => {
      return <div key={"s"+i} style={{display: "inline", background: i == 1 ? "rgba(255, 250, 0, 0.7)" : "none"}}>{part}</div>
    });
    return arr;
  }

  return <div> 
    {props.includeSorting != false && 
      [<p key={"sorting-title"} style={{fontSize: "20px", marginTop: "20px"}}>Sorting order:</p>,
      <Dropdown key={"sorting-dropdown"} selection text={props.sortOrder} style={{fontWeight: "bold"}} 
        options={ ["Print Score", "Alphabetical"].map((text, i) => {
          return <Dropdown.Item key={i} text={text} onClick={(e) => {
            props.mainDispatch({type: 'SET_SORT_ORDER', sortOrder: text});
            if (props.searchResults) {
              props.search(props.searchTerm, text, true);
            } else {
              props.fetchCategory(props.category, text, true)
            }
          }}/>
        })}>
    </Dropdown>]}

    <div style={{marginTop: "20px"}}>
      {props.results.map((result, i) => {
        var url = 'https://images.randomhouse.com/cover/' + result.isbn;
        return <div className="search-result" key={"search-result-"+i}>
          <div style={{padding: "10px", lineHeight: "23px"}}>
            {(function() {
              if (props.searchResults) {
                let array = [highlightString(result.title, props.searchTerm)];
                array.push(<div key={2} style={{width: "calc(100% - 20px)", height: "1px", backgroundColor: "gray", margin: "5px", marginLeft: "10px"}}></div>);
                array.push(<div key={1} style={{fontSize: "17px"}}>{highlightString(result.author, props.searchTerm)}</div>);
                return array;
              } else {
                let array = [result.title];
                array.push(<div key={1} style={{width: "calc(100% - 20px)", height: "1px", backgroundColor: "gray", margin: "5px", marginLeft: "10px"}}></div>);
                array.push(<div key={2} style={{fontSize: "17px"}}>{result.author}</div>);
                return array;
              }
            }())}
          </div>

          <div className="loader" style={{position: "absolute", zIndex: 1, top: "calc(50% - 50px)", left: "calc(50% - 50px)"}}></div>
          <img className="cover-image" style={{zIndex : 2}} onLoad={(e) => {
              const parent = e.currentTarget.parentElement;
              const loader = parent.querySelector(".loader");
              if (loader == null) return;
              parent.removeChild(loader);
            }} 
            onClick={() => {
              props.history.push(`/books/${result.isbn}`);
              window.scrollTo(0,0);
            }}
            src={url} alt="" />
        </div>
        })}
    </div>
    

    {(props.lastSearchTerm && !props.loading && props.results.length == 0) && <div style={{padding: "50px", fontSize: "20px"}}>No results found.</div>}

    {props.appendable != false && <div style={{width: "100%", position: "relative", marginTop: "50px"}}>
      {(props.results.length > 0) && (props.results.length < props.maxResults) && 
        <button className="ui primary button orange-button" onClick={props.addResults}>SHOW MORE</button>} 

      {props.loading && [<div key="loader" className="loader" style={{position: "absolute", left: "calc(50% - 50px)", marginTop: "50px"}}></div>,
        <div key="loader-text" style={{position: "absolute", width: "100%", display: "block", top: "180px", fontSize: "17px"}}>Fetching additional results...</div>]}
     
    </div>}
    
  </div>
}
export default withRouter(Thumbnails);