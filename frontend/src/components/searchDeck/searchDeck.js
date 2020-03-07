import React, { useState, useEffect } from "react";
import "./navSearchBar.scss";
import { firestore } from "../../App";
import "../dashboard/deckcards/deckcards.scss";
import { Grid } from "@material-ui/core";

import UserFilter from "./searchFilters/UserFilter";
import SubCategoriesFilter from "./searchFilters/SubCategoriesFilter";

const SearchDeck = () => {
  const [publicDecks, setPublicDecks] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [query, setQuery] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const queryArr = [];
  const usersArr = [];
  const tagsArr = [];

  useEffect(() => {
    firestore.collection("PublicDecks").onSnapshot(snapshot => {
      const deckArr = [];
      snapshot.forEach(doc => {
        deckArr.push(doc.data());
      });
      setPublicDecks(deckArr);
    });
  }, []);

  // const openDeck = (deck, user) => {
  //   console.log("openDeck deck", deck, "\nopenDeck user", user);
  //   props.history.push(`/${user}/${deck}/cards`);
  //   console.log(deck);
  // };

  const handleChange = e => {
    e.preventDefault();
    setSearchField(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    publicDecks.filter(deck => {
      if (
        (deck.deckName &&
          deck.deckName.toLowerCase() === searchField.toLowerCase()) ||
        (deck.createdBy &&
          deck.createdBy.toLowerCase() === searchField.toLowerCase()) ||
        (deck.tags && deck.tags.includes(searchField))
      ) {
        queryArr.push(deck);
        usersArr.push(deck.createdBy);
        tagsArr.push(deck.tags);
        setSearchField("");
      } else {
        console.log("Not Found");
        setSearchField("");
      }
      const tagsArrConcat = [].concat(...tagsArr);
      const tagsSet = [...new Set(tagsArrConcat)];
      setQuery(queryArr);
      setUsers(usersArr);
      setTags(tagsSet);
    });
  };

  const filterClick = (filter, value) => {
    const filteredTags = [];
    const filteredUsers = [];

    const newQuery = query.filter(deck => {
      if (filter === "tags" && deck.tags.includes(value)) {
        filteredUsers.push(deck.createdBy);
        filteredTags.push(deck.tags);

        return deck;
      } else if (deck[filter] === value) {
        filteredUsers.push(deck.createdBy);
        filteredTags.push(deck.tags);

        return deck;
      } else {
        return null;
      }
    });
    const tagsArrConcat = [].concat(...filteredTags);
    const tagsSet = [...new Set(tagsArrConcat)];

    setUsers(filteredUsers);
    setTags(tagsSet);
    setQuery(newQuery);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="center">
          <input
            className="center"
            type="text"
            placeholder="Search Public Decks"
            onChange={handleChange}
            value={searchField}
          />
          <button type="submit">Find</button>
        </div>
      </form>
      <Grid container>
        <Grid item md={3} xs={12}>
          {query.length > 0 ? <h2>Users</h2> : null}

          {query
            ? users.map((users, id) => (
                <UserFilter key={id} users={users} filterClick={filterClick} />
              ))
            : null}

          {query.length > 0 ? <h2>Categories</h2> : null}

          {query
            ? tags.map((tags, id) => (
                <SubCategoriesFilter
                  key={id}
                  tags={tags}
                  filterClick={filterClick}
                />
              ))
            : null}
        </Grid>
        <Grid item md={9} xs={12}>
          <div className="decks-section">
            {query
              ? query.map(item => {
                  const id = Math.random();
                  return (
                    <div
                      className="deckcard-div"
                      key={id}
                      // onClick={openDeck}
                    >
                      <div className="deck">
                        <div className="deck-card">
                          <div className="deck-info">
                            <h3 className="deck-name">{item.deckName}</h3>
                          </div>
                          <div className="example-card">{item.exampleCard}</div>
                        </div>
                        <div className="mastery">
                          <h3>Created by: {item.createdBy}</h3>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default SearchDeck;
