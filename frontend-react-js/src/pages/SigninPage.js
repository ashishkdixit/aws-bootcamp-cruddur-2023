import './SigninPage.css';
import React from "react";
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { Link } from "react-router-dom";

// Updated imports for Amplify v6
import { signIn, fetchAuthSession } from '@aws-amplify/auth';

export default function SigninPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState('');

  const onsubmit = async (event) => {
    setErrors('');
    event.preventDefault();

    try {
      // Use the `signIn` API method for authentication
      const user = await signIn({
        username: email,
        password: password
      });

      console.log("User signed in:", user);

      // Fetch session to get tokens
      const session = await fetchAuthSession();
      console.log("Session Object:", session);

      // Ensure session is valid
      if (!session || !session.getAccessToken) {
        throw new Error("Invalid session.");
      }

      // Get access token
      // const accessToken = session.getAccessToken().getJwtToken();
      const accessToken = session.tokens.accessToken();
      console.log("Access Token:", accessToken);

      // Store token locally
      localStorage.setItem("access_token", accessToken);

      // Redirect to home page after successful sign-in
      window.location.href = "/";
    } catch (error) {
      // Handle unconfirmed users
      if (error.code === 'UserNotConfirmedException') {
        window.location.href = "/confirm";
      } else {
        setErrors(error.message || "An error occurred. Please try again.");
      }
    }
  };

  const email_onchange = (event) => {
    setEmail(event.target.value);
  };

  const password_onchange = (event) => {
    setPassword(event.target.value);
  };

  let el_errors;
  if (errors) {
    el_errors = <div className='errors'>{errors}</div>;
  }

  return (
    <article className="signin-article">
      <div className='signin-info'>
        <Logo className='logo' />
      </div>
      <div className='signin-wrapper'>
        <form className='signin_form' onSubmit={onsubmit}>
          <h2>Sign into your Cruddur account</h2>
          <div className='fields'>
            <div className='field text_field username'>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={email_onchange}
                required
              />
            </div>
            <div className='field text_field password'>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={password_onchange}
                required
              />
            </div>
          </div>
          {el_errors}
          <div className='submit'>
            <Link to="/forgot" className="forgot-link">Forgot Password?</Link>
            <button type='submit'>Sign In</button>
          </div>
        </form>
        <div className="dont-have-an-account">
          <span>Don't have an account?</span>
          <Link to="/signup">Sign up!</Link>
        </div>
      </div>
    </article>
  );
}
