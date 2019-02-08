import React from 'react';
import { useState, useEffect, useReducer, useRef } from 'react';
import Navbar from './Navbar.js';
import Welcome from './Welcome'
import Thumbnails from './Thumbnails.js';
import BookDetails from './BookDetails.js';
import { withRouter, Switch, Route} from 'react-router-dom';

var resizeListener = null, timedResizeEvent = null;
let CLASSICS = require('./CLASSICS_DATA_PROPER.json');
let authors = [];
let isbnMap = {};
let authorMap = {};
let subjectMap = {};
CLASSICS = CLASSICS.map((classic) => {
  if (!authors.includes(classic)) {
    authors.push(classic.author);
  }
  authorMap[classic.author] = 'CLASSIC';
  isbnMap[classic.isbn] = 'CLASSIC';
  classic.realSubjects = [];
  classic.lowercaseTitle = classic.title.toLowerCase();
  classic.lowercaseAuthor = classic.author.toLowerCase();
  classic.subjects.map((subject) => {
    const realSubject = subject.description.split(" -")[0];
    if (subjectMap[realSubject] == undefined) subjectMap[realSubject] = [classic.isbn];
    else if (!subjectMap[realSubject].includes(classic.isbn)) subjectMap[realSubject].push(classic.isbn);
  });
  return classic;
});

const sidebarSubjects = Object.keys(subjectMap).map((key) => {
  const isbns = subjectMap[key];
  return {
    name: key, 
    number : isbns.length,
    isbns: isbns
  }
}).sort(function(a, b){
  if(a.name < b.name) { return -1; }
  if(a.name > b.name) { return 1; }
  return 0;
});

function Main (props) {

  const { history, match } = props;

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_CLIENT': {
        return { 
          ...state,  
          client: action.client
        };
      }
      case 'SET_NAVBAR_OPEN': {
        return { 
          ...state,  
          navbarOpen: action.navbarOpen
        };
      }
      case 'SET_INPUT': {
        return { 
          ...state,  
          [action.field]: action.value
        };
      }
      case 'SET_LAST_SEARCH': {
        return { 
          ...state,  
          lastSearch: action.lastSearch,
        };
      }
      case 'SET_RESULTS': {
        return { 
          ...state,  
          results: action.results,
          maxResults: action.maxResults
        };
      }
      case 'SET_SORT_ORDER': {
        return { 
          ...state,  
          sortOrder: action.sortOrder,
        };
      }
      case 'SET_CATEGORY': {
        return { 
          ...state,  
          category: action.category,
        };
      }
      case 'SET_LOADING': {
        return { 
          ...state,  
          loading: action.loading
        };
      }
      case 'SET_BOOK_PICKS': {
        return { 
          ...state,  
          currentPicks: action.currentPicks
        };
      }
      case 'SET_LAST_REMOVED': {
        return { 
          ...state,  
          lastRemoved: action.lastRemoved
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

      let currentPicks = localStorage.getItem('book-picks');
      if (currentPicks == null) currentPicks = [];
      else currentPicks = JSON.parse(currentPicks);

      return { 
        client: document.body.getBoundingClientRect(),
        navbarOpen: false,
        results: [],
        category: '',
        maxResults: 0,
        loading: false,
        searchTerm: '',
        lastSearch: '',
        sortOrder: "Print Score",
        currentPicks,
        lastRemoved: null
      };
    }()), 
  );

  useEffect(() => {
    if (resizeListener == null) {
      window.addEventListener("resize", () => {
        if (timedResizeEvent != null) clearTimeout(timedResizeEvent);
        timedResizeEvent = setTimeout(() => {
          clearTimeout(timedResizeEvent);
          timedResizeEvent = null;
          dispatch({ type: 'SET_CLIENT', client: document.body.getBoundingClientRect()})
        }, 50);
      }, false);
    }
    history.push("/");
  }, [])

  async function addResults() {
    if (state.loading) return;
    if (window.location.href.includes(`/search/`)) {
      search(state.searchTerm, state.sortOrder);
    } else {
      fetchCategory(state.category, state.sortOrder)
    }
  }

  async function search(searchTerm, sortOrder, reset) {
    if (state.loading) return;
    searchTerm = searchTerm.toLowerCase().trim(); 
    const search = searchTerm + " " + sortOrder;
    let results = [];

    if (!reset && state.lastSearch == search) {
      if (state.results.length > 0 && state.results.length >= state.maxResults) {
        return;
      }
      results = state.results;
    } else {
      window.scrollTo(0, 0);
    }
    
    if (!window.location.href.includes(`/search/`)) history.push(`/search/`);
    dispatch({type: 'SET_LAST_SEARCH', lastSearch:search });
    dispatch({type: 'SET_RESULTS', results:results, maxResults: results.length - 1 });
    dispatch({type: 'SET_LOADING', loading: true });
    let isbns = CLASSICS.filter((classic) => {
      if (classic.lowercaseTitle.includes(searchTerm) || classic.lowercaseAuthor.includes(searchTerm)) return true;
      return false;
    }).map((classic) => {
      return classic.isbn;
    })

    if (isbns.length == 0) {
      dispatch({type: 'SET_LOADING', loading: false });
      dispatch({type: 'SET_RESULTS', results: [], maxResults: 0 });
      return;
    }

    const json = await fetchISBNs(isbns, results.length, sortOrder);
    json.data.titles.map((title) => {
      title.docType = 'fetchedISBN';
      results.push(title);
    });
    dispatch({type: 'SET_RESULTS', results, maxResults: json.recordCount });
    dispatch({type: 'SET_LOADING', loading: false });
  }

  async function fetchCategory(name, sortOrder, reset) {
    let results = [];
    if (!reset && name == state.category) {
      if (state.results.length == state.maxResults) return;
      results = state.results;
    } else {
      dispatch({type: 'SET_CATEGORY', category: name });
      window.scrollTo(0, 0);
    }
    dispatch({type: 'SET_LOADING', loading: true });
    dispatch({type: 'SET_RESULTS', results:results, maxResults: results.length - 1 });

    if (!window.location.href.includes(`/category/${name}/`)) history.push(`/category/${name}/`);
    let isbns = subjectMap[name];
    const json = await fetchISBNs(isbns, results.length, sortOrder);
    json.data.titles.map((title) => {
      title.docType = 'fetchedISBN';
      results.push(title);
    });
    dispatch({type: 'SET_RESULTS', results, maxResults: json.recordCount });
    dispatch({type: 'SET_LOADING', loading: false });
  } 

  async function fetchISBNs(isbns, start, sortOrder) {
    const sortAttr = sortOrder == 'Print Score' ? 'score' : 'title';
    const url = `https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/titles/?`
    + `sort=${sortAttr}&rows=30&start=${start}&suppressLinks=true&api_key=hc72z5msh5jhmvg588zpy6db`;
    let result = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "isbn": isbns
      })
    });
    let json = await result.json();
    return json;
  }

  const bigClient = state.client.width >= 1000;
  const bigNavbar = state.client.width >= 1000 || state.navbarOpen;
  const sharedProps = { 
    ...props, 
    client: state.client,
    navbarOpen: state.navbarOpen,
    bigNavbar,
    bigClient,
    loading: state.loading, 
    results: state.results, 
    maxResults: state.maxResults,
    category: state.category, 
    searchTerm : state.searchTerm,
    addResults,
    sortOrder: state.sortOrder,
    currentPicks: state.currentPicks,
    mainDispatch: dispatch, 
    sidebarSubjects, search, fetchCategory, 
  };


  let resultsAndPicks = [];
  state.results.map((r) => {
    if (resultsAndPicks.findIndex(p => p.isbn == r.isbn) == -1) resultsAndPicks.push(r);
  });
  state.currentPicks.map((r) => {
    if (resultsAndPicks.findIndex(p => p.isbn == r.isbn) == -1) resultsAndPicks.push(r);
  });
  if (state.lastRemoved != null) {
    if (resultsAndPicks.findIndex(p => p.isbn == state.lastRemoved.isbn) == -1) resultsAndPicks.push(state.lastRemoved);
  }

  return <div id="content" style={{ marginTop: bigNavbar ? "0px" : "50px" }}>

    {!bigClient && state.navbarOpen && <div style={{position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.3)", zIndex: 3}}
      onClick={() => dispatch({type: 'SET_NAVBAR_OPEN', navbarOpen: false })}>
    </div>}

    <div></div>
    <div id="page" style={{ width: bigClient ? "calc(100% - 300px)" : "100%" }}>
      <Navbar {...sharedProps} />
      <div className="category" style={{ left: bigClient ? "300px" : "0px"}}>
        {resultsAndPicks.map((result, i) => 
          <Route key={"thumbnail-route"+i} exact path={`/books/${result.isbn}`} render={() => {
            return <div>
              <div className="category-title">{result.title}</div>
              <div className="divider"></div>
              <button className="ui primary button orange-button" style={{position: "absolute", margin: "10px", left: "0px"}}
                onClick={() => {
                  history.goBack();
                }}>RETURN
              </button>
              <BookDetails {...sharedProps} key={"book-details"+i} book={result} />
            </div>
          }}></Route>)}
        <Switch>
          <Route path="/(|welcome)" render={() => <Welcome />}></Route>

          <Route path="/picks" render={() => 
            <div>
              <div className="category-title">YOUR PICKS</div>
              <div className="divider"></div>
              {state.currentPicks.length == 0 ? <div style={{fontSize: "20px", margin: "20px"}}>You don't have any picks yet.</div> : 
                <div style={{position: "relative"}}>
                <Thumbnails results={state.currentPicks} includeSorting={false} searchResults={false} appendable={false} />
              </div>}
            </div>
          }></Route>

          <Route path="/search" render={() => 
            <div>
              <div className="category-title">SEARCH RESULTS</div>
              <div className="divider"></div>
              <Thumbnails {...sharedProps} includeSorting={true} searchResults={true} />
            </div>
          }></Route>

          {sidebarSubjects.map((category,i) => {
            return <Route key={"category-route"+i} exact path={`/category/${category.name}`} render={() => {
              return <div>
                <div className="category-title">
                  {state.category}
                </div>
                <div className="divider"></div>
                <Thumbnails {...sharedProps} includeSorting={true} />
              </div>
            }}></Route>
          })}

        </Switch>
        
      </div>
    </div>
  </div>
}

export default withRouter(Main)