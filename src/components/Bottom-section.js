import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import stakingAbi from '../stakingAbi.json'
import value from '.././value.json'


function BottomSection(props) {

    const [claimableTokensone, setClaimableTokens] = useState(0);
    const [unlocktime, setUnlockTime] = useState(0);
    const [balance, setMystakeBalance] = useState(0);

    useEffect(() => {
        getClaimableTokensone(props)
        getUserLockTime(props)
        getUserInfo(props)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    const staking = new ethers.Contract(
        value.stakingAddress,
        stakingAbi,
        props.signer,
    )


    async function getClaimableTokensone(props) {
        try {
            let userAddress = await props.signer.getAddress();
            let poolId = props.poolid;
            let _claimableTokens = await staking.claimableRewards(poolId, userAddress);
            console.log("Claimable Tokens zero: ", _claimableTokens.toString());
            setClaimableTokens(ethers.utils.formatUnits(_claimableTokens, 18).toString());
        } catch (error) {
            console.log("Claimable error", error);
        }
    }

    async function getUserLockTime(props) {
        try {
            let poolId = props.poolid;
            let userAddress = await props.signer.getAddress();
            let myunlocktime = await staking.getUserLockTime(poolId, userAddress);
            let _wallet = await props.signer.getAddress();
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


    async function getUserInfo(props) {
        try {
            let poolId = props.poolid;
            let userAddress = await props.signer.getAddress();
            let _userInfo = await staking.userInfo(poolId, userAddress);
            console.log("my stake token amount: ", ethers.utils.formatEther(_userInfo.amount.toString()));
            setMystakeBalance(ethers.utils.formatEther(_userInfo.amount.toString()));
        } catch (err) {
            console.log("User error", err);
        }
    }


    return (
        <>
            <div className="earn-left card earn section-two bottom-section" style={{ boxShadow: 'none' }}>
                <div className="user-input">
                    <div className="info-text">
                        <p>Total Staking: {balance}</p>
                    </div>
                    <div className="info-text">
                        <p>Un Lock time: <br />{unlocktime}</p>
                    </div>
                    <div className="info-text">
                        <p>Claimable Reward: {claimableTokensone}</p>
                    </div>
                    <p>&nbsp;</p>
                    <div className="earn-btn">
                        <button className="btn_primary nonactivebutton activebutton daysbtn">Claim Rewards</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default BottomSection;