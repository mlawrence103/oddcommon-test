import axios from 'axios';

//action types (variables to store possible state changing actions)
const SET_VIDEO = 'SET_VIDEO';
const TOGGLE_DETAIL_PLAYER = 'TOGGLE_DETAIL_PLAYER';
const SET_VIDEO_LIST_DATA = 'SET_VIDEO_LIST_DATA';

//action creators

export const setVideoListData = data => {
  return {
    type: SET_VIDEO_LIST_DATA,
    data,
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

// thunk creator
export const createVideoListData = videoDataList => {
  return async dispatch => {
    try {
      for (let i = 0; i < videoDataList.length; i++) {
        const res = await axios.post(`https://proxy.oddcommon.dev/vimeo/${videoDataList[i].id}`);
        const videoFiles = res.data.request.files.progressive;
        const biggestVideoFile = videoFiles.reduce((prev, current) => {
          return prev.width > current.width ? prev : current;
        });
        videoDataList[i].videoUrl = biggestVideoFile.url;
      }
      console.log(videoDataList);
      dispatch(setVideoListData(videoDataList));
    } catch (error) {
      console.log(error);
    }
  };
};

//set initial state of video playing to be empty string
let initialState = {
  videoId: '',
  videoFile: '',
  detailView: false,
  videoDataList: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_VIDEO_LIST_DATA:
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
    default:
      return state;
  }
}
