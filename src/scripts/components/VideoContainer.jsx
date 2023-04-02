import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDetailPlayer, updateLikeStatus, updateDislikeStatus } from '../redux/reducer';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';

const VideoContainer = props => {
  const dispatch = useDispatch();
  const { vid, id } = props;
  const iconSize = '25';

  const playingVideoId = useSelector(state => {
    return state.videoId;
  });

  const playingVideoFile = useSelector(state => {
    return state.videoFile;
  });

  const videoList = useSelector(state => {
    return state.videoDataList;
  });

  const [liked, setLiked] = useState(videoList[id].liked);
  const [disliked, setDisLiked] = useState(videoList[id].disliked);

  useEffect(() => {
    if (videoList[id]) {
      setLiked(videoList[id].liked);
      setDisLiked(videoList[id].disliked);
    }
  }, [videoList[id]]);

  function toggleLikeDislike(status) {
    console.log('clicked: ', status);
    // if clicked dislike and already disliked, toggle dislike off
    if (status == 'dislike' && disliked) {
      dispatch(updateDislikeStatus(id, false));
    }
    // if clicked dislike and neutral, toggle dislike on
    else if (status == 'dislike' && !disliked) {
      dispatch(updateDislikeStatus(id, true));
      // if liked was already selected, toggle like off
      if (liked) {
        dispatch(updateLikeStatus(id, false));
      }
    }
    // if clicked like and already liked, toggle like off
    else if (status == 'like' && liked) {
      dispatch(updateLikeStatus(id, false));
    }
    // if clicked like and neutral, toggle like on
    else if (status == 'like' && !liked) {
      dispatch(updateLikeStatus(id, true));
      // if disliked was already selected, toggle dislike off
      if (disliked) {
        dispatch(updateDislikeStatus(id, false));
      }
    }
  }

  return (
    <div className="video-container">
      {id == playingVideoId ? (
        <video
          autoPlay
          muted
          className="video-thumbnail"
          onClick={() => dispatch(toggleDetailPlayer(true))}
        >
          <source src={playingVideoFile} type="video/mp4" />
          Sorry there was an error playing this video
        </video>
      ) : (
        <img className="video-thumbnail" src={vid.pictures.base_link} />
      )}
      <div className="video-title">{vid.name}</div>
      <div className="like-dislike-row flex-row">
        <div className="like-dislike-icon" onClick={() => toggleLikeDislike('dislike')}>
          {disliked ? <AiFillDislike size={iconSize} /> : <AiOutlineDislike size={iconSize} />}
        </div>
        <div className="like-dislike-icon" onClick={() => toggleLikeDislike('like')}>
          {liked ? <AiFillLike size={iconSize} /> : <AiOutlineLike size={iconSize} />}
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
