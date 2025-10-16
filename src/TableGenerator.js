import React, { useState, useRef } from 'react';

const TableManager = () => {
  const [tableConfigs, setTableConfigs] = useState([]);
  const [numTables, setNumTables] = useState(1);
  const [exportedJSON, setExportedJSON] = useState(null);
  const jsonRef = useRef(null);

  const initializeTables = () => {
    const configs = Array.from({ length: numTables }, () => ({
      rows: 2,
      cols: 2,
      headers: Array(2).fill(''),
      data: Array(2).fill().map(() =>
        Array(2).fill().map(() => [''])
      ),
    }));
    setTableConfigs(configs);
  };

  const updateConfig = (index, key, value) => {
    const updated = [...tableConfigs];
    updated[index][key] = Number(value);
    updated[index].headers = Array(updated[index].cols).fill('');
    updated[index].data = Array(updated[index].rows).fill().map(() =>
      Array(updated[index].cols).fill().map(() => [''])
    );
    setTableConfigs(updated);
  };

  const updateHeader = (tIndex, cIndex, value) => {
    const updated = [...tableConfigs];
    updated[tIndex].headers[cIndex] = value;
    setTableConfigs(updated);
  };

  const updateCell = (tIndex, rIndex, cIndex, nIndex, value) => {
    const updated = [...tableConfigs];
    updated[tIndex].data[rIndex][cIndex][nIndex] = value;
    setTableConfigs(updated);
  };

  const addNestedCell = (tIndex, rIndex, cIndex) => {
    const updated = [...tableConfigs];
    updated[tIndex].data[rIndex][cIndex].push('');
    setTableConfigs(updated);
  };

  const removeNestedCell = (tIndex, rIndex, cIndex, nIndex) => {
    const updated = [...tableConfigs];
    updated[tIndex].data[rIndex][cIndex].splice(nIndex, 1);
    setTableConfigs(updated);
  };

  const addRow = (tIndex) => {
    const updated = [...tableConfigs];
    const newRow = Array(updated[tIndex].cols).fill().map(() => ['']);
    updated[tIndex].data.push(newRow);
    updated[tIndex].rows += 1;
    setTableConfigs(updated);
  };

  const addColumn = (tIndex) => {
    const updated = [...tableConfigs];
    updated[tIndex].headers.push('');
    updated[tIndex].cols += 1;
    updated[tIndex].data = updated[tIndex].data.map((row) => [...row, ['']]);
    setTableConfigs(updated);
  };

  const exportJSON = () => {
    const output = tableConfigs.map((table) => ({
      rows: table.rows,
      columns: table.cols,
      headers: table.headers,
      data: table.data.map((row) =>
        row.map((cell) => [...cell])
      ),
    }));
    setExportedJSON(output);

    setTimeout(() => {
      if (jsonRef.current) {
        jsonRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🧮 Dynamic Table Builder with Nested Cells</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Number of Tables: </label>
        <input
          type="number"
          value={numTables}
          onChange={(e) => setNumTables(Number(e.target.value))}
          style={{ marginRight: '10px' }}
        />
        <button onClick={initializeTables}>Create Tables</button>
      </div>

      {tableConfigs.map((table, tIndex) => (
        <div key={tIndex} style={{ marginBottom: '40px' }}>
          <h3>📋 Table {tIndex + 1}</h3>

          <div style={{ marginBottom: '10px' }}>
            <label>Rows: </label>
            <input
              type="number"
              value={table.rows}
              onChange={(e) => updateConfig(tIndex, 'rows', e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <label>Columns: </label>
            <input
              type="number"
              value={table.cols}
              onChange={(e) => updateConfig(tIndex, 'cols', e.target.value)}
            />
          </div>

          <table border="1" cellPadding="5" style={{ marginTop: '10px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {table.headers.map((header, cIndex) => (
                  <th key={cIndex}>
                    <input
                      value={header}
                      onChange={(e) => updateHeader(tIndex, cIndex, e.target.value)}
                      placeholder={`Header ${cIndex + 1}`}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.data.map((row, rIndex) => (
                <tr key={rIndex}>
                  {row.map((cell, cIndex) => (
                    <td key={cIndex}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                        {cell.map((nested, nIndex) => (
                          <div key={nIndex} style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                              value={nested}
                              onChange={(e) =>
                                updateCell(tIndex, rIndex, cIndex, nIndex, e.target.value)
                              }
                              style={{ marginRight: '4px' }}
                            />
                            <button
                              onClick={() =>
                                removeNestedCell(tIndex, rIndex, cIndex, nIndex)
                              }
                              style={{ marginRight: '6px' }}
                            >
                              −
                            </button>
                          </div>
                        ))}
                        <button onClick={() => addNestedCell(tIndex, rIndex, cIndex)}>+</button>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '10px' }}>
            <button onClick={() => addRow(tIndex)} style={{ marginRight: '10px' }}>
              ➕ Add Row
            </button>
            <button onClick={() => addColumn(tIndex)}>
              ➕ Add Column
            </button>
          </div>
        </div>
      ))}

      <button onClick={exportJSON} style={{ padding: '10px 20px', fontSize: '16px' }}>
        🚀 Export All Tables as JSON
      </button>

      {exportedJSON && (
        <div ref={jsonRef} style={{ marginTop: '30px' }}>
          <h3>📦 Exported JSON Output</h3>
          <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', maxHeight: '400px', overflow: 'auto' }}>
            {JSON.stringify(exportedJSON, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TableManager;
