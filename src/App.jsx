import React, { useState, useEffect } from 'react';
import QuizSelector from './components/QuizSelector';
import QuizPaginator from './components/QuizPaginator';
import QuizQuestion from './components/QuizQuestion';

const QUIZ_RANGES = [
  { label: '1-50', start: 1, end: 50 },
  { label: '51-100', start: 51, end: 100 },
  { label: '101-128', start: 101, end: 128 },
  { label: '全部', start: 1, end: 128 },
];

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState(QUIZ_RANGES[0]);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  // 新增：集中管理所有作答狀態
  // answerState: { [question_number]: { selected: string, submitted: boolean } }
  const [answerState, setAnswerState] = useState({});

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // 這裡改成 /compTIA.json
        const response = await fetch('/compTIA.json');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Received non-JSON response");
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.questions)) {
          throw new Error('Invalid data format');
        }

        setQuestions(data.questions);
      } catch (e) {
        console.error('Error loading questions:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // 設定瀏覽器分頁標題
  useEffect(() => {
    document.title = "compTIA";
  }, []);

  if (loading) return <div>載入中...</div>;
  if (error) return <div>載入失敗: {error}</div>;
  if (!questions.length) return <div>沒有題目資料</div>;

  // 根據選擇範圍過濾題目
  const filteredQuestions = questions.filter(
    q => Number(q.question_number.replace('Q', '')) >= range.start
      && Number(q.question_number.replace('Q', '')) <= range.end
  );

  // 分頁計算
  const totalPage = perPage === 0 ? 1 : Math.ceil(filteredQuestions.length / perPage);
  const currentQuestions = perPage === 0
    ? filteredQuestions
    : filteredQuestions.slice((page - 1) * perPage, page * perPage);

  // 新增：重新作答功能
  const handleReset = () => {
    setAnswerState({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="quiz-container">
      {/* QuizSelector 與重新作答同一列 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <QuizSelector
          quizRanges={QUIZ_RANGES}
          currentRange={range}
          setRange={setRange}
          perPage={perPage}
          setPerPage={setPerPage}
          setPage={setPage}
        />
        <button
          onClick={handleReset}
          style={{
            marginLeft: 16,
            background: '#ff6666',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6em 1.2em',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          重新作答
        </button>
      </div>
      <h1>CompTIA 測驗系統</h1>
      {currentQuestions.map(q =>
        <QuizQuestion 
          key={q.question_number} 
          question={q}
          answerState={answerState[q.question_number] || { selected: null, submitted: false }}
          setAnswerState={(state) => setAnswerState(prev => ({
            ...prev,
            [q.question_number]: state
          }))}
        />
      )}
      <QuizPaginator
        page={page}
        totalPage={totalPage}
        setPage={setPage}
        perPage={perPage}
      />
      {/* 最下方重新作答按鈕 */}
      <button
        onClick={handleReset}
        style={{
          marginTop: 24,
          background: '#ff6666',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.6em 1.2em',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        重新作答
      </button>
      <button
        className="scroll-to-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 32,
          zIndex: 1000,
          padding: '0.8em 1.5em',
          background: '#646cff',
          color: '#fff',
          border: 'none',
          borderRadius: '50px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
        }}
        aria-label="移到最上"
      >
        ⬆ 最上
      </button>
    </div>
  );
}

export default App;
