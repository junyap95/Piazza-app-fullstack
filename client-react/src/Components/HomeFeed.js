import { useEffect, useState } from "react";

const fetchData = async () => {
  const delay = 750;
  try {
    await new Promise((resolve) => setTimeout(resolve, delay));
    const response = await fetch("/home");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

function HomeFeed() {
  const [backendData, setBackendData] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState({
    text: "",
  });

  // fetch home feed from /home
  useEffect(() => {
    console.log("useEffect initialised");
    fetchData().then((data) => {
      setBackendData(data);
      setIsLoading(false);
    });
  }, []);

  const handleLikeOrDislike = async (postId, action) => {
    // getting the login token stored in local storage
    const authToken = await localStorage.getItem("auth-token");

    if (authToken) {
      try {
        const response = await fetch(`/api/posts/${action}/${postId}`, {
          method: "PATCH",
          headers: {
            "auth-token": authToken,
          },
        });
        if (response.ok) {
          console.log(action + " Action successful");
          fetchData().then((data) => {
            setBackendData(data);
            setIsLoading(false);
          });
        } else {
          const errorData = await response.json();
          alert(errorData.message);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("No token");
    }
  };

  const handleChange = (e) => {
    console.log(e.target.value);

    // refer to <input>'s name and value
    // this is same as creating 2 variables: const name = e.target.name ...etc
    const userComment = e.target.value;

    // if without spread and using previous state, it will just replace the state that has 3 key-value pairs to one, as we are only changing one pair below, the spreading spreads out all pairs, and we are only updating the specific pair as below
    setComment({
      ...comment,
      text: userComment,
    });
  };

  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    const authToken = await localStorage.getItem("auth-token");
    console.log("handlesubmit");

    if (authToken) {
      try {
        console.log(JSON.stringify(comment));
        const response = await fetch(`/api/posts/comment/${postId}`, {
          method: "PATCH",
          headers: {
            "auth-token": authToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(comment),
        });
        if (response.ok) {
          console.log(" Action successful");
          // setButtonDisabled(true);
        } else {
          const errorData = await response.json();
          alert(errorData.message + "wtf");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("No token");
    }
  };

  return (
    <div>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        backendData.map((p, index) => (
          <div key={p._id} className="post-container">
            <div>
              <div className="username">
                Author:{p.username} {p.expiryStatus}
              </div>
              <h3 className="post-title">{p.title}</h3>
              <div className="post-texts">{p.text}</div>

              <div>{p.likeCount} users liked this post</div>
              <div>{p.dislikeCount} users disliked this post</div>

              <div className="likes-dislikes-buttons">
                {/* like/dislike button */}
                <button
                  type="button"
                  name="like"
                  className="post-likes"
                  onClick={() => handleLikeOrDislike(p._id, "LIKE")}
                >
                  Like
                </button>
                <button
                  type="button"
                  name="dislike"
                  className="post-dislikes"
                  onClick={() => handleLikeOrDislike(p._id, "DISLIKE")}
                >
                  Dislike
                </button>
              </div>
            </div>

            <div>
              <div className="post-comment">
                Comments
                {p.comments && p.comments.length > 0 ? (
                  p.comments.map((comment, commentIndex) => (
                    <p key={commentIndex}>
                      {comment.username}: {comment.text}
                    </p>
                  ))
                ) : (
                  <p>No comments here</p>
                )}
              </div>
            </div>
            <div className="comment-box">
              <form onSubmit={(e) => handleCommentSubmit(p._id, e)}>
                <label>
                  <input
                    // autoFocus
                    type="text"
                    className="comment-input"
                    placeholder="Leave a comment..."
                    value={comment.text}
                    onChange={handleChange}
                  />
                  <button type="submit">Submit</button>
                </label>
              </form>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HomeFeed;
