import React, { useEffect, useState } from 'react'
import "../App.css"
import { useSigner, useProvider } from 'wagmi'
import { ethers } from 'ethers';
import value from '.././value.json'
import tokenAbi from '../tokenAbi.json'
import stakingAbi from '../stakingAbi.json'
import ClipLoader from "react-spinners/ClipLoader";
import promodeposit from '../promoDeposit.json'
import choAbi from '../choAbi.json'
import usdtAbi from '../usdtAbi.json'
import curveAbi from '../curveAbi.json'
import usdcAbi from '../usdcAbi.json'
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
  const [tokenprice, setTokenprice] = useState(0)
  const [userlock, setUserlock] = useState(0)
  const [deposittoken, setdeposittokens] = useState(0)
  const [duration, setduration] = useState("")
  const [open, setopen] = useState("")
  const [loading, setLoading] = useState("loading")

  const [poolId, setPoolId] = useState(1)
  const [poolInfo, setPoolInfo] = useState()
  const [userInfo, setUserInfo] = useState()
  const [walletAddressInfo, setWalletAddressInfo] = useState()
  const [mystakebalance, setMystakeBalance] = useState(0)
  const [amount, setAmount] = useState()
  const [locktime, setLockTime] = useState(1)
  const [unlockTime, setUnlockTime] = useState(1);
  const [emergencyfee, setEmergencyfee] = useState()
  const [poolsize, setPoolSize] = useState()
  const [maxpool, setMaxPool] = useState(0)
  const [reward, setReward] = useState()
  const [myTokenBalance, setMyTokenBalance] = useState(0)
  const [istokenapproved, settokenapproved] = useState(false)
  const [buttonactive1, setButtonactive1] = useState("activebutton")
  const [buttonactive2, setButtonactive2] = useState("")
  const [buttonactive3, setButtonactive3] = useState("")
  const [buttonactive4, setButtonactive4] = useState("")
  const [maxtoken, setMaxToken] = useState(0)
  const [maxContribution, setMaxContribution] = useState(0)
  const [minContribution, setMinContribution] = useState(0)
  const [claimableTokens, setClaimableTokens] = useState(0)
  const [errors, setError] = useState()


  useEffect(() => {
    if (signer?._address) {
      setMyaddress(signer._address)
      setLoading(false);
      getAPRInfo()
      getPoolInfo()
    } else {
      setLoading("nowallet")
    }
  }, [signer]) // eslint-disable-line react-hooks/exhaustive-deps


  async function getPoolInfo() {
    try {
      let rpcUrl = value.rpcURl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let stake_temp = new ethers.Contract(value.stakingAddress, stakingAbi, provider_);
      var _poolInfo = await stake_temp.poolInfo(poolId);
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

      getUserInfo(); getClaimableTokens(); getUserLockTime();
    } catch (err) {
      console.log(err.message);
    }

  }

  async function getUserInfo() {

    try {
      let id = 1715581;
      let address = "0xd3eb6a4a259cb46984573221856a8eb51420ab9f";
      console.log("Pool ID=>" + id, "Address=>", address)
      console.log("Pool Info End Here")
      let _userInfo = await staking.userInfo(id, address);
      console.log("my stake token amount: ", ethers.utils.formatEther(_userInfo.amount.toString()));
      setMystakeBalance(ethers.utils.formatEther(_userInfo.amount.toString()));
    } catch (err) {
      console.log("User error", err);
    }
  }

  async function getClaimableTokens() {
    try {
      let userAddress = await signer.getAddress();
      let _claimableTokens = await staking.claimableRewards(poolId, "0xd5aBcdC9Bf6045684a487Bf49b0112CaCcF1852A");
      console.log("Claimable Tokens: ", _claimableTokens.toString());
      setClaimableTokens(ethers.utils.formatUnits(_claimableTokens, 18).toString());
    } catch (error) {
      console.log("Claimable error", error);
    }
  }

  async function getUserLockTime() {
    try {
      let userAddress = await signer.getAddress()
      let myunlocktime = await staking.getUserLockTime(poolId, "0xd5aBcdC9Bf6045684a487Bf49b0112CaCcF1852A");
      let _wallet = await signer.getAddress();
      let _userInfo = await staking.userInfo(poolId, _wallet);
      let _stakedAmount = ethers.utils.formatEther(_userInfo.amount.toString());

      if (_stakedAmount === 0) {
        setUnlockTime("Not staked yet");
        return;
      }
      let _timestamp = parseInt(myunlocktime.toString()) * 1000;
      let _time = new Date(_timestamp);
      console.log("Unlock Time: ", _time);
      if (_timestamp > 0) setUnlockTime(_time.toString());
      else setUnlockTime("Not staked yet");
    } catch (err) {
      console.log("User error", err);
    }
  }



  const setdeposits = (e) => {
    setdeposit(e)
    setopen(false)
  }

  const setdeposittoken = (e) => {
    setdeposittokens(e);
    if (deposit === "CURVE") {
      let totalvalue = e * 0.957
      setTokenprice(totalvalue)
    } else {
      let symbol = deposit;
      const url = 'https://cors-digi.herokuapp.com/' + `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=${e}&symbol=${symbol}`;
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
  }


  const staking = new ethers.Contract(
    value.stakingAddress,
    stakingAbi,
    signer,
  )
  const promocontract = new ethers.Contract(value.promoDeposit, promodeposit, signer);
  const period = 24; const deployperiod = duration;

  async function getAPRInfo() {
    let choaprinfo = await promocontract.aprs(value.chotokenaddress, period);
    let usdtaprinfo = await promocontract.aprs(value.usdttokenaddress, period);
    let curveaprinfo = await promocontract.aprs(value.curvetokenaddress, period);
    setChoApr(choaprinfo.toString()); setUsdtapr(usdtaprinfo.toString()); setusdcapr(curveaprinfo.toString())

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
          } catch (err) {
            alert(err.message)
          }
        } else if (deposit === "USDT") {
          try {
            const usdttoken = new ethers.Contract(value.usdttokenaddress, usdtAbi, signer)
            await usdttoken.approve(myaddress, depositamount);
            let depositfunction = await promocontract.deposit(value.usdttokenaddress, depositamount, deployperiod);
            console.log("Deposit Function=>", depositfunction)
          } catch (err) {
            alert(err.message)
          }
        } else if (deposit === "USDC") {
          try {
            let depositfunction = await promocontract.deposit(value.usdctokenaddress, depositamount, deployperiod);
            console.log("Deposit Function=>", depositfunction)
          } catch (err) {
            console.log("Error=>", err)
            alert(err.message)
          }
        } else {
          try {
            const curvetoken = new ethers.Contract(value.curvetokenaddress, curveAbi, signer)
            await curvetoken.approve(myaddress, depositamount);
            let depositfunction = await promocontract.deposit(value.curvetokenaddress, depositamount, deployperiod);
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
                <button onClick={() => setdeposit("CHO")} className="btn_primary earn-buttons" >Deposit</button>
              </div>
              <div className="info-text">
                <a href="/#">More Info</a>
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
                <button onClick={() => setopen(true)} className="btn_primary earn-buttons" >Deposit</button>
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
                <h2>$2 859</h2>
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
                <button onClick={() => setdeposit("CURVE")} className="btn_primary earn-buttons" >Deposit</button>
              </div>
              <div className="info-text">
                <a href="/#">More Info</a>
              </div>
            </div>

          </div>
        </div>


        <div className="container new">
          <div className="earn-left card earn section-two">
            <div className="user-input">
              <div className="info-text">
                <p>Total Staking: </p>
              </div>
              <div className="info-text">
                <p>Lock time: </p>
              </div>
            </div>
          </div>

          <div className="earn-left card earn section-two">
            <div className="user-input">
              <div className="info-text">
                <p>Total Staking: </p>
              </div>
              <div className="info-text">
                <p>Lock time: </p>
              </div>
            </div>
          </div>

          <div className="earn-left card earn section-two">
            <div className="user-input">
              <div className="info-text">
                <p>Total Staking: </p>
              </div>
              <div className="info-text">
                <p>Lock time: </p>
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
                onChange={(e) => setdeposittoken(e.target.value)} placeholder={`Enter ${deposit}`} className="form-control" /></center> </p>
              <p>&nbsp;</p>
              <p><center><h5>Spending ${tokenprice.toFixed(2)} For <span className='token'>{deposittoken} {deposit}</span></h5> </center></p>
              <p>&nbsp;</p>
              <center><button onClick={() => Deposit()} className="btn_primary earn-buttons" >Deposit Token</button></center>
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