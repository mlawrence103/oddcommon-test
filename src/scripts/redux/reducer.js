import axios from 'axios';

//action types (variables to store possible state changing actions)
const SET_VIDEO = 'SET_VIDEO';

//action creators
//set video is called when the active (playing) video changes
export const setVideo = (id, file) => {
  return {
    type: SET_VIDEO,
    id,
    file,
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

//set initial state of video playing to be empty string
let initialState = {
  videoId: '',
  videoFile: '',
  detailView: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_VIDEO:
      return {
        ...state,
        videoId: action.id,
        videoFile: action.file,
      };
    default:
      return state;
  }
}
