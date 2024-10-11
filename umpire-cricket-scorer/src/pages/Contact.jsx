import React from "react";
import "../styles/Contact.css";
import Navbar from "../components/Navbar";

const Contact = () => {
  return (
    <div className="contact-us-container">
      <Navbar />
      <h1>Contact Us</h1>
      <p>
        Have a question or comment about Cricket Scorer? We'd love to hear from
        you! Fill out the form below and we'll get back to you as soon as
        possible.
      </p>
      <form>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" />
        <br />
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" />
        <br />
        <label for="message">Message:</label>
        <textarea id="message" name="message" />
        <br />
        <button type="submit">Send</button>
      </form>
      <h2>Get in Touch</h2>
      <ul>
        <li>
          <i className="fa fa-phone" /> +91 7698047480
        </li>
        <li>
          <i className="fa fa-envelope" />{" "}
          [info@cricketscorer.com]
        </li>
        <li>
          <i className="fa fa-map-marker" /> 123 Main St, Newtoen, India 12345
        </li>
      </ul>
    </div>
  );
};

export default Contact;
