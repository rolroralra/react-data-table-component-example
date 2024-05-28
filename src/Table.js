import "./style.css";
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import MiniChart from "react-mini-chart";
import axios from 'axios';
import { getRandomNumber } from './utils/random';

const host = 'http://localhost:8080'

const columns = [
  {
    name: 'ID',
    selector: row => row.id,
    sortable: true,
  },
  {
    name: 'NAME',
    selector: row => row.name,
    sortable: true,
  },
  {
    name: 'BRAND',
    selector: row => row.brandName,
    sortable: true,
  },
  {
    name: 'CATEGORY',
    selector: row => row.categoryName,
    sortable: true,
  },
  {
    name: 'Image',
    cell: row => <img src={process.env.PUBLIC_URL + '/images/' + row.categoryName + '-' + getRandomNumber() +'.webp'} alt="" width={50} />,
    sortable: false,
  },
  {
    name: 'PRICE',
    selector: row => row.price,
    sortable: true,
  },
  {
    name: "인기도",
    selector: row => {
      let arrayData = [getRandomNumber(0, 100), getRandomNumber(0, 100), getRandomNumber(0, 100), getRandomNumber(0, 100)];
      
      return <MiniChart className={"p-3 mt-5"} 
      strokeWidth={2}
      activePointRadius={5} 
      width={100}
      dataSet={arrayData} />;
    }
  }
];

// 서버에서 데이터를 가져오는 함수
const fetchPageData = async (page, pageSize) => {
  try {
    const response = await axios.get(`${host}/api/v1/items?page=${page}&size=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for page ${page}:`, error);
    return { content: [], totalElements: 0 };
  }
};

function Table() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    const loadInitialData = async () => {
      const pageData = await fetchPageData(0, pageSize);
      setItems(pageData.content);
      setTotalRows(pageData.totalElements);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const handlePageChange = async (page) => {
    const actualPage = page - 1; // API 요청은 0부터 시작
    setCurrentPage(page);
    setLoading(true);

    const pageData = await fetchPageData(actualPage, pageSize);
    setItems(pageData.content);
    setLoading(false);
  };

  const handleRowClicked = (row) => {
    console.log(row.title);
  };

  return (
    <div className="App">
      <h1>Item Table</h1>
      <DataTable
        title="Items"
        columns={columns}
        data={items}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        paginationPerPage={pageSize}
        progressPending={loading}
        paginationComponentOptions={{
          noRowsPerPage: true,
          selectAllRowsItem: false,
          selectAllRowsItemText: 'All',
        }}
      />
    </div>
  );
}

export default Table;
