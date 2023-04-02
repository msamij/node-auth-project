import './BoxLeft.css';

function BoxLeft() {
  return (
    <div className="box-left">
      <h2 className="box-left__heading">Welcome back! Continue with your account.</h2>
      <footer className="footer">
        <ul className="footer__items">
          <li className="footer__item">
            <a className="footer__link" href="#">
              Terms of Service
            </a>
          </li>
          <li className="footer__item">
            <a className="footer__link" href="#">
              Privacy Policy
            </a>
          </li>
          <li className="footer__item">
            <a className="footer__link" href="#">
              Contact Us
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default BoxLeft;
