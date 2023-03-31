import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VideoContainer from './VideoContainer.jsx'; //import component that will wrap data for each video
import { fetchVideoFromServer, createVideoListData } from '../redux/reducer.js';
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

  const allVideos = useSelector(state => {
    return state.videoDataList;
  });

  //set all video info at initial load
  useEffect(() => {
    const videoData = config.data.map(video => {
      const vidInfo = {};
      vidInfo.id = video.uri.split('/').pop();
      vidInfo.thumbnail = video.pictures.base_link;
      vidInfo.liked = false;
      vidInfo.disLiked = false;
      return vidInfo;
    });
    dispatch(createVideoListData(videoData));
  }, []);

  useEffect(() => {
    const list = document.getElementById('video-list');
    let allObservers = Observer.getAll();
    allObservers.forEach(obs => obs.kill());
    Observer.create({
      type: 'wheel,touch',
      target: list,
      tolerance: 0,
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
        } else {
          // console.log('SAME VIDEO');
        }
      },
    });
  }, [playingVideo]);

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
              <VideoContainer vid={video} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default VideoList;
