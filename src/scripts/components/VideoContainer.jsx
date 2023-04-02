import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDetailPlayer, updateLikeStatus } from '../redux/reducer';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';

const VideoContainer = props => {
  const dispatch = useDispatch();
  const { vid, id } = props;
  const iconSize = '25';
  const [liked, setLiked] = useState(false);
  const [disliked, setDisLiked] = useState(false);

  const playingVideoId = useSelector(state => {
    return state.videoId;
  });

  const playingVideoFile = useSelector(state => {
    return state.videoFile;
  });

  const videoList = useSelector(state => {
    return state.videoDataList;
  });

  useEffect(() => {
    videoList;
  }, []);

  function toggleLikeDislike(status) {
    console.log('clicked: ', status);
    // if clicked dislike and already disliked, toggle dislike off
    if (status == 'dislike' && disliked) {
      setDisLiked(false);
    }
    // if clicked dislike and neutral, toggle dislike on
    else if (status == 'dislike' && !disliked) {
      setDisLiked(true);
      // if liked was already selected, toggle like off
      if (liked) {
        setLiked(false);
      }
    }
    // if clicked like and already liked, toggle like off
    else if (status == 'like' && liked) {
      dispatch(updateLikeStatus(vid.id, false));
      setLiked(false);
    }
    // if clicked like and neutral, toggle like on
    else if (status == 'like' && !liked) {
      console.log(vid);
      dispatch(updateLikeStatus(vid.id, true));
      setLiked(true);
      // if disliked was already selected, toggle dislike off
      if (disliked) {
        setDisLiked(false);
      }
    }
  }

  return (
    <div className="video-container">
      {/* <iframe src={vid.player_embed_url} /> */}
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
      ) : videoList[id] ? (
        <img className="video-thumbnail" src={videoList[id].thumbnail} />
      ) : (
        <></>
        // <img className="video-thumbnail" src={vid.pictures.base_link} />
      )}
      {videoList[id] ? <div className="video-title">{videoList[id].name}</div> : <></>}
      {/* <div className="video-title">{vid.name}</div> */}
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
