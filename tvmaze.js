"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodesList = $("#episodesList");
const $searchForm = $("#searchForm");

const SEARCH_ENDPOINT = "/search/shows";
const EPISODES_ENDPOINT = "/shows/"
const BASE_URL = "https://api.tvmaze.com";
const MISSING_LINK = "https://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  const showData = await axios.get(`${BASE_URL}${SEARCH_ENDPOINT}`, {
    params: { q: term },
  });

  // let showId = showData.data[0].show.id;
  // let showName = showData.data[0].show.name;
  // let showSummary = showData.data[0].show.summary;
  //let showImage = showData.data[0].show.image.original;

  //console.log([showId, showName, showSummary, showImage]);
  //for(let how in showData.data){

  //}
  let tvShows = showData.data.map((el) => {

    // if(el.show.image === null || el.show.image === undefined){
    //   el.show.image = {original: MISSING_LINK}
    // }
    return {
      id: el.show.id,
      name: el.show.name,
      summary: el.show.summary,
      image: (el.show.image?.original || MISSING_LINK) //check if we can access 'image'
    };
  });

  return tvShows;
}

/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {

    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src= ${show.image}
              alt= ${show.name}
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes aconst $episodesArea = $("#episodesArea");ea (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {

  const episodeData = await axios.get(`${BASE_URL}${EPISODES_ENDPOINT}${id}/episodes`);


  const episodes = episodeData.data.map((el) => {
    return {
     id: el.id,
     name: el.name,
     season: el.season,
     number: el.number
    }
  })
  //console.log(episodes)
return episodes;
}

/**
 * Accepts an array of objects representing episodes
 * populates that into the #episodesList part of the DOM.
 * */
//const $episodesList = $("#episodesList");

function displayEpisodes(episodes) {
  console.log("displayEpisodes", "episodes=", episodes);
  $episodesArea.removeAttr('style');

  for(let ep of episodes){

    let $episodeLi = $(`<li> ${ep.name} (season ${ep.season}, number ${ep.number})</li>`);
    //let episodeLi = `${ep.name} (season ${ep.season}, number ${ep.number}`;
    //$episodeLi.append(episodeLi);

    $episodesList.append($episodeLi)
  }

}

// add other functions that will be useful / match our structure & design
