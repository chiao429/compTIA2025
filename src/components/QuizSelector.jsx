export default function QuizSelector({ quizRanges, setRange, perPage, setPerPage, setPage }) {
  return (
    <div>
      <label>選擇題目範圍：</label>
      {quizRanges.map(range => (
        <button key={range.label} onClick={() => { setRange(range); setPage(1); }}>
          {range.label}
        </button>
      ))}
      <label>每頁顯示：</label>
      <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={0}>不分頁</option>
      </select>
    </div>
  );
}
