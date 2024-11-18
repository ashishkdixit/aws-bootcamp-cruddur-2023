import './HomeFeedPage.css';
import React from "react";
import DesktopNavigation from '../components/DesktopNavigation';
import DesktopSidebar from '../components/DesktopSidebar';
import ActivityFeed from '../components/ActivityFeed';
import ActivityForm from '../components/ActivityForm';
import ReplyForm from '../components/ReplyForm';

// Import specific functions from Amplify Auth module
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

export default function HomeFeedPage() {
  const [activities, setActivities] = React.useState([]);
  const [popped, setPopped] = React.useState(false);
  const [poppedReply, setPoppedReply] = React.useState(false);
  const [replyActivity, setReplyActivity] = React.useState({});
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);

  const loadData = async () => {
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/home`;
      const res = await fetch(backend_url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      },
       { method: "GET" });
      let resJson = await res.json();
      if (res.status === 200) {
        setActivities(resJson);
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkAuth = async () => {
    try {
      // Retrieve user details
      const user = await getCurrentUser({ bypassCache: false });
      console.log("User details:", user);

      // Fetch session
      const session = await fetchAuthSession();
      console.log("Session Object:", session);

      // Ensure session is valid
      // if (!session || !session.getAccessToken) {
      //   throw new Error("Invalid session.");
      // }

      if (!session || !session.tokens || !session.tokens.accessToken) {
        throw new Error("Invalid session.");
      }

      // Get access token
      // const accessToken = session.getAccessToken().getJwtToken();
      const accessToken = session.tokens.accessToken.toString();
      console.log("Access Token:", accessToken);

      // Store token locally
      localStorage.setItem("access_token", accessToken);

      // Set user state
      setUser({
        display_name: user.attributes.name,
        handle: user.attributes.preferred_username,
      });

      console.log("Session is valid. User authenticated.");
    } catch (err) {
      console.log("Error checking authentication:", err.message);
    }
  };

  React.useEffect(() => {
    loadData();
    checkAuth();
  }, []);

  return (
    <article>
      <DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
      <div className='content'>
        <ActivityForm  
          popped={popped}
          setPopped={setPopped} 
          setActivities={setActivities} 
        />
        <ReplyForm 
          activity={replyActivity} 
          popped={poppedReply} 
          setPopped={setPoppedReply} 
          setActivities={setActivities} 
          activities={activities} 
        />
        <ActivityFeed 
          title="Home" 
          setReplyActivity={setReplyActivity} 
          setPopped={setPoppedReply} 
          activities={activities} 
        />
      </div>
      <DesktopSidebar user={user} />
    </article>
  );
}
