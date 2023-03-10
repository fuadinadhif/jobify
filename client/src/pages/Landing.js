import styled from "styled-components/macro";
import { Link } from "react-router-dom";

import main from "../assets/images/main.svg";

import Logo from "../components/Logo";

function Landing() {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores
            explicabo deleniti, eligendi quis saepe quos pariatur voluptas
            impedit nesciunt quae rem? Voluptatum sed saepe nihil dolor quaerat
            doloremque? Accusantium, alias!
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        <img
          src={main}
          alt="An adventurer walking towards mountains."
          className="img main-img"
        />
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  nav {
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: var(--fluid-width);
    max-width: var(--max-width);
    height: var(--nav-height);
  }

  h1 {
    font-weight: 700;
    span {
      color: var(--primary-500);
    }
  }

  p {
    color: var(--grey-600);
  }

  .page {
    display: grid;
    align-items: center;
    margin-top: -3rem;
    min-height: calc(100vh - var(--nav-height));
  }

  .main-img {
    display: none;
  }

  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 1fr;
      column-gap: 3rem;
    }

    .main-img {
      display: block;
    }
  }
`;

export default Landing;
