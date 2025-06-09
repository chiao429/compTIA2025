import React from 'react';

export default function QuizQuestion({ question, onWrongAnswer, answerState, setAnswerState }) {
  // 由 props 控制 selected/submitted
  const selected = answerState.selected;
  const submitted = answerState.submitted;

  const correct = Array.isArray(question.correct_answer)
    ? question.correct_answer.sort().join()
    : question.correct_answer;

  const handleSelect = (k) => {
    if (submitted) return;
    setAnswerState({ selected: k, submitted: true });
    if (k !== correct && onWrongAnswer) {
      onWrongAnswer(question.question_number);
    }
  };

  return (
    <div style={{ border: '1px solid #eee', margin: 8, padding: 8 }}>
      <div>
        <strong>{question.question_number}.</strong> {question.question}
      </div>
      {Object.entries(question.options).map(([k, v]) =>
        <div key={k}>
          <label>
            <input
              type="radio"
              name={question.question_number}
              value={k}
              disabled={submitted}
              checked={selected === k}
              onChange={() => handleSelect(k)}
            />
            {k}. {v}
          </label>
        </div>
      )}
      {submitted &&
        <div>
          {selected === correct
            ? <span style={{ color: 'green' }}>✔ 正確！</span>
            : (
              <span style={{ color: 'red' }}>
                ✘ 錯誤，正確答案為：{correct}<br />
                {question.explanation && <div>解析：{question.explanation}</div>}
              </span>
            )
          }
        </div>
      }
    </div>
  );
}
