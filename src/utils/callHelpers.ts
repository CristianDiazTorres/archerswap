import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

export const approve = async (lpContract, masterChefContract, account, gasBoostedPrice) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account, gasPrice: gasBoostedPrice })
}

export const approveVault = async (lpContract, archerswapVaultContract, account, gasBoostedPrice) => {
  return lpContract.methods
    .approve(archerswapVaultContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account, gasPrice: gasBoostedPrice })
}

export const stake = async (masterChefContract, pid, amount, account, gasBoostedPrice, decimals = 18) => {
  // if (pid === 0) {
  //   return masterChefContract.methods
  //     .enterStaking(
  //       new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
  //     )
  //     .send({ from: account })
  //     .on('transactionHash', (tx) => {
  //       return tx.transactionHash
  //     })
  // }

  return masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    )
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStake = async (sousChefContract, amount, decimals = 18, account, gasBoostedPrice) => {
  return sousChefContract.methods
    .deposit(
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    )
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStakeBnb = async (sousChefContract, amount, account, gasBoostedPrice) => {
  return sousChefContract.methods
    .deposit()
    .send({
      from: account,
      gasPrice: gasBoostedPrice,
      value: new BigNumber(amount).times(new BigNumber(10).pow(18)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account, gasBoostedPrice, decimals = 18) => {
  // if (pid === 0) {
  //   return masterChefContract.methods
  //     .leaveStaking(
  //       new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
  //     )
  //     .send({ from: account })
  //     .on('transactionHash', (tx) => {
  //       return tx.transactionHash
  //     })
  // }

  return masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    )
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousUnstake = async (sousChefContract, amount, decimals = 18, account, gasBoostedPrice) => {
  // shit code: hard fix for old CTK and BLK
  if (sousChefContract.options.address === '0xFD919978845247e147364F0A1f1565AAC4Fcd472') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account, gasPrice: gasBoostedPrice })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  if (sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account, gasPrice: gasBoostedPrice })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  if (sousChefContract.options.address === '0x8825a44182b94641f9299C32EF44D21235563EF7') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account, gasPrice: gasBoostedPrice })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return sousChefContract.methods
    .withdraw(
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    )
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account, gasBoostedPrice) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const harvest = async (masterChefContract, pid, account, gasBoostedPrice) => {
  // if (pid === 0) {
  //   return masterChefContract.methods
  //     .leaveStaking('0')
  //     .send({ from: account, gasPrice: gasBoostedPrice })
  //     .on('transactionHash', (tx) => {
  //       return tx.transactionHash
  //     })
  // }

  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvest = async (sousChefContract, account, gasBoostedPrice) => {
  return sousChefContract.methods
    .deposit('0')
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvestBnb = async (sousChefContract, account, gasBoostedPrice) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, value: new BigNumber(0), gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const harvestVault = async (archerswapStrategyContract, account, gasBoostedPrice) => {
  return archerswapStrategyContract.methods
    .harvest()
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const stakeVault = async (
  isCORE,
  archerswapVaultContract,
  amount,
  account,
  depositAll,
  gasBoostedPrice,
  decimals = 18,
) => {
  if (depositAll && !isCORE) {
    return archerswapVaultContract.methods
      .depositAll()
      .send({ from: account, gasPrice: gasBoostedPrice })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  if (isCORE) {
    return archerswapVaultContract.methods
      .depositBNB()
      .send({
        from: account,
        value: new BigNumber(amount)
          .times(new BigNumber(10).pow(decimals))
          .integerValue(BigNumber.ROUND_FLOOR)
          .toString(),
        gasPrice: gasBoostedPrice,
      })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  return archerswapVaultContract.methods
    .deposit(
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    )
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const unstakeVault = async (
  isCORE,
  archerswapVaultContract,
  amount,
  account,
  withdrawAll,
  gasBoostedPrice,
  decimals = 18,
) => {
  if (withdrawAll && !isCORE) {
    return archerswapVaultContract.methods
      .withdrawAll()
      .send({ from: account, gasPrice: gasBoostedPrice })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  if (withdrawAll && isCORE) {
    return archerswapVaultContract.methods
      .withdrawAllBNB()
      .send({ from: account, gasPrice: gasBoostedPrice })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  const pricePerFullShareWei = await archerswapVaultContract.methods.getPricePerFullShare().call()
  const shares = new BigNumber(amount).times(new BigNumber(10).pow(decimals)).div(pricePerFullShareWei).toString()
  if (isCORE) {
    return archerswapVaultContract.methods
      .withdrawBNB(
        new BigNumber(shares).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
      )
      .send({ from: account, gasPrice: gasBoostedPrice })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return archerswapVaultContract.methods
    .withdraw(
      new BigNumber(shares).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString(),
    )
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const buyTickets = async (
  lotteryContract,
  lotteryId,
  ticketAmount,
  ticketPrice,
  ticketNumbers,
  account,
  gasBoostedPrice,
  lotteryType,
) => {
  return lotteryContract.methods
    .batchBuyLottoTicket(lotteryId, ticketAmount, ticketNumbers)
    .send({
      from: account,
      gasPrice: gasBoostedPrice,
      value: lotteryType === 'core' ? new BigNumber(ticketPrice).times(1e18).toString(10) : undefined,
    })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const claimReward = async (lotteryContract, lotteryId, ticketIds, account, gasBoostedPrice) => {
  return lotteryContract.methods
    .batchClaimRewards(lotteryId, ticketIds)
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const xbowStake = async (xbowContract, amount, account, gasBoostedPrice, decimals = 18) => {
  return xbowContract.methods
    .enter(new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString())
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const xbowUnstake = async (xbowContract, amount, account, gasBoostedPrice, decimals = 18) => {
  return xbowContract.methods
    .leave(new BigNumber(amount).times(new BigNumber(10).pow(decimals)).integerValue(BigNumber.ROUND_FLOOR).toString())
    .send({ from: account, gasPrice: gasBoostedPrice })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
