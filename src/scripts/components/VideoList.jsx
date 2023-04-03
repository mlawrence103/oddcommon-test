import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VideoContainer from './VideoContainer.jsx'; //import component that will wrap data for each video
import { fetchVideoFromServer, createVideoListData, toggleDetailPlayer } from '../redux/reducer.js';
import config from '../data/index.js';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import DetailPlayer from './DetailPlayer.jsx';

const VideoList = () => {
  gsap.registerPlugin(Observer);
  const dispatch = useDispatch();

  const playingVideo = useSelector(state => {
    return state.videoId;
  });

  const inDetailPlayer = useSelector(state => {
    return state.detailView;
  });

  const videoDataList = useSelector(state => {
    return state.videoDataList;
  });

  //set all video info at initial load
  useEffect(() => {
    toggleDetailPlayer(false);
    const videoDataObj = {};
    let persistLiked = false;
    let persisDisliked = false;
    config.data.forEach((video, idx) => {
      const id = video.uri.split('/').pop();
      //maintain any persisted state for likes and dislikes
      if (videoDataList[id] && videoDataList[id].liked) {
        persistLiked = true;
      } else {
        persistLiked = false;
      }
      if (videoDataList[id] && videoDataList[id].disliked) {
        persisDisliked = true;
      } else {
        persisDisliked = false;
      }

      videoDataObj[id] = {
        id: id,
        name: video.name,
        order: idx,
        thumbnail: video.pictures.base_link,
        liked: persistLiked,
        disliked: persisDisliked,
      };
    });
    // create object of all video data that can be lookd up by id
    // NOTE: the video urls are not being included in this object because of the amount of lookup time to get the
    // proxy urls. instead the id is being passed to the subelement for lookup at the relevant time
    dispatch(createVideoListData(videoDataObj));
  }, []);

  // watch scroll position using gsap observer to see if there is a new centered video
  useEffect(() => {
    const list = document.getElementById('video-list');
    let allObservers = Observer.getAll();
    allObservers.forEach(obs => obs.kill());
    // create the observer
    Observer.create({
      type: 'wheel,touch',
      target: list,
      tolerance: 0,
      //when y position changes, check to see which video element is centered
      onChangeY: () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const center = [windowWidth / 2, windowHeight / 2];
        let centeredVideo = document.elementFromPoint(center[0], center[1]);
        while (centeredVideo.className !== 'video-in-list') {
          let parent = centeredVideo.parentElement;
          centeredVideo = parent;
        }
        if (playingVideo !== centeredVideo.id) {
          dispatch(fetchVideoFromServer(centeredVideo.id));
        }
      },
    });
  }, [playingVideo]);

  // map over all of the videos in the config and create sub elements
  return (
    <div id="video-list" className="flex-col">
      {inDetailPlayer ? (
        <DetailPlayer />
      ) : (
        config.data.map((video, idx) => {
          return (
            <div
              className="video-in-list"
              id={video.uri.split('/').pop()}
              key={`video-${video.uri.split('/').pop()}`}
            >
              <VideoContainer vid={video} id={video.uri.split('/').pop()} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default VideoList;
