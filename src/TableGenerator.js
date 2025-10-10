import React, { useState } from 'react';

const TableManager = () => {
  const [tableConfigs, setTableConfigs] = useState([]);
  const [numTables, setNumTables] = useState(1);

  const initializeTables = () => {
    const configs = Array.from({ length: numTables }, () => ({
      rows: 2,
      cols: 2,
      headers: Array(2).fill(''),
      data: Array(2).fill().map(() => Array(2).fill('')),
    }));
    setTableConfigs(configs);
  };

  const updateConfig = (index, key, value) => {
    const updated = [...tableConfigs];
    updated[index][key] = Number(value);
    updated[index].headers = Array(updated[index].cols).fill('');
    updated[index].data = Array(updated[index].rows).fill().map(() =>
      Array(updated[index].cols).fill('')
    );
    setTableConfigs(updated);
  };

  const updateHeader = (tIndex, cIndex, value) => {
    const updated = [...tableConfigs];
    updated[tIndex].headers[cIndex] = value;
    setTableConfigs(updated);
  };

  const updateCell = (tIndex, rIndex, cIndex, value) => {
    const updated = [...tableConfigs];
    updated[tIndex].data[rIndex][cIndex] = value;
    setTableConfigs(updated);
  };

  const exportJSON = () => {
    const output = tableConfigs.map((table) => ({
      headers: table.headers,
      rows: table.data,
    }));
    console.log(JSON.stringify(output, null, 2));
    alert('Exported to console!');
  };

  return (
    <div>
      <h2>Dynamic Table Builder</h2>
      <label>Number of Tables: </label>
      <input
        type="number"
        value={numTables}
        onChange={(e) => setNumTables(Number(e.target.value))}
      />
      <button onClick={initializeTables}>Create Tables</button>

      {tableConfigs.map((table, tIndex) => (
        <div key={tIndex} style={{ marginTop: '30px' }}>
          <h3>Table {tIndex + 1}</h3>
          <label>Rows: </label>
          <input
            type="number"
            value={table.rows}
            onChange={(e) => updateConfig(tIndex, 'rows', e.target.value)}
          />
          <label>Columns: </label>
          <input
            type="number"
            value={table.cols}
            onChange={(e) => updateConfig(tIndex, 'cols', e.target.value)}
          />

          <table border="1" style={{ marginTop: '10px' }}>
            <thead>
              <tr>
                {table.headers.map((header, cIndex) => (
                  <th key={cIndex}>
                    <input
                      value={header}
                      onChange={(e) => updateHeader(tIndex, cIndex, e.target.value)}
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
                      <input
                        value={cell}
                        onChange={(e) =>
                          updateCell(tIndex, rIndex, cIndex, e.target.value)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <button style={{ marginTop: '30px' }} onClick={exportJSON}>
        Export All Tables as JSON
      </button>
    </div>
  );
};

export default TableManager;
