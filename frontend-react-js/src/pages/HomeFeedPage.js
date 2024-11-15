import './HomeFeedPage.css';
import React from "react";
import DesktopNavigation from '../components/DesktopNavigation';
import DesktopSidebar from '../components/DesktopSidebar';
import ActivityFeed from '../components/ActivityFeed';
import ActivityForm from '../components/ActivityForm';
import ReplyForm from '../components/ReplyForm';

// Import specific functions from Amplify Auth module
import { fetchAuthSession,getCurrentUser } from '@aws-amplify/auth';

export default function HomeFeedPage() {
  const [activities, setActivities] = React.useState([]);
  const [popped, setPopped] = React.useState(false);
  const [poppedReply, setPoppedReply] = React.useState(false);
  const [replyActivity, setReplyActivity] = React.useState({});
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);
  
  const loadData = async () => {
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/home`
      const res = await fetch(backend_url, { method: "GET" });
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

  // const checkAuth = async () => {
  //   try {
  //     // Retrieve user details
  //     const user = await getCurrentUser({ bypassCache: false });

  //     // Verify session validity
  //     await fetchAuthSession();
      
  //     // Check if session is valid by calling fetchAuthSession()
  //     // const session = await fetchAuthSession();
  //     // localStorage.setItem("access_token", session.tokens.accessToken);
  
  //     // If successful, set user state
  //     setUser({
  //       display_name: user.attributes.name,
  //       handle: user.attributes.preferred_username,
  //     });
  //   } catch (err) {
  //     console.log("Error checking authentication:", err);
  //   }
  // };
  const checkAuth = async () => {
    try {
      // Retrieve user details, ensuring the session is valid before setting user data
      const user = await getCurrentUser({ bypassCache: false });
  
      // Check for a valid session; this will error if the session is invalid
      const session = await fetchAuthSession();
      const accessToken = session.getAccessToken().getJwtToken();
      console.log(accessToken)
      localStorage.setItem("access_token", accessToken);
  
      // If session is valid, set user state
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

  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

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
