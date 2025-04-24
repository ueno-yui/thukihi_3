import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { runEnhancedPipeline } from "../diagnosisEngine";
import questionsData from "../questions.json";

export default function QuestionForm() {
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const navigate = useNavigate();

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleFlag = (name) => {
    setFlags(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = () => {
    const result = runEnhancedPipeline(answers, flags);
    navigate("/result", { state: { result } });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">体質診断 質問フォーム</h1>

      <div className="space-y-6">
        {questionsData.sections.map(section => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
            {section.questions.map(q => (
              <div key={q.id} className="bg-white p-4 rounded shadow mb-4">
                <p className="font-medium mb-2">{q.text}</p>
                <div className="flex gap-4">
                  <label>
                    <input type="radio" name={`q-${q.id}`} value="はい" onChange={() => handleAnswer(q.id, "はい")} /> はい
                  </label>
                  <label>
                    <input type="radio" name={`q-${q.id}`} value="いいえ" onChange={() => handleAnswer(q.id, "いいえ")} /> いいえ
                  </label>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="bg-white p-4 rounded shadow">
          <p className="font-medium mb-2">禁忌チェック</p>
          <div className="flex flex-wrap gap-4">
            <label><input type="checkbox" onChange={() => handleFlag("妊娠中")} /> 妊娠中</label>
            <label><input type="checkbox" onChange={() => handleFlag("高血圧")} /> 高血圧</label>
            <label><input type="checkbox" onChange={() => handleFlag("肝機能障害")} /> 肝機能障害</label>
          </div>
        </div>

        <button onClick={handleSubmit} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded font-semibold">
          診断スタート
        </button>
      </div>
    </div>
  );
}
