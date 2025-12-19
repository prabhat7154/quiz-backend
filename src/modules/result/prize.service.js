const Result = require("./result.model");
const { creditWallet } = require("../wallet/wallet.service");

// Default prize distribution
const PRIZE_MAP = {
  1: 500,
  2: 300,
  3: 200
};

exports.distributePrizes = async (quizId) => {

  // Fetch results sorted by score
  const results = await Result.find({ quizId })
    .sort({ score: -1, createdAt: 1 });

  let currentRank = 0;
  let lastScore = null;

  for (let i = 0; i < results.length; i++) {
    const res = results[i];

    // Rank logic (competition ranking)
    if (res.score !== lastScore) {
      currentRank = i + 1;
      lastScore = res.score;
    }

    res.rank = currentRank;

    // Prize logic
    res.prize = PRIZE_MAP[currentRank] || 0;

    await res.save();

    if (res.prize > 0) {
  await creditWallet({
    userId: res.studentId,
    quizId,
    amount: res.prize,
    description: `Prize for rank ${res.rank}`
  });
}
  }

  return results.filter(r => r.prize > 0);
};
