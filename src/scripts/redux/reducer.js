import axios from 'axios';

//action types (variables to store possible state changing actions)
const SET_VIDEO = 'SET_VIDEO';
const TOGGLE_DETAIL_PLAYER = 'TOGGLE_DETAIL_PLAYER';
const CREATE_VIDEO_LIST_DATA = 'CREATE_VIDEO_LIST_DATA';
const UPDATE_LIKE_STATUS = 'UPDATE_LIKE_STATUS';
const UPDATE_DISLIKE_STATUS = 'UPDATE_DISLIKE_STATUS';

//action creators
export const createVideoListData = videoData => {
  return {
    type: CREATE_VIDEO_LIST_DATA,
    data: { ...videoData },
  };
};

//set video is called when the active (playing) video changes
export const setVideo = (id, file) => {
  return {
    type: SET_VIDEO,
    id,
    file,
  };
};

//track if in detail video player
export const _toggleDetailPlayer = toggleDetailView => {
  return {
    type: TOGGLE_DETAIL_PLAYER,
    toggleDetailView,
  };
};

//update like status
export const updateLikeStatus = (id, isLiked) => {
  return {
    type: UPDATE_LIKE_STATUS,
    id,
    status: isLiked,
  };
};

// set dislike status
export const updateDislikeStatus = (id, isDisliked) => {
  return {
    type: UPDATE_DISLIKE_STATUS,
    id,
    status: isDisliked,
  };
};

// thunk creator
export const fetchVideoFromServer = id => {
  return async dispatch => {
    try {
      const res = await axios.post(`https://proxy.oddcommon.dev/vimeo/${id}`);
      const videoFiles = res.data.request.files.progressive;
      const biggestVideoFile = videoFiles.reduce((prev, current) => {
        return prev.width > current.width ? prev : current;
      });
      dispatch(setVideo(id, biggestVideoFile.url));
    } catch (error) {
      console.log(error);
    }
  };
};

export const toggleDetailPlayer = (toggleDetailView, id = '') => {
  return async dispatch => {
    //if there is an id passed, it means that there was a thumbnail clicked and the active video is not the one that was centered on screen
    if (id.length) {
      try {
        const res = await axios.post(`https://proxy.oddcommon.dev/vimeo/${id}`);
        const videoFiles = res.data.request.files.progressive;
        const biggestVideoFile = videoFiles.reduce((prev, current) => {
          return prev.width > current.width ? prev : current;
        });
        dispatch(setVideo(id, biggestVideoFile.url));
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(_toggleDetailPlayer(toggleDetailView));
  };
};

//set initial state of video playing to be empty string
let initialState = {
  videoId: '',
  videoFile: '',
  detailView: false,
  videoDataList: [],
};

// interim objects used when updateing like and silike status so not directly modifying state
let stateCopy = {};
let relevantVideoCopy = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_VIDEO_LIST_DATA:
      return {
        ...state,
        videoDataList: action.data,
      };
    case SET_VIDEO:
      return {
        ...state,
        videoId: action.id,
        videoFile: action.file,
      };
    case TOGGLE_DETAIL_PLAYER:
      return {
        ...state,
        detailView: action.toggleDetailView,
      };
    case UPDATE_LIKE_STATUS:
      // update the relevant video object's like status without directly modifying state
      stateCopy = { ...state.videoDataList };
      relevantVideoCopy = { ...stateCopy[action.id] };
      relevantVideoCopy.liked = action.status;
      stateCopy[action.id] = relevantVideoCopy;
      return {
        ...state,
        videoDataList: stateCopy,
      };
    case UPDATE_DISLIKE_STATUS:
      // update the relevant video object's dislike status without directly modifying state
      stateCopy = { ...state.videoDataList };
      relevantVideoCopy = { ...stateCopy[action.id] };
      relevantVideoCopy.disliked = action.status;
      stateCopy[action.id] = relevantVideoCopy;
      return {
        ...state,
        videoDataList: stateCopy,
      };
    default:
      return state;
  }
}
