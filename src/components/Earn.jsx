import React, { useEffect, useState } from 'react'
import "../App.css"
import { useSigner, useProvider } from 'wagmi'
import { ethers } from 'ethers';
import value from '.././value.json'
import tokenAbi from '../tokenAbi.json'
import stakingAbi from '../stakingAbi.json'
import ClipLoader from "react-spinners/ClipLoader";
import promodeposit from '../promoDeposit.json'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import './Navbar.css';



const Earn = () => {

  /* eslint-disable no-unused-vars */

  const { data: signer } = useSigner()
  const provider = useProvider();
  const [myaddress, setMyaddress] = useState()
  const [choapr, setChoApr] = useState("")
  const [usdtapr, setUsdtapr] = useState("")
  const [usdcapr, setusdcapr] = useState("")
  const [deposit, setdeposit] = useState(false)
  const [tokenprice, setTokenprice] = useState(1)
  const [deposittoken, setdeposittokens] = useState(1)
  const [duration, setduration] = useState("")
  const [loading, setLoading] = useState("loading")



  useEffect(() => {
    if (signer?._address) {
      setMyaddress(signer._address)
      setLoading(false);
      fetchmarketprice()
      getAPRInfo()
    } else {
      setLoading("nowallet")
    }
  }, [signer]) // eslint-disable-line react-hooks/exhaustive-deps

  const setdeposittoken = (e) => {
    setdeposittokens(e);
    const url = 'https://cors-digi.herokuapp.com/' + 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=CHO';
    fetch(url, {
      method: "GET",
      withCredentials: true,
      headers: {
        "X-CMC_PRO_API_KEY": "79da1075-a7f3-495e-8285-774af970f7bc",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    })
      .then(resp => resp.json())
      .then(function (data) {
        let marketvalue = data.data[0].quote.USD.price;
        let finaldata = marketvalue * e;
        setTokenprice(finaldata)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const fetchmarketprice = () => {

    const url = 'https://cors-digi.herokuapp.com/' + 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=CHO';
    fetch(url, {
      method: "GET",
      withCredentials: true,
      headers: {
        "X-CMC_PRO_API_KEY": "79da1075-a7f3-495e-8285-774af970f7bc",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    })
      .then(resp => resp.json())
      .then(function (data) {
        setTokenprice(data.data[0].quote.USD.price)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const staking = new ethers.Contract(value.stakingAddress, stakingAbi, signer)
  const token = new ethers.Contract(value.stakingToken, tokenAbi, signer)
  const promocontract = new ethers.Contract(value.promoDeposit, promodeposit, signer);
  const period = 24; const deployperiod = duration;

  async function getAPRInfo() {
    let choaprinfo = await promocontract.aprs(value.chotokenaddress, period);
    let usdtaprinfo = await promocontract.aprs(value.usdttokenaddress, period);
    let usdcaprinfo = await promocontract.aprs(value.usdcokenaddress, period);
    setChoApr(choaprinfo.toString()); setUsdtapr(usdtaprinfo.toString()); setusdcapr(usdcaprinfo.toString())
  }


  async function Deposit() {
    if (tokenprice >= 200) {
      try {
        let depositamount = ethers.utils.parseUnits(tokenprice.toString(), 'ether');
        await token.approve(myaddress, depositamount);
        if (deposit === "cho") {
          try {
            let depositfunction = await promocontract.deposit(value.chotokenaddress, depositamount, deployperiod);
            console.log("Deposit Function=>", depositfunction)
          } catch (err) {
            alert(err.message)
          }
        } else if (deposit === "usdt") {
          try {
            let depositfunction = await promocontract.deposit(value.usdttokenaddress, depositamount, deployperiod);
            console.log("Deposit Function=>", depositfunction)
          } catch (err) {
            alert(err.message)
          }
        } else {
          try {
            let depositfunction = await promocontract.deposit(value.usdctokenaddress, depositamount, deployperiod);
            console.log("Deposit Function=>", depositfunction)
          } catch (err) {
            alert(err.message)
          }
        }
      } catch (err) {
        alert(err.message)
      }
    } else {
      alert("The Minimum Deposited Amount is 200 USD");
    }
  }



  /* eslint-enable no-unused-vars */

  return (
    <div className="App">
      <section className="staking">

        <div className="container">
          <div className="earn-left card earn">
            <div className="floating-card">
              <h1>Promo</h1>
            </div>
            <div className="heading-earn">
              <div className="row earnBoxHead">
                <div>
                  <div class="placeholder"></div>
                </div>
                <div>
                  <h2>CHO</h2>
                </div>
              </div>
            </div>
            <div class="earn-border">
              <hr></hr>
            </div>
            <div class="earn-division">
              <div class="left-earn-division">
                <h2>Min <br></br>Deposit</h2>
              </div>
              <div class="right-earn-division">
                <h2>$200</h2>
              </div>
            </div>
            <div class="earn-border">
              <hr></hr>
            </div>
            <div class="earn-division">
              <div class="left-earn-division">
                <h2>Duration</h2>
              </div>
              <div class="right-earn-division">
                <select className='datepicker' value={duration}
                  onChange={(e) => setduration(e.target.value)}>
                  <option>6 Month</option>
                  <option>12 Month</option>
                  <option>24 Month</option>
                </select>
              </div>
            </div>
            <div class="earn-border">
              <hr></hr>
            </div>
            <div class="earn-division">
              <div class="left-earn-division">
                <h2>Apr</h2>
              </div>
              <div class="right-earn-division highlight">
                <h2>{choapr}%</h2>
              </div>
            </div>

            <div className="user-input">
              <div className="earn-btn">
                <button onClick={() => setdeposit("cho")} className="btn_primary earn-buttons" >Deposit</button>
              </div>
              <div className="info-text">
                <a href="/#" >More Info</a>
              </div>
            </div>
          </div>

          <div className="earn-left card earn">
            <div className="floating-card">
              <h1>Promo</h1>
            </div>
            <div className="heading-earn">
              <div className="row earnBoxHead">
                <div>
                  <div class="placeholder"></div>
                </div>
                <div>
                  <h2>USDT / USDC</h2>
                </div>
              </div>
            </div>
            <div class="earn-border">
              <hr></hr>
            </div>
            <div class="earn-division">
              <div class="left-earn-division">
                <h2>Min <br></br>Deposit</h2>
              </div>
              <div class="right-earn-division">
                <h2>$200</h2>
              </div>
            </div>
            <div class="earn-border">
              <hr></hr>
            </div>
            <div class="earn-division">
              <div class="left-earn-division">
                <h2>Duration</h2>
              </div>
              <div class="right-earn-division">
                <select className='datepicker' value={duration}
                  onChange={(e) => setduration(e.target.value)}>
                  <option value="6">6 Month</option>
                  <option value="12">12 Month</option>
                  <option value="24">24 Month</option>
                </select>
              </div>
            </div>
            <div class="earn-border">
              <hr></hr>
            </div>
            <div class="earn-division">
              <div class="left-earn-division">
                <h2>Apr</h2>
              </div>
              <div class="right-earn-division highlight">
                <h2>{usdtapr}%</h2>
              </div>
            </div>

            <div className="user-input">
              <div className="earn-btn">
                <button onClick={() => setdeposit("usdt")} className="btn_primary earn-buttons" >Deposit</button>
              </div>
              <div className="info-text">
                <a href="/#" >More Info</a>
              </div>
            </div>

          </div>
          <div className="earn-left card earn">
            <div className="floating-card">
              <h1>Promo</h1>
            </div>
            <div className="heading-earn">
              <div className="row earnBoxHead">
                <div>
                  <div class="placeholder"></div>
                </div>
                <div>
                  <h2>Curve IbEUR</h2>
                </div>
              </div>
            </div>
            <div class="earn-border">
              <hr></hr>
            </div>
            <div class="earn-division">
              <div class="left-earn-division">
                <h2>TVL</h2>
              </div>
              <div class="right-earn-division">
                <h2>$2 859 506</h2>
              </div>
            </div>
            <div class="earn-border">
              <hr></hr>
            </div>
            <div class="earn-division">
              <div class="left-earn-division">
                <h2>Volume</h2>
              </div>
              <div class="right-earn-division">
                <h2> -- </h2>
                <br></br><br></br>
              </div>
            </div>
            <div class="earn-border">
              <hr></hr>
            </div>
            <div class="earn-division">
              <div class="left-earn-division">
                <h2>Apr</h2>
              </div>
              <div class="right-earn-division highlight">
                <h2>{usdcapr}%</h2>
              </div>
            </div>

            <div className="user-input">
              <div className="earn-btn">
                <button onClick={() => setdeposit("usdc")} className="btn_primary earn-buttons" >Deposit</button>
              </div>
              <div className="info-text">
                <a href="/#">More Info</a>
              </div>
            </div>

          </div>
        </div>

        {loading === "nowallet" && (
          <div className='popup'>
            <div className='popcontent' style={{ background: 'white' }}>
              <h5><center>Please Connect your wallet to continue</center></h5>
              <p>&nbsp;</p>
              <div className="row wallet-popbutton">
                <center> <ConnectButton className="contact-btn" sx={{ color: '#000000' }} /></center>
              </div>

              <p>&nbsp;</p>
            </div>
          </div>
        )}

        {loading === "loading" && (
          <div className='popup loading'>
            <div className='popcontent'>
              <p>&nbsp;</p>
              <p><center><ClipLoader color="#3C226C" size={40} /></center> </p>
              <p>&nbsp;</p>
            </div>
          </div>
        )}

        {deposit && (
          <div className='popup'>
            <div className='popcontent' style={{ background: 'white' }}>
              <button className='btn-close' onClick={() => setdeposit(false)}>x</button>
              <p>&nbsp;</p>
              <h5><center>Enter Number of Token</center></h5>
              <p>&nbsp;</p>
              <p><center><input type="text"
                onChange={(e) => setdeposittoken(e.target.value)} placeholder="Enter CHO" className="form-control" /></center> </p>
              <p>&nbsp;</p>
              <p><center><h5>Spending ${tokenprice} For <span className='token'>{deposittoken} CHO</span></h5> </center></p>
              <p>&nbsp;</p>
              <center><button onClick={() => Deposit()} className="btn_primary earn-buttons" >Deposit Token</button></center>
            </div>
          </div>
        )}



      </section>

    </div>

  )
}

export default Earn