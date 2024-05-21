
import "./style.css";
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import MiniChart from "react-mini-chart";
import axios from 'axios';

const columns = [
  {
    name: 'ID',
    selector: row => row.id,
    sortable: true,
  },
  {
    name: 'Title',
    selector: row => row.title,
    sortable: true,
  },
  {
    name: 'Completed',
    selector: row => row.completed ? 'Yes' : 'No',
    sortable: true,
  },
  {
    name: "Top 10 Games",
    selector: row => {
      let arrayData = [0, 20, 30, 100];
      
      return <MiniChart className={"p-3 mt-5"} 
      strokeWidth={2}
      activePointRadius={5} 
      width={100}
      dataSet={arrayData} />;
    }
  }
];

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/todos')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
        setLoading(false);
      });
  }, []);

  const handleRowClicked = (row) => {
    console.log(row.title);
  };

  return (
    <div className="App">
      <h1>React Data Table Component Example</h1>
      <DataTable
        title="Player Summary"
        columns={columns}
        data={data}
        defaultSortFieldId
        progressPending={loading}
        pagination={5}
        highlightOnHover
        onRowClicked={handleRowClicked}
      />
      <MiniChart dataSet={[0, -20, 343, 49.3, -100, 200, 78]} />
    </div>
  );
}

export default App;
