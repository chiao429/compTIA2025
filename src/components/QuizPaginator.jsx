export default function QuizPaginator({ page, totalPage, setPage, perPage }) {
  if (perPage === 0) return null;
  return (
    <div>
      <button disabled={page <= 1} onClick={() => setPage(page - 1)}>上一頁</button>
      <span>{page} / {totalPage}</span>
      <button disabled={page >= totalPage} onClick={() => setPage(page + 1)}>下一頁</button>
    </div>
  );
}
