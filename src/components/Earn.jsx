import React, { useEffect, useState } from 'react'
import "../App.css"
import { useSigner, useProvider } from 'wagmi'
import { ethers } from 'ethers';
import value from '.././value.json'
import stakingAbi from '../stakingAbi.json'
import ClipLoader from "react-spinners/ClipLoader";
import promodeposit from '../promoDeposit.json'
import choAbi from '../choAbi.json'
import usdtAbi from '../usdtAbi.json'
import curveAbi from '../curveAbi.json'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import './Navbar.css';
import toast, { Toaster } from 'react-hot-toast';
import BottomSection from './Bottom-section'
import ICONCOIN from '../components/images/icon-coin.png'
import CURVE from '../components/images/ibeur.jpeg'

const Earn = () => {

  /* eslint-disable no-unused-vars */

  const { data: signer } = useSigner()
  const provider = useProvider();
  const [myaddress, setMyaddress] = useState()
  const [choapr, setChoApr] = useState(0)
  const [usdtapr, setUsdtapr] = useState(0)
  const [usdcapr, setusdcapr] = useState(0)
  const [deposit, setdeposit] = useState(false)
  const [tokenprice, setTokenprice] = useState("Loading.....")
  const [lockedtokens, setLockedtokens] = useState(0)
  const [deposittoken, setdeposittokens] = useState(0)
  const [duration, setduration] = useState("")
  const [open, setopen] = useState("")
  const [loading, setLoading] = useState("loading")
  const [poolInfo, setPoolInfo] = useState()
  const [locktime, setLockTime] = useState(1)
  const [emergencyfee, setEmergencyfee] = useState()
  const [poolsize, setPoolSize] = useState()
  const [maxpool, setMaxPool] = useState(0)
  const [maxContribution, setMaxContribution] = useState(0)
  const [minContribution, setMinContribution] = useState(0)



  useEffect(() => {
    if (signer?._address) {
      setMyaddress(signer._address)
      setLoading(false);
      getAPRInfo();
      getPoolInfo();
      Lockedtokens();
    } else {
      setLoading("nowallet")
    }
  }, [signer]) // eslint-disable-line react-hooks/exhaustive-deps


  async function getPoolInfo() {
    try {
      let rpcUrl = value.rpcURl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let stake_temp = new ethers.Contract(value.stakingAddress, stakingAbi, provider_);
      var _poolInfo = await stake_temp.poolInfo(3);
      console.log("Pool Info: ", _poolInfo);
      console.log("Emergency Fees: ", _poolInfo.emergencyFees.toString());
      const emergencywithdrawfee = await _poolInfo.emergencyFees.toString()
      const currrentpoolsize = await _poolInfo.currentPoolSize.toString()
      const maxcontribution = await _poolInfo.maxContribution.toString()
      const maxcontributionconverted = ethers.utils.formatEther(maxcontribution)
      const minicontribution = await _poolInfo.minContribution.toString()
      const minicontributionconverted = ethers.utils.formatEther(minicontribution)
      const currrentpoolsizeConverted = Math.floor(ethers.utils.formatEther(currrentpoolsize))
      const maxpool = await _poolInfo.maxPoolSize.toString()
      const maxpoolConverted = ethers.utils.formatEther(maxpool)
      const lockDayss = await _poolInfo.lockDays.toString();
      setPoolInfo(_poolInfo);
      setMinContribution(minicontributionconverted)
      setEmergencyfee(emergencywithdrawfee);
      setPoolSize(currrentpoolsizeConverted);
      setLockTime(lockDayss)
      setMaxPool(maxpoolConverted)
      setMaxContribution(maxcontributionconverted)
      console.log("maxpool=>" + maxpoolConverted)
      console.log("current pools=>" + currrentpoolsizeConverted)
    } catch (err) {
      console.log(err.message);
    }

  }

  async function Lockedtokens(props) {
    try {
      let poolId = 3;
      let userAddress = await props.signer.getAddress();
      let _userInfo = await staking.userInfo(poolId, userAddress);
      console.log("my stake token amount: ", ethers.utils.formatEther(_userInfo.amount.toString()));
      setLockedtokens(ethers.utils.formatEther(_userInfo.amount.toString())
      );
    } catch (err) {
      console.log("User error", err);
    }
  }

  const setdeposits = (e) => {
    setdeposit(e)
    setopen(false)
  }

  const setdeposittoken = (e) => {
    setLoading("loading");
    setdeposittokens(e);
    if (deposit === "CURVE") {
      let totalvalue = e * 0.957
      setTokenprice(totalvalue)
      setLoading(false);
    } else {
      let symbol = deposit;
      const url = `${process.env.REACT_APP_CORUS_URL}` + `${process.env.REACT_APP_COINMARKET_ENDPOINT}?amount=1&symbol=${symbol}`;
      fetch(url, {
        method: "GET",
        withCredentials: true,
        headers: {
          "X-CMC_PRO_API_KEY": process.env.REACT_APP_COINMARKETCAP_API,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }
      })
        .then(resp => resp.json())
        .then(function (data) {
          let onetoken = data.data[0].quote.USD.price;
          let total = e / onetoken;
          setTokenprice(total)
          setLoading(false);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }
  }


  const staking = new ethers.Contract(
    value.stakingAddress,
    stakingAbi,
    signer,
  )
  const promocontract = new ethers.Contract(value.promoDeposit, promodeposit, signer);
  const deployperiod = duration;

  async function getAPRInfo() {
    try {
      const periods = 24;
      let choaprinfo = await promocontract.aprs(value.chotokenaddress, periods);
      await choaprinfo.wait()
      let usdtaprinfo = await promocontract.aprs(value.usdttokenaddress, periods);
      let curveaprinfo = await promocontract.aprs(value.curvetokenaddress, periods);
      setChoApr(choaprinfo.toString()); setUsdtapr(usdtaprinfo.toString()); setusdcapr(curveaprinfo.toString())
    } catch (choaprinfo) {
      setChoApr(0); setUsdtapr(0); setusdcapr(0)
      console.log(choaprinfo.reason)
    }


  }




  async function Deposit() {
    if (tokenprice >= 200) {
      let depositamount = ethers.utils.parseUnits(tokenprice.toString(), 'ether');
      try {
        if (deposit === "CHO") {
          try {
            const chotoken = new ethers.Contract(value.chotokenaddress, choAbi, signer)
            await chotoken.approve(myaddress, depositamount);
            let depositfunction = await promocontract.deposit(value.chotokenaddress, depositamount, deployperiod);
            console.log("Deposit Function=>", depositfunction)
            toast.success("Staking Deposit successfully")
          } catch (err) {
            console.log(err.message)
          }
        } else if (deposit === "USDT") {
          try {
            const usdttoken = new ethers.Contract(value.usdttokenaddress, usdtAbi, signer)
            await usdttoken.approve(myaddress, depositamount);
            let depositfunction = await promocontract.deposit(value.usdttokenaddress, depositamount, deployperiod);
            toast.success("Staking Deposit successfully")
            console.log("Deposit Function=>", depositfunction)
          } catch (err) {
            console.log(err.message)
          }
        } else if (deposit === "USDC") {
          try {
            let depositfunction = await promocontract.deposit(value.usdctokenaddress, depositamount, deployperiod);
            toast.success("Staking Deposit successfully")
            console.log("Deposit Function=>", depositfunction)
          } catch (err) {
            console.log("Error=>", err)
          }
        } else {
          try {
            const curvetoken = new ethers.Contract(value.curvetokenaddress, curveAbi, signer)
            await curvetoken.approve(myaddress, depositamount);
            let depositfunction = await promocontract.deposit(value.curvetokenaddress, depositamount, deployperiod);
            toast.success("Staking Deposit successfully")
            console.log("Deposit Function=>", depositfunction)
          } catch (err) {
            console.log(err.message)
          }
        }
      } catch (err) {
        console.log(err.message)
      }
    } else {
      toast.error("The Minimum Deposited Amount is 200 USD");
    }
  }



  /* eslint-enable no-unused-vars */

  return (
    <div className="App">
      <Toaster
        position="top-center"
        duration="50000"
        toastOptions={{
          duration: 5000,
          style: {
            border: '2px solid #19368F',
            padding: '16px 20px',
            color: '#000',
            fontSize: '14px',
          },
          iconTheme: {
            primary: '#19368F',
            secondary: '#fff',
          },
        }}
      />
      <section className="staking">

        <div className="container">
          <div className="earn-left card earn">
            <div className="floating-card">
              <div class="tooltip">  <h1>Promo</h1>
                <span class="tooltiptext">Limited Offer! This is promo activity by neo</span>
              </div>

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
                <button onClick={() => setdeposit("CHO")} className="btn_primary nonactivebutton daysbtn" >Deposit</button>
              </div>
              <div className="info-text">
                <a href="https://noe-global.com/token/" rel="noreferrer" target="_blank">More Info</a>
              </div>
            </div>
          </div>

          <div className='row mobile-only' style={{ width: '100%' }}>
            <BottomSection poolid={0} signer={signer} />
          </div>

          <div className="earn-left card earn">
            <div className="floating-card">
              <div class="tooltip">  <h1>Promo</h1>
                <span class="tooltiptext">Limited Offer! This is promo activity by neo</span>
              </div>
            </div>
            <div className="heading-earn">
              <div className="row earnBoxHead">
                <div>
                  <div>
                    <img src={ICONCOIN} alt="" className="icon-coin" />
                  </div>
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
                <button onClick={() => setopen(true)} className="btn_primary nonactivebutton daysbtn" >Deposit</button>
              </div>
              <div className="info-text">
                <a href="https://noe-global.com/token/" rel="noreferrer" target="_blank">More Info</a>
              </div>
            </div>
          </div>

          <div className='row mobile-only' style={{ width: '100%' }}>
            <BottomSection poolid={1} signer={signer} />
          </div>

          <div className="earn-left card earn">
            <div className="floating-card">
              <div class="tooltip">  <h1>Risky</h1>
                <span class="tooltiptext">This is highest APY Pool over the last 7 Days with TVL more than 1 min and the volume more than 100,000$</span>
              </div>
            </div>
            <div className="heading-earn">
              <div className="row earnBoxHead">
                <div>
                  <div class="placeholder">
                    <img src={CURVE} alt="" className="curveicon" />
                  </div>
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
                <h2>${lockedtokens}</h2>
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
                <button onClick={() => setdeposit("CURVE")} className="btn_primary nonactivebutton daysbtn" >Deposit</button>
              </div>
              <div className="info-text">
                <a href="https://noe-global.com/token/" rel="noreferrer" target="_blank">More Info</a>
              </div>
            </div>
          </div>
          <div className='row mobile-only' style={{ width: '100%' }}>
            <BottomSection poolid={2} signer={signer} />
          </div>
        </div>



        <div className="container new desktop-only">
          <div className="earn-left card earn section-two">
            <BottomSection poolid={0} signer={signer} />
          </div>

          <div className="earn-left card earn section-two">
            <BottomSection poolid={1} signer={signer} />
          </div>

          <div className="earn-left card earn section-two">
            <BottomSection poolid={2} signer={signer} />
          </div>
        </div>


        {loading === "nowallet" && (
          <div className='popup'>
            <div className='popcontent' style={{ background: 'white' }}>
              <h5><center>Please Connect your wallet to continue</center></h5>
              <div className="row wallet-popbutton">
                <center> <ConnectButton className="contact-btn" sx={{ color: '#000000' }} /></center>
              </div>
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
              <h5><center>Enter the amount to be deposited</center></h5>
              <p>&nbsp;</p>
              <p><center><input type="text"
                onChange={(e) => setdeposittoken(e.target.value)} placeholder={`Enter ${deposit}`} className="form-control" /></center> </p>
              <p>&nbsp;</p>
              <p><center><h5>{tokenprice} {deposit} Tokens will be deposited.</h5> </center></p>
              <p>&nbsp;</p>
              <center><button onClick={() => Deposit()} className="btn_primary earn-buttons" >Deposit {deposit}</button></center>
            </div>
          </div>
        )}

        {open && (
          <div className='popup'>
            <div className='popcontent' style={{ background: 'white' }}>
              <button className='btn-close' onClick={() => setopen(false)}>x</button>
              <p>&nbsp;</p>
              <h5><center>Choose Token</center></h5>
              <p>&nbsp;</p>
              <select className='datepicker'
                onChange={(e) => setdeposits(e.target.value)}>
                <option>Choose Token</option>
                <option value="USDT">USDT Token</option>
                <option value="USDC">USDC Token</option>
              </select>
              <p>&nbsp;</p>
            </div>
          </div>
        )}


      </section>

    </div>

  )
}

export default Earn