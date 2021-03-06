import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html, body {
    text-align: center;
    background: ${props => props.theme.background};
    color: ${props => props.theme.color}; 
    transition: all .3s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    text-align: center;
    width: 85%;
    margin: 0 auto;
    padding: 20px;
    overflow-x: "hidden"; 
  }

  a { 
    color: #1b262c;
    text-decoration: none;
  }

  button {
    border-radius: 5px;
    font-size: 14px;
    margin: 3px;
    margin-top: 15px;
    border: 2px solid #222831;
    background-color: #eeeeee;
  }

`;

// not a styled component just an object
export const modalStyles = {
  overlay: {
    position: "fixed",
    textAlign: "center",
    vertialAlign: "middle",
    height: "95%",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  content: {
    position: "absolute",
    border: "1px solid #ccc",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "5px",
    outline: "none",
    textAlign: "center",
  },
};
