import React, { useEffect, useState } from 'react'
import "../App.css"
import { useSigner, useProvider } from 'wagmi'
import { ethers } from 'ethers';
import value from '.././value.json'
import tokenAbi from '../tokenAbi.json'
import stakingAbi from '../stakingAbi.json'
import ClipLoader from "react-spinners/ClipLoader";
import promodeposit from '../promoDeposit.json'
import './Navbar.css';



const Earn = () => {

  /* eslint-disable no-unused-vars */

  const { data: signer } = useSigner()
  const provider = useProvider();
  const [myaddress, setMyaddress] = useState()
  const [choapr, setChoApr] = useState("")
  const [usdtapr, setUsdtapr] = useState("")
  const [usdcapr, setusdcapr] = useState("")
  const [loading, setLoading] = useState("loading")



  useEffect(() => {
    if (signer?._address) {
      setMyaddress(signer._address)
      setLoading(false);
      getAPRInfo()
    } else {
      setLoading("nowallet")
    }
  }, [signer]) // eslint-disable-line react-hooks/exhaustive-deps

  console.log("My Address", myaddress);

  async function getAPRInfo() {
    const promocontract = new ethers.Contract(value.promoDeposit, promodeposit, signer)
    const period = 24;
    let choaprinfo = await promocontract.aprs(value.chotokenaddress, period);
    let usdtaprinfo = await promocontract.aprs(value.usdttokenaddress, period);
    let usdcaprinfo = await promocontract.aprs(value.usdcokenaddress, period);
    setChoApr(choaprinfo.toString()); setUsdtapr(usdtaprinfo.toString()); setusdcapr(usdcaprinfo.toString())

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
                <h2>{choapr}%</h2>
              </div>
            </div>

            <div className="user-input">
              <div className="earn-btn">
                <button className="btn_primary earn-buttons" >Deposit</button>
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
                <h2>{usdtapr}%</h2>
              </div>
            </div>

            <div className="user-input">
              <div className="earn-btn">
                <button className="btn_primary earn-buttons" >Deposit</button>
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
                <button className="btn_primary earn-buttons" >Deposit</button>
              </div>
              <div className="info-text">
                <a href="/#">More Info</a>
              </div>
            </div>

          </div>
        </div>

        {loading == "nowallet" && (
          <div className='popup'>
            <div className='popcontent'>
              <h5><center>Please Connect your wallet to continue</center></h5>
              <p>&nbsp;</p>
              <p><center><ClipLoader color="#3C226C" size={40} /></center> </p>
              <p>&nbsp;</p>
              <center><button onClick={() => setLoading(false)} className="btn_primary earn-buttons" >Connecting Wallet</button></center>
            </div>
          </div>
        )}

        {loading == "loading" && (
          <div className='popup'>
            <div className='popcontent'>
              <p>&nbsp;</p>
              <p><center><ClipLoader color="#3C226C" size={40} /></center> </p>
              <p>&nbsp;</p>
            </div>
          </div>
        )}
      </section>

    </div>

  )
}

export default Earn