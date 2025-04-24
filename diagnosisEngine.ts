export function runEnhancedPipeline(answers = {}, flags = []) {
  const baseScores = {
    気虚: 0, 血虚: 0, 瘀血: 0, 陰虚: 0, 痰湿: 0, 気滞: 0, 寒証: 0, 熱証: 0
  };

  // 質問に基づくスコアリング
  Object.keys(answers).forEach(id => {
    const value = answers[id];
    if (value === "はい") {
      if (id == 1) baseScores["気虚"] += 2;
      if (id == 2) baseScores["血虚"] += 2;
      if (id == 3) baseScores["瘀血"] += 2;
    }
  });

  // 仮の処方候補リスト（本番ではprescriptions.csvと連携）
  const prescriptions = [
    { name: "補中益気湯", description: "気力体力の低下に", scores: { 気虚: 5 }, contraindications: ["妊娠中"] },
    { name: "四物湯", description: "血虚体質改善に", scores: { 血虚: 5 }, contraindications: [] },
    { name: "桂枝茯苓丸", description: "瘀血改善", scores: { 瘀血: 5 }, contraindications: [] }
  ];

  // 処方マッチング
  const recommendations = prescriptions.map(p => {
    let totalScore = 0;
    Object.entries(p.scores).forEach(([sho, weight]) => {
      totalScore += (baseScores[sho] || 0) * weight;
    });

    // 禁忌考慮
    p.contraindications.forEach(flag => {
      if (flags.includes(flag)) {
        totalScore -= 50; // 禁忌の場合大きく減点
      }
    });

    return { name: p.name, description: p.description, totalScore };
  }).sort((a, b) => b.totalScore - a.totalScore);

  return {
    finalScores: baseScores,
    recommendations,
    rawScores: baseScores,
  };
}
