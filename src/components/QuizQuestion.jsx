import React from 'react';

export default function QuizQuestion({ question, onWrongAnswer, answerState, setAnswerState }) {
  const isMultipleChoice = Array.isArray(question.correct_answer);
  
  // 初始化選擇狀態，避免 undefined
  const selected = isMultipleChoice 
    ? (answerState.selected || []) 
    : (answerState.selected || '');
  const submitted = answerState.submitted || false;

  const handleSelect = (k) => {
    if (submitted) return;
    
    if (isMultipleChoice) {
      // 複選題處理：新增或移除選項
      const newSelection = selected.includes(k)
        ? selected.filter(s => s !== k)
        : [...selected, k];
      setAnswerState({
        selected: newSelection,
        submitted: false
      });
    } else {
      // 單選題處理
      setAnswerState({
        selected: k,
        submitted: true
      });
      if (k !== question.correct_answer && onWrongAnswer) {
        onWrongAnswer(question.question_number);
      }
    }
  };

  const checkAnswer = () => {
    if (!selected || selected.length === 0) return false;
    if (isMultipleChoice) {
      const sortedSelected = [...selected].sort();
      const sortedCorrect = [...question.correct_answer].sort();
      return sortedSelected.length === sortedCorrect.length && 
             sortedSelected.every((v, i) => v === sortedCorrect[i]);
    }
    return selected === question.correct_answer;
  };

  const handleSubmit = () => {
    if (!selected || selected.length === 0 || submitted) return;
    
    const isCorrect = checkAnswer();
    setAnswerState({
      selected,
      submitted: true
    });

    if (!isCorrect && onWrongAnswer) {
      onWrongAnswer(question.question_number);
    }
  };

  return (
    <div style={{ border: '1px solid #eee', margin: 8, padding: 8 }}>
      <div>
        <strong>{question.question_number}.</strong> {question.question}
        {isMultipleChoice && <span style={{color: 'blue'}}> (複選題)</span>}
      </div>
      {Object.entries(question.options).map(([k, v]) =>
        <div key={k}>
          <label>
            <input
              type={isMultipleChoice ? "checkbox" : "radio"}
              name={question.question_number}
              value={k}
              disabled={submitted}
              checked={isMultipleChoice ? selected.includes(k) : selected === k}
              onChange={() => handleSelect(k)}
            />
            {k}. {v}
          </label>
        </div>
      )}
      {isMultipleChoice && !submitted && selected.length > 0 &&
        <button onClick={handleSubmit}>提交答案</button>
      }
      {submitted &&
        <div>
          {checkAnswer()
            ? <span style={{ color: 'green' }}>✔ 正確！</span>
            : (
              <span style={{ color: 'red' }}>
                ✘ 錯誤，正確答案為：{isMultipleChoice 
                  ? question.correct_answer.join(', ')
                  : question.correct_answer}<br />
                {question.explanation && <div>解析：{question.explanation}</div>}
              </span>
            )
          }
        </div>
      }
    </div>
  );
}
