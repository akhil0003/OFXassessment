import React from "react";
import PropTypes from "prop-types";
import classes from "./NumberInput.module.css";

const NumberInput = (props) => {
  const valueChangeHandler = (e) => {
    const inputValue = e.target.value;
    props.setValue(Number(inputValue));
  };

  return (
    <div className={`${classes.container}`} style={props.style}>
      {props.label && <span>{props.label}</span>}
      <input
        type="number"
        name="amount"
        placeholder={props.placeholder}
        value={props.value}
        onChange={valueChangeHandler}
        className={`${classes.input} ${props.className}`}
        style={props.style}
      />
    </div>
  );
};

NumberInput.propTypes = {
  value: PropTypes.number,
  setValue: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default NumberInput;
