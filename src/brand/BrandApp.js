import React, { useEffect, useState, useRef } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './style.css';

const host = 'http://localhost:8080';

// 서버에서 데이터를 가져오는 함수
const fetchPageData = async (page, pageSize) => {
  try {
    const response = await axios.get(`${host}/api/v1/brands?page=${page}&size=${pageSize}`);
    return { ...response.data, content: response.data.content };
  } catch (error) {
    console.error(`Error fetching data for page ${page}:`, error);
    return { content: [], totalElements: 0 };
  }
};

function Table() {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState('');
  const [editingBrand, setEditingBrand] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [highlightedRowId, setHighlightedRowId] = useState(null);
  const [message, setMessage] = useState(null); // 메시지 상태 추가
  const pageSize = 10;

  const formRef = useRef(null); // 입력 폼을 참조하기 위한 useRef
  const tableRef = useRef(null); // 테이블 컨테이너를 참조하기 위한 useRef

  useEffect(() => {
    const loadInitialData = async () => {
      const pageData = await fetchPageData(0, pageSize);
      setBrands(pageData.content);
      setTotalRows(pageData.totalElements);
      setLoading(false);
    };

    loadInitialData();

    // 클릭 이벤트 핸들러 등록
    const handleClickOutside = (event) => {
      if (
        tableRef.current && !tableRef.current.contains(event.target) &&
        formRef.current && !formRef.current.contains(event.target)
      ) {
        resetForm();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePageChange = async (page) => {
    const actualPage = page - 1; // API 요청은 0부터 시작
    setCurrentPage(page);
    setLoading(true);

    const pageData = await fetchPageData(actualPage, pageSize);
    setBrands(pageData.content);
    setLoading(false);
    resetForm(); // 페이지 변경 시 입력 폼 초기화
    setHighlightedRowId(null); // 페이지 변경 시 강조 효과 초기화
  };

  const handleRowClicked = (row) => {
    setName(row.name);
    setEditingBrand(row);
    setHighlightedRowId(row.id); // 클릭된 항목을 강조
  };

  const addBrand = async () => {
    try {
      const newBrand = { name };
      const response = await axios.post(`${host}/api/v1/brands`, newBrand);
      setHighlightedRowId(response.data.id); // 추가된 항목을 강조
      setCurrentPage(1); // 첫 번째 페이지로 이동
      fetchBrands(0); // 첫 번째 페이지의 데이터를 가져옴
      resetForm();
      showMessage('Brand added successfully!');
    } catch (error) {
      console.error('Error adding brand:', error);
      showMessage('Error adding brand!');
    }
  };

  const updateBrand = async () => {
    try {
      const updatedBrand = { name };
      await axios.put(`${host}/api/v1/brands/${editingBrand.id}`, updatedBrand);
      setHighlightedRowId(editingBrand.id); // 업데이트된 항목을 강조
      fetchBrands(currentPage - 1);
      showMessage('Brand updated successfully!');
    } catch (error) {
      console.error('Error updating brand:', error);
      showMessage('Error updating brand!');
    }
  };

  const deleteBrand = async (id) => {
    try {
      await axios.delete(`${host}/api/v1/brands/${id}`);
      fetchBrands(currentPage - 1); // 현재 페이지의 데이터를 다시 로딩
      showMessage('Brand deleted successfully!');
    } catch (error) {
      console.error('Error deleting brand:', error);
      showMessage('Error deleting brand!');
    }
  };

  const fetchBrands = async (page) => {
    setLoading(true);
    const pageData = await fetchPageData(page, pageSize);
    setBrands(pageData.content);
    setTotalRows(pageData.totalElements);
    setLoading(false);
  };

  const resetForm = () => {
    setName('');
    setEditingBrand(null);
    setHighlightedRowId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBrand) {
      updateBrand();
    } else {
      addBrand();
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 3000); // 3초 후 메시지 자동 제거
  };

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
      name: 'Actions',
      cell: row => <button onClick={() => deleteBrand(row.id)}>Delete</button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const conditionalRowStyles = [
    {
      when: row => row.id === highlightedRowId,
      style: {
        backgroundColor: 'rgba(63, 195, 128, 0.9)',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  ];

  return (
    <div className="BrandApp">
      <h3>Brand Management</h3>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form" ref={formRef}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="buttons">
            <button type="submit">{editingBrand ? 'Update' : 'Add'}</button>
            {editingBrand && <button onClick={resetForm}>Cancel</button>}
          </div>
        </form>
        <div className="message">{message && <p>{message}</p>}</div> {/* 메시지 출력 */}
      </div>
      <div className="table-container" ref={tableRef}>
        <DataTable
          title="Brands"
          columns={columns}
          data={brands}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          onRowClicked={handleRowClicked}
          paginationPerPage={pageSize}
          progressPending={loading}
          conditionalRowStyles={conditionalRowStyles}
          customStyles={{
            rows: {
              style: {
                height: '60px', // 각 행의 최소 높이를 설정합니다.
              },
            },
            pagination: {
              style: {
                position: 'sticky',
                bottom: '0',
                left: '0',
                right: '0',
                backgroundColor: 'white',
                zIndex: '1',
              },
            },
          }}
          paginationComponentOptions={{
            noRowsPerPage: true,
            selectAllRowsItem: false,
            selectAllRowsItemText: 'All',
          }}
        />
      </div>
    </div>
  );
}

export default Table;
