export default {
  namespaced: true,
  state() {
    return {
      movieList: [],
      movieInfo: {},
      isLoading: false,
      title: '',
      currentPage: 1,
    };
  },
  getters: {},
  mutations: {
    changeMovieList (state, payload) {
      state.movieList = payload.Search;
    },
    viewMovieInfo (state, payload) {
      state.movieInfo = payload;
    },
    loadingMovie(state){
      state.isLoading = !state.isLoading;
    },
    searchTitle(state, title) {
      state.title = title;
    },
    movePage(state, page){
      if(typeof page === 'number'){
        state.currentPage += page;
        return;
      }
      state.currentPage = 1;
    }
  },
  actions: {
    fetchMovieList: async ({commit, state}, payload) =>  {
      const { title = state.title, page } = payload;
      const url = `&s=${title}&page=${page}`;
      try {
        commit('loadingMovie');
        const movieList = await fetchMovie({
          method: "GET",
          url
        });
        commit('changeMovieList', movieList);
        commit('loadingMovie');
      } catch (e) {
        console.error(e.message);
      }
    },
    fetchMoiveInfo: async ({commit}, payload) => {
      const {imdbID} = payload;
      const url = `&i=${imdbID}&plot=full`;
      try{
        commit('loadingMovie');
        const movieInfo = await fetchMovie({
          method: "GET",
          url
        });
        commit('viewMovieInfo', movieInfo);
        commit('loadingMovie');
      } catch(e) {
        console.error(e.message);
      }
    },
  },
};

async function fetchMovie(options) {
  return await fetch("/.netlify/functions/movie", {
    method: "POST",
    body: JSON.stringify(options)
  }).then(res => res.json());
}