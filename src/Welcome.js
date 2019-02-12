import React from 'react';
import Thumbnails from './Thumbnails.js';

export default function Welcome() {
  return <div>
    <div className="category-title">Welcome!</div>
    <div className="divider"></div>
    <div style={{margin: "auto", fontSize: "16px", fontFamily: 'Lato', fontWeight: "normal", padding: "40px", maxWidth: "800px"}}>
      <h3 style={{margin: "10px"}}>What's this page all about?</h3>
      <div style={{textAlign: "left"}}>
        This is a page for creating and maintaining a reading list of books from the
        <div className="link"
          onClick={() => window.open("http://www.penguinclassics.com")}>{"Penguin Classics"}
        </div>
        Imprint. 
        All book-specific content (covers, authors, descriptions etc.) is generously provided by Penguin's 
        <div className="link"
          onClick={() => window.open("https://developer.penguinrandomhouse.com/docs/read/enhanced_prh_api")}>{"open API"}
        </div>.
        <br></br><br></br>
        If you don't yet know what you're looking for, you can browse books by
        subject category by selecting one of the categories in the navigation menu. If you already have something in mind,
        you can search books by their title or author by entering a search term in the search field in the navigation menu. 
        Results can be sorted by print score or in alphabetical order in both the searching and the browsing section.
        You can save books that you are interested in to the "Your picks" collection,
        which persists between site visits. A book can be added to personal picks in the book details page (accessed by clicking on the book's thumbnail).
      </div>
    
      <h3 style={{margin: "10px", marginTop: "40px"}}>What are Penguin Classics?</h3>
      <div style={{textAlign: "left"}}>
        <div className="link" style={{marginLeft: "0px"}}
          onClick={() => window.open("http://www.penguinclassics.com")}>{"Penguin Classics"}
        </div>
        is an imprint of Penguin Books under which classic works of literature are published.
        Literary critics see books in this series as important members of the Western canon, 
        though many titles are translated or of non-Western origin. This site only includes english translations of books for the sake of consistency.
        <br></br><br></br>
        Penguin Classics can be recognized by their uniquely styled black covers.
        Penguin Books has paid particular attention to the design of its books since recruiting German typographer Jan Tschichold in 1947.
        The early minimalist designs were modernised by Italian art director Germano Facetti, who joined Penguin in 1961. The new classics were known
        as "Black Classics" for their black covers, which also featured artwork appropriate to the topic and period of the work. This design was revised
        in 1985 to have pale yellow covers with a black spine, colour-coded with a small mark to indicate language and period (red for English, purple for
        ancient Latin and Greek, yellow for medieval and continental European languages, and green for other languages).
        <br></br><br></br>
        The most recent full list of Penguin Classics books and authors (the one that this page is based on) was released in 2016 by
        <div className="link"
          onClick={() => window.open("https://www.penguin.com")}>{"www.penguin.com"}
        </div>
        and can be accessed 
        <div className="link"
          onClick={() => window.open("https://www.penguin.com/wp-content/uploads/2016/02/PenguinAnnotatedCatalog2016.pdf")}>{"here"}
        </div>
        .
      </div>
      

      <h3 style={{margin: "10px", marginTop: "40px"}}>How does the search work?</h3>
      <div style={{textAlign: "left"}}>
        The search function matches your search term as an exact character sequence against book titles and author names. The search is case insensitive and includes partial 
        matches in the results - for example, the search term "pla" would return both "The Birds and Other Plays" (book title match) by Aristophanes as well
        as "The Symposium" by Plato (author match).
      </div>
      <Thumbnails results={[{
          "isbn": 9780140449518,
          "title": "The Birds and Other Plays",
          "author": "Aristophanes",
        }, {
          "isbn": 9780140449273,
          "title": "The Symposium",
          "author": "Plato",
        }]} searchResults={true} searchTerm={"pla"} includeSorting={false} /> 

      <h3 style={{margin: "10px", marginTop: "40px"}}>What is "Print score"?</h3>
      <div style={{textAlign: "left"}}>
        The print score is a rank given to books based on their popularity relative to other books. From the Penguin Random House 
        <div className="link"
          onClick={() => window.open("https://developer.penguinrandomhouse.com/docs/read/enhanced_prh_api/concepts/Print_score")}>{"API documentation"}:
        </div>
        <br></br><br></br>
        <i>"While the PRH API does not expose sales or printing figures in the results, you can use the print score field to help order or filter your
        results relative to each other. 
        Print score is computed at the work level based on a field called LTD total in print that is stored at the ISBN level.
        We call the field print score rather than "LTD in print" because we exclude certain ISBNs from this calculation in an effort
        to make products from different divisions and different markets more comparable. The final rules were derived by the group
        driving the PRH.com site but we believe these rules and the resulting lists are generally useful to anyone using the API."</i>
      </div>

    </div>
  </div>
}