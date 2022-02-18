import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function loadServerRows(page, pageSize, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.rows.slice(page * pageSize, (page + 1) * pageSize));
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

export default function App() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    console.log(`updating rows: page: ${page}, pageSize: ${pageSize}`)
    let active = true;

    (async () => {
      setLoading(true);
      const newRows = await loadServerRows(page, pageSize, data);

      if (!active) {
        return;
      }

      setRows(newRows);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [page, pageSize, data]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 15]}
        onPageSizeChange={
          (newPageSize) => {
            setPageSize(newPageSize);
          }
        }
        rowCount={100}
        paginationMode="server"
        onPageChange={
          (newPage) => {
            setPage(newPage);
          }
        }
        loading={loading}
        pagination
        rows={rows}
        columns={data.columns}
      />
    </div>
  );
}
