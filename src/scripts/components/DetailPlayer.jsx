import { useSelector } from 'react-redux';
import React from 'react';

const DetailPlayer = () => {
  const playingVideoFile = useSelector(state => {
    return state.videoFile;
  });

  return (
    <div id="detail-player">
      <video autoPlay controls>
        <source src={playingVideoFile} type="video/mp4" />
        Sorry there was an error playing this video
      </video>
    </div>
  );
};

export default DetailPlayer;
