const formatLotteryDate = (lotteryDate: number) => {
  const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  if (!lotteryDate) {
    return {}
  }

  const date = new Date(lotteryDate * 1000)
  const hours = date.getUTCHours()
  const monthAndDay = `${monthName[date.getUTCMonth()]} ${date.getUTCDate()}`

  return { hours, monthAndDay }
}

export default formatLotteryDate
