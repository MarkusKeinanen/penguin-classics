import React from 'react';
import { withRouter, Switch, Route} from 'react-router-dom';
import { useState, useEffect, useReducer, useRef } from 'react';
import { Table } from 'semantic-ui-react';
import Velocity from 'velocity-animate';

const BookDetails = function(props) {
  
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_LOADING': {
        return { 
          ...state,  
          loading: action.loading
        };
      }
      case 'APPEND_BOOK_DETAILS': {
        const newBookData = {
          ...state.book,
          ...action.book
        }
        return { 
          ...state,  
          book: newBookData
        };
      }
      default: {
        return state;
      }
    }
  };

  const [state, dispatch] = useReducer(
    reducer, 
    //initial state
    (function() {

      return { 
        book: props.book,
        loading: true,
      };
    }()), 
  );

  useEffect(() => {
    fetchDetails();
  }, []);

  function toggleMessage(msg, type) {
    messageRef.current.querySelector("#notice-msg").textContent = msg;
    if (type == 'negative') {
      messageRef.current.classList.remove("positive");
      messageRef.current.classList.add("negative");
    } else {
      messageRef.current.classList.remove("negative");
      messageRef.current.classList.add("positive");
    }
    if (messageRef.current.style.display !== "none") {
      Velocity(messageRef.current, "slideUp", {
        duration: 200
      });
    } else {
      Velocity(messageRef.current, "slideDown", {
        duration: 200,
        complete: () => {
          setTimeout(() => {
            if (messageRef.current != null) {
              Velocity(messageRef.current, "slideUp", {
                duration: 200
              });
            }
          }, 2000)
        }
      });
    }
  }

  function toggleBookPick(book, remove) {
    let currentPicks = localStorage.getItem('book-picks');
    let removedPick;
    if (currentPicks == null) currentPicks = [];
    else currentPicks = JSON.parse(currentPicks);
    if (remove) {
      const idx = currentPicks.findIndex(p => p.isbn == book.isbn);
      removedPick = currentPicks[idx];
      currentPicks.splice(idx, 1);
    } else {
      if (currentPicks.find((p) => p.isbn == book.isbn) != undefined) return;
      currentPicks.push({
        isbn: book.isbn,
        title: book.title,
        author: book.author
      });
    }
    if (remove) props.mainDispatch({type: 'SET_LAST_REMOVED', lastRemoved: removedPick});
    props.mainDispatch({ type: 'SET_BOOK_PICKS', currentPicks });
    currentPicks = JSON.stringify(currentPicks);
    localStorage.setItem('book-picks', currentPicks);
  }

  async function fetchDetails() {
    dispatch({type: 'SET_LOADING', loading: true });
    const url =`https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/search/views/search-display?suppressLinks=true`
    +`&suppressRecordCount=true&rows=1&q=${props.book.isbn}&docType=isbn&api_key=hc72z5msh5jhmvg588zpy6db`;
    let result = await fetch(url);
    let json = await result.json();
    if (json.data === undefined) return null;
    const data = json.data;
    const book = data.results[0];
    dispatch({type: 'APPEND_BOOK_DETAILS', book });
    dispatch({type: 'SET_LOADING', loading: false });
    return data;
  }

  const { book } = state;

  var url = 'https://images.randomhouse.com/cover/' + book.isbn;

  const notPicked = props.currentPicks.find((p) => p.isbn == book.isbn) == undefined;
  var messageRef = useRef();
  return <div style={{margin: "20px"}}>

      <div ref={messageRef} className="ui positive message" 
        style={{position: "fixed", top: "5px", left: props.bigClient ? "310px" : "5px", fontFamily: 'Lato',
         zIndex: 4, width: props.bigClient ? "calc(100% - 320px)" : "calc(100% - 10px)", display: "none", paddingTop: "10px"}}>
        <div className="header">
          NOTICE
        </div>
        <i className="close icon" style={{fontSize: "21px"}} onClick={toggleMessage}></i>
        <p id="notice-msg" style={{marginTop: "2px"}}></p>
      </div>

    <div style={{marginTop: props.client.width >= 550 ? "0px" : "60px"}}>
      <img className="cover-image" src={url} alt={url + "none"} />
    </div>
    <div style={{ position: "relative", textAlign: "center", maxWidth: "400px", width: "100%", margin: "auto auto", marginTop: "30px", fontSize: "16px", fontFamily: 'Lato' }}>
      <div style={{fontSize: "18px"}}>Book details</div>
      {state.loading ? 
      <div className="loader" style={{position: "absolute", zIndex: 2, top: "60px", left: "calc(50% - 50px)"}}></div> : 
      <Table celled>
        <Table.Body>
          <Table.Row >
            <Table.Cell>Author</Table.Cell>
            <Table.Cell style={{fontWeight: "normal"}}>{book.author}</Table.Cell>
          </Table.Row>
          <Table.Row >
            <Table.Cell>Pages</Table.Cell>
            <Table.Cell style={{fontWeight: "normal"}}>{book.pages}</Table.Cell>
          </Table.Row>
          <Table.Row >
            <Table.Cell>Format</Table.Cell>
            <Table.Cell style={{fontWeight: "normal"}}>{book.format}</Table.Cell>
          </Table.Row>
          <Table.Row >
            <Table.Cell>ISBN</Table.Cell>
            <Table.Cell style={{fontWeight: "normal"}}>{book.isbn}</Table.Cell>
          </Table.Row>
          <Table.Row >
            <Table.Cell>Price</Table.Cell>
            <Table.Cell style={{fontWeight: "normal"}}>
              {""+(book.price).toFixed(2) + " $"}
            </Table.Cell>
          </Table.Row>
          <Table.Row >
            <Table.Cell style={{ verticalAlign: "top" }}>Book description</Table.Cell>
            <Table.Cell style={{fontWeight: "normal"}}>
              <div dangerouslySetInnerHTML={{__html: book.flapCopy}}></div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>}

      {!state.loading && <button style={{backgroundColor: notPicked ? "#f60" : "#d64444" }}
        onMouseEnter={(e) => {
          if (!notPicked) e.currentTarget.style.backgroundColor = "#bc3c3c";
          else e.currentTarget.style.backgroundColor = "#dd5a02";
        }} 
        onMouseLeave={(e) => {
          if (!notPicked) e.currentTarget.style.backgroundColor = "#d64444";
          else e.currentTarget.style.backgroundColor = "#f60";
        }}
        className="ui primary button" 
        onClick={() => {
          if (notPicked) {
            toggleBookPick(book);
            toggleMessage("This book has been added to your picks.", "positive");
            window.scrollTo(0,0);
          } else {
            toggleBookPick(book, true);
            toggleMessage("This book has been removed from your picks.", "negative");
            window.scrollTo(0,0);
          }
        }}>
        {notPicked ?"ADD TO YOUR PICKS" : "REMOVE FROM YOUR PICKS"}
      </button>}
    </div>
  </div>
}
export default withRouter(BookDetails)