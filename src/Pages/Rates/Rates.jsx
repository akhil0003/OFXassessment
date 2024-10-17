import { useState } from "react";
import DropDown from "../../Components/DropDown";
import NumberInput from "../../Components/NumberInput";
import Loader from "../../Components/Loader";
import ProgressBar from "../../Components/ProgressBar";

import { useAnimationFrame } from "../../Hooks/useAnimationFrame";
import { ReactComponent as Transfer } from "../../Icons/Transfer.svg";

import classes from "./Rates.module.css";

import CountryData from "../../Libs/Countries.json";
import countryToCurrency from "../../Libs/CountryCurrency.json";

let countries = CountryData.CountryCodes;

const Rates = () => {
  const [fromCurrency, setFromCurrency] = useState("AU");
  const [toCurrency, setToCurrency] = useState("US");
  const [amount, setAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0.7456);
  const [progression, setProgression] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convertedAmount = (amount * exchangeRate).toFixed(2);
  const ofxExchangeRate = exchangeRate * 0.995;
  const ofxAmount = (amount * ofxExchangeRate).toFixed(2);

  const Flag = ({ code }) => (
    <img
      alt={code || ""}
      src={`/img/flags/${code || ""}.svg`}
      width="20px"
      className={classes.flag}
    />
  );

  const fetchData = async () => {
    if (!loading) {
      setLoading(true);

      const res = await fetch(
        `https://rates.staging.api.paytron.com/rate/public?sellCurrency=${countryToCurrency[fromCurrency]}&buyCurrency=${countryToCurrency[toCurrency]}`
      );
      const data = await res.json();

      if (res.ok) {
        setError(false);
        setExchangeRate(data?.retailRate);
      } else {
        setExchangeRate(0);
        setError(data.title);
      }

      setLoading(false);
    }
  };

  // Demo progress bar moving :)
  useAnimationFrame(!loading, (deltaTime) => {
    setProgression((prevState) => {
      if (prevState > 0.998) {
        fetchData();
        return 0;
      }
      return (prevState + deltaTime * 0.0001) % 1;
    });
  });

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.heading}>Currency Conversion</div>
        <div className={classes.rowWrapper}>
          <NumberInput
            label="Amount"
            placeholder="Enter amount to be converted"
            value={amount}
            setValue={setAmount}
            style={{ marginBottom: "20px" }}
          />
        </div>

        <div className={classes.rowWrapper}>
          <div>
            <DropDown
              leftIcon={<Flag code={fromCurrency} />}
              label={"From"}
              selected={countryToCurrency[fromCurrency]}
              options={countries.map(({ code }) => ({
                option: countryToCurrency[code],
                key: code,
                icon: <Flag code={code} />,
              }))}
              setSelected={(key) => {
                setFromCurrency(key);
              }}
              style={{ marginRight: "20px" }}
            />
          </div>

          <div className={classes.exchangeWrapper}>
            <div className={classes.transferIcon}>
              <Transfer height={"25px"} />
            </div>

            <div className={classes.rate}>{exchangeRate}</div>
          </div>

          <div>
            <DropDown
              leftIcon={<Flag code={toCurrency} />}
              label={"To"}
              selected={countryToCurrency[toCurrency]}
              options={countries.map(({ code }) => ({
                option: countryToCurrency[code],
                key: code,
                icon: <Flag code={code} />,
              }))}
              setSelected={(key) => {
                setToCurrency(key);
              }}
              style={{ marginLeft: "20px" }}
            />
          </div>
        </div>

        <ProgressBar
          progress={progression}
          animationClass={loading ? classes.slow : ""}
          style={{ marginTop: "20px" }}
        />

        {loading ? (
          <div className={classes.loaderWrapper}>
            <Loader width={"25px"} height={"25px"} />
          </div>
        ) : (
          <div className={classes.rateWrapper}>
            {error ? (
              <span className={classes.errorText}>Error: {error}</span>
            ) : (
              <>
                <span>Converted Amount: {convertedAmount}</span>
                <span>Markup Amount: {ofxAmount}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rates;
