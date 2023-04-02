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
export const toggleDetailPlayer = toggleDetailView => {
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
    isLiked,
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

// export const createVideoListData = videoDataObj => {
//   return async dispatch => {
//     try {
//       const fullObj = { ...videoDataObj };
//       dispatch(setVideoListData(fullObj));
//     } catch (error) {
//       console.log(error);
//     }
//   };
// };

//set initial state of video playing to be empty string
let initialState = {
  videoId: '',
  videoFile: '',
  detailView: false,
  videoDataList: [],
};

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
      const stateCopy = { ...state };
      const relevantVideoCopy = { ...stateCopy[action.id] };
      relevantVideoCopy.liked = action.liked;
      stateCopy[action.id] = relevantVideoCopy;
      console.log(`setting liked status of ${action.id} to ${action.liked}`);
      return {
        ...state,
        videoDataList: stateCopy,
      };
    default:
      return state;
  }
}