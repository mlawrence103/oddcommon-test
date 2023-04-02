import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import { BiLeftArrow, BiRightArrow, BiX } from 'react-icons/bi';
import { toggleDetailPlayer, fetchVideoFromServer } from '../redux/reducer';
import React from 'react';

const DetailPlayer = () => {
  const dispatch = useDispatch();
  const videoRef = useRef();

  const playingVideoFile = useSelector(state => {
    return state.videoFile;
  });

  const playingVideoId = useSelector(state => {
    console.log(state.videoId);
    return state.videoId;
  });

  const videoList = useSelector(state => {
    return state.videoDataList;
  });

  // go to previous video using order from original config that is stored in state object
  function playPrevVideo() {
    const videoListData = Object.values(videoList);
    let prevVideoId;
    //if this is the last video in the list, then play the first video
    if (videoList[playingVideoId].order == 0) {
      videoListData.forEach(video => {
        if (video.order == videoListData.length - 1) {
          prevVideoId = video.id;
        }
      });
    } else {
      videoListData.forEach(video => {
        if (video.order == videoList[playingVideoId].order - 1) {
          prevVideoId = video.id;
        }
      });
    }
    dispatch(fetchVideoFromServer(prevVideoId));
  }

  // go to next video using order from original config that is stored in state object
  function playNextVideo() {
    const videoListData = Object.values(videoList);
    const numVideos = videoListData.length;
    let nextVideoId;
    //if this is the last video in the list, then play the first video
    if (videoList[playingVideoId].order == numVideos - 1) {
      videoListData.forEach(video => {
        if (video.order == 0) {
          nextVideoId = video.id;
        }
      });
    } else {
      videoListData.forEach(video => {
        if (video.order == videoList[playingVideoId].order + 1) {
          nextVideoId = video.id;
        }
      });
    }
    dispatch(fetchVideoFromServer(nextVideoId));
  }

  useEffect(() => {
    videoRef.current?.load();
  }, [playingVideoFile]);

  return (
    <div id="detail-player">
      <div id="exit-detail" onClick={() => dispatch(toggleDetailPlayer(false))}>
        <BiX size={30} />
      </div>
      <div className="player-arrows flex-row">
        <div id="player-prev" onClick={() => playPrevVideo()}>
          <BiLeftArrow size={20} />
        </div>
        <div id="player-next" onClick={() => playNextVideo()}>
          <BiRightArrow size={20} />
        </div>
      </div>
      <video autoPlay controls ref={videoRef}>
        <source src={playingVideoFile} type="video/mp4" />
        Sorry there was an error playing this video
      </video>
    </div>
  );
};

export default DetailPlayer;
