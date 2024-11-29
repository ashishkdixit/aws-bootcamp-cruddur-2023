
// Import specific functions from Amplify Auth module
import { fetchAuthSession, getCurrentUser,fetchUserAttributes } from '@aws-amplify/auth';


const checkAuth = async (setUser) => {
    try {
      // Retrieve user details
      const { username} = await getCurrentUser({ bypassCache: false });
      console.log("username", username);

      const user = await fetchUserAttributes({ bypassCache: false });
 

      // Fetch session
      const session = await fetchAuthSession();
      
      // Ensure session is valid

      if (!session || !session.tokens || !session.tokens.accessToken) {
        throw new Error("Invalid session.");
      }

      // Get access token
      const accessToken = session.tokens.accessToken.toString();

      // Store token locally
      localStorage.setItem("access_token", accessToken);

      // Set user state
      setUser({
        display_name: user.name,
        handle: user.preferred_username
      });

      console.log("Session is valid. User authenticated.");
    } catch (err) {
      console.log("Error checking authentication:", err.message);
    }
  };

  export default checkAuth;