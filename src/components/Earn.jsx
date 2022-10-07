import React, { useEffect, useState } from 'react'
import "../App.css"
import { useSigner, useProvider } from 'wagmi'
import { ethers } from 'ethers';
import value from '.././value.json'
import tokenAbi from '../tokenAbi.json'
import stakingAbi from '../stakingAbi.json'
import './Navbar.css';



const Earn = () => {

  /* eslint-disable no-unused-vars */

  const [isOpen, setOpen] = useState(false);
  const [active, setActive] = useState("-1");

  const handleClick = (event) => {
    setActive(event.target.id);
  };

  const [apy, setApy] = useState(10);
  const { data: signer, isError, isLoading } = useSigner()
  const provider = useProvider();

  const staking = new ethers.Contract(
    value.stakingAddress,
    stakingAbi,
    signer,
  )
  const token = new ethers.Contract(
    value.stakingToken,
    tokenAbi,
    signer,
  )
  //current token is DCU Testnet
  //token address - 0xC6dFc0F5D0Cdd26c1e3f169e66745488a06Cd0b7
  // busd address - 0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7

  const [poolId, setPoolId] = useState(0)
  const [poolInfo, setPoolInfo] = useState()
  const [userInfo, setUserInfo] = useState()
  const [walletAddressInfo, setWalletAddressInfo] = useState()
  const [mystakebalance, setMystakeBalance] = useState(0)
  const [amount, setAmount] = useState()
  const [myaddress, setMyaddress] = useState()
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
    getPoolInfo()
    refreshData(signer)

  }, [signer, poolId, claimableTokens]) // eslint-disable-line react-hooks/exhaustive-deps

  function refreshData(signer) {

    if (signer) {
      signer.getAddress().then((res) => { setMyaddress(res) })
      getUserInfo()
      getUserLockTime()
      getTokenBalance()
      getWhiteListAddresses()
      checkApproved()
      getClaimableTokens()
    }
  }


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
      console.log("maxpool" + maxpoolConverted)
      console.log("current pools" + currrentpoolsizeConverted)


    } catch (err) {
      console.log(err.message);
    }
  }

  async function getUserInfo() {

    try {
      let _userInfo = await staking.userInfo(poolId, signer.getAddress());
      console.log("my stake token amount: ", ethers.utils.formatEther(_userInfo.amount.toString()));
      setMystakeBalance(ethers.utils.formatEther(_userInfo.amount.toString()));
    } catch (err) {
      console.log("User error", err);
    }
  }

  async function getClaimableTokens() {
    try {
      let userAddress = await signer.getAddress();
      let _claimableTokens = await staking.claimableRewards(poolId, userAddress);
      console.log("Claimable Tokens: ", _claimableTokens.toString());
      setClaimableTokens(ethers.utils.formatUnits(_claimableTokens, 18).toString());
    } catch (error) {
      console.log("Claimable error", error);
    }
  }

  async function getUserLockTime() {
    try {
      let userAddress = await signer.getAddress()
      let myunlocktime = await staking.getUserLockTime(poolId, userAddress);
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

  async function getTokenBalance() {
    let userAddress = await signer.getAddress()
    const tokenbalance = await token.balanceOf(userAddress);
    const tokenbalanceConverted = ethers.utils.formatEther(tokenbalance.toString())
    console.log("My Token Balance -", ethers.utils.formatEther(tokenbalance.toString()))
    setMyTokenBalance(Math.floor(tokenbalanceConverted))
  }

  const checkApproved = async () => {
    let userAddress = await signer.getAddress()
    const isApproved = await token.allowance(userAddress, value.stakingAddress);
    const totaltokenapproved = isApproved.toString()
    if (totaltokenapproved.length > 2) {
      console.log("approved", totaltokenapproved);
      settokenapproved(true)
    }
    else {
      console.log("Not Approved", totaltokenapproved);
      settokenapproved(false)

    }
  }

  async function getWhiteListAddresses() {
    try {
      let userAddress = await signer.getAddress()
      let _wlInfo = await staking.whitelistedAddress(poolId, userAddress);
      console.log("Whitelist Info: ", _wlInfo);
      setWalletAddressInfo(_wlInfo);
    } catch (err) {
      console.log("User error", err);
    }
  }

  async function stakeTokens() {
    // if(walletAddressInfo){
    try {
      if (amount === undefined) {
        alert("Enter Amount First")
      }
      else {
        await approve()
        let _amount = ethers.utils.parseEther(amount.toString());
        // console.log (_amount)
        let tx = await staking.stakeTokens(poolId, _amount);
        let reciept = await tx.wait();
        console.log("Stake Tx Receipt: ", reciept);
        refreshData(signer)
      }
    } catch (error) {
      console.log(error);
      try {
        setError(error.error.data.message)
      } catch {
        setError("Something went wrong, please try again!")
      }
    }
    // }
    // else{
    //   alert('Your Wallet Is Not Witelisted For Staking')
    // }
  }
  async function claimtoken() {
    try {
      let tx = await staking.claimRewards(poolId);
      let reciept = await tx.wait();
      console.log("ClaimToken: ", reciept);
      refreshData(signer)
    }
    catch (error) {
      console.log(error);
      try {
        setError(error.error.data.message)
      } catch {
        setError("Something went wrong, please try again!")
      }
    }

  }

  async function unstakeTokens() {
    try {
      let tx = await staking.unstakeTokens(poolId);
      let reciept = await tx.wait();
      console.log("Unstake Tx Receipt: ", reciept);
      refreshData(signer)
    } catch (error) {
      console.log(error);
      try {
        setError(error.error.data.message)
      } catch {
        setError("Something went wrong, please try again!")
      }
    }
  }

  async function emergencyWithdraw() {
    try {
      const _staking = new ethers.Contract(
        value.stakingAddress,
        stakingAbi,
        signer,
      )

      let tx = await _staking.emergencyWithdraw(poolId);
      let reciept = await tx.wait();
      console.log("Emergency Withdraw Tx Receipt: ", reciept);
    } catch (error) {
      console.log("emergency withdraw error", error.error);
      try {
        setError(error.error.data.message)
      } catch {
        setError("Something went wrong, please try again!")
      }

    }
  }

  async function approve() {
    if (!istokenapproved) {
      console.log('Not Approved')
      try {
        let _amount = ethers.utils.parseEther("10000000000000000000");
        let tx = await token.approve(value.stakingAddress, _amount);
        let reciept = await tx.wait();
        console.log("Approve Tx Receipt: ", reciept);
      } catch (error) {
        console.log(error);
        // alert(error.data.message);
      }
    }
    else {
      console.log('already approved')
    }

  }



  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "tokenAmount") {
      console.log(value)
      setAmount(value);
      setMaxToken(value)
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
              <div className="row">
                <div className="column" style={{ width: '150px' }}>
                  <div class="placeholder"></div>
                </div>
                <div className="column" style={{ width: '200px' }}>
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
                <h2>6/12/12 <br></br>Months</h2>
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
                <h2>26%</h2>
              </div>
            </div>

            <div className="user-input">
              <div className="earn-btn">
                <button className="btn_primary earn-buttons" onClick={stakeTokens}>Deposit</button>
              </div>
              <div className="info-text">
                <a href="/#" onClick={stakeTokens}>More Info</a>
              </div>
            </div>
          </div>

          <div className="earn-left card earn">
            <div className="floating-card-two">
              <h1>Promo</h1>
            </div>
            <div className="heading-earn">
              <div className="row">
                <div className="column" style={{ width: '86px' }}>
                  <div class="placeholder"></div>
                </div>
                <div className="column" style={{ width: '290px' }}>
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
                <h2>6/12/12 <br></br>Months</h2>
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
                <h2>16%</h2>
              </div>
            </div>

            <div className="user-input">
              <div className="earn-btn">
                <button className="btn_primary earn-buttons" onClick={stakeTokens}>Deposit</button>
              </div>
              <div className="info-text">
                <a href="/#" onClick={stakeTokens}>More Info</a>
              </div>
            </div>

          </div>
          <div className="earn-left card earn">
            <div className="floating-card-three">
              <h1>Promo</h1>
            </div>
            <div className="heading-earn">
              <div className="row">
                <div className="column" style={{ width: '86px' }}>
                  <div class="placeholder"></div>
                </div>
                <div className="column" style={{ width: '290px' }}>
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
                <h2>15.35%</h2>
              </div>
            </div>

            <div className="user-input">
              <div className="earn-btn">
                <button className="btn_primary earn-buttons" onClick={stakeTokens}>Deposit</button>
              </div>
              <div className="info-text">
                <a href="/#" onClick={stakeTokens}>More Info</a>
              </div>
            </div>

          </div>

        </div>

      </section>

    </div>

  )
}

export default Earn