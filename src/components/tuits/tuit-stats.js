import React, { useState, useEffect } from "react";
import * as likeService from "../../services/likes-service"
import * as dislikeService from "../../services/dislikes-service"


const TuitStats = ({ tuit, likeTuit, dislikeTuit = () => { } }) => {
  const [hasLiked, setHasLike] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const updateLike = async () => {
    const liked = await likeService.userAlreadyLikesTuit('me', tuit._id);
    setHasLike(!!liked);
    const disliked = await dislikeService.userAlreadyDislikesTuit('me', tuit._id);
    setHasDisliked(!!disliked);
  }

  useEffect(() => { updateLike() }, [tuit]);
  return (
    <div className="row mt-2">
      <div className="col">
        <i className="far fa-message me-1"></i>
        {tuit.stats && tuit.stats.replies}
      </div>

      <div className="col">
        <i className="far fa-retweet me-1"></i>
        {tuit.stats && tuit.stats.retuits}
      </div>

      <div className="col">
        <span onClick={() => likeTuit(tuit)}>
          {
            hasLiked &&
            <i className="fa-solid fa-thumbs-up me-1" style={{ color: 'red' }}></i>
          }
          {
            !hasLiked &&
            <i className="fa-regular fa-thumbs-up me-1"></i>
          }
          {tuit.stats && tuit.stats.likes}
        </span>
      </div>

      <div className="col">
        <span onClick={() => dislikeTuit(tuit)}>
          {
            hasDisliked &&
            <i className="fa-solid fa-thumbs-down me-1" style={{ color: 'red' }}></i>
          }
          {
            !hasDisliked &&
            <i className="fa-regular fa-thumbs-down me-1"></i>
          }
          {tuit.stats && tuit.stats.dislikes}
        </span>
      </div>

      <div className="col">
        <i className="far fa-inbox-out"></i>
      </div>
    </div>
  );
}
export default TuitStats;