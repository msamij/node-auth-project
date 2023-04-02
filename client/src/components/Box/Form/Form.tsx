import { useEffect, useState } from 'react';
import { Urls } from '../../../networking/contants';
import Message from '../../Message/Message';
import Welcome from '../../Welcome/Welcome';
import './Form.css';

enum ButtonTextStates {
  primaryButtonSignupText = 'Create Account',
  primaryButtonLoginText = 'Login',
  secondaryButtonSignupText = `Don't have an account? Create one`,
  secondaryButtonLoginText = 'Already have an account? Login',
}

type data = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoginClicked, setIsLoginClicked] = useState(false);
  const [primaryButtonText, setPrimaryButtonText] = useState(ButtonTextStates.primaryButtonSignupText);
  const [secondayButtonText, setSecondaryButtonText] = useState(ButtonTextStates.secondaryButtonLoginText);

  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      let result = await fetch(`${Urls.baseUrl}`, {
        method: 'GET',
      });
      if (result.status === 200) setIsLoggedIn(true);
    })();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validPasswordFields) setMessage(`Two password fields didn't match`);
    else {
      let data: data = {};
      let buildUrl: string = `${Urls.baseUrl}`;

      if (isLoginClicked) {
        data = { email, password };
        buildUrl += `${Urls.login}`;
      } else {
        data = { firstName, lastName, email, password, confirmPassword };
        buildUrl += `${Urls.signup}`;
      }

      const response = await fetch(buildUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200 || response.status === 201) setIsLoggedIn(true);
      else {
        const jsonResponse = await response.json();
        setMessage(jsonResponse.message);
      }
    }
  };

  const validPasswordFields = (): boolean => {
    if (!isLoginClicked && password !== confirmPassword) return false;
    return true;
  };

  const handleSecondaryButtonClick = () => {
    setIsLoginClicked(!isLoginClicked);
    if (isLoginClicked) {
      setPrimaryButtonText(ButtonTextStates.primaryButtonSignupText);
      setSecondaryButtonText(ButtonTextStates.secondaryButtonLoginText);
    } else {
      setPrimaryButtonText(ButtonTextStates.primaryButtonLoginText);
      setSecondaryButtonText(ButtonTextStates.secondaryButtonSignupText);
    }
  };

  const handleLogoutButtonClick = () => {
    (async () => {
      const result = await fetch(`${Urls.baseUrl}${Urls.logout}`, {
        method: 'GET',
      });
      if (result.status === 200) setIsLoggedIn(false);
    })();
  };

  const updateMessageText = () => setMessage('');

  if (!isLoggedIn)
    return (
      <>
        <form className="form" onSubmit={handleFormSubmit}>
          {message.length > 0 ? <Message message={message} updateMessageOnUI={updateMessageText} /> : ''}
          <h2 className="form__heading">Signin to continue</h2>
          {!isLoginClicked ? (
            <>
              <input
                required
                className="form__input"
                type="text"
                placeholder="First name"
                onChange={event => setFirstName(event.target.value)}
              />
              <input
                required
                className="form__input"
                type="text"
                placeholder="Last name"
                onChange={event => setlastName(event.target.value)}
              />
            </>
          ) : (
            ''
          )}
          <input
            required
            className="form__input"
            type="email"
            placeholder="Email"
            onChange={event => setEmail(event.target.value)}
          />
          <input
            required
            className="form__input"
            type="password"
            placeholder="Password"
            onChange={event => setPassword(event.target.value)}
          />

          {!isLoginClicked ? (
            <input
              required
              className="form__input"
              type="password"
              placeholder="Confirm password"
              onChange={event => setconfirmPassword(event.target.value)}
            />
          ) : (
            ''
          )}
          <button className="form__button--primary">{primaryButtonText}</button>
        </form>
        <button className="form__button--secondary" onClick={handleSecondaryButtonClick}>
          {secondayButtonText}
        </button>
      </>
    );
  else return <Welcome onLogoutClicked={handleLogoutButtonClick} />;
}

export default Form;
