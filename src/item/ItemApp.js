import React, { useEffect, useState, useRef } from 'react';
import DataTable from 'react-data-table-component';
import MiniChart from "react-mini-chart";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getRandomNumber } from '../utils/random';
import { getApiUrl } from '../utils/apiUrl';
import './style.css';

const host = getApiUrl();

// 서버에서 데이터를 가져오는 함수
const fetchPageData = async (page, pageSize) => {
  try {
    const response = await axios.get(`${host}/api/v1/items?page=${page}&size=${pageSize}`);
    const data = response.data.content.map(item => ({
      ...item,
      imageUrl: `${process.env.PUBLIC_URL}/images/${item.categoryName}-${item.id % 3 + 1}.webp`,
      popularity: [getRandomNumber(0, 100), getRandomNumber(0, 100), getRandomNumber(0, 100), getRandomNumber(0, 100)]
    }));
    return { ...response.data, content: data };
  } catch (error) {
    console.error(`Error fetching data for page ${page}:`, error);
    return { content: [], totalElements: 0 };
  }
};

const fetchBrands = async () => {
  try {
    const response = await axios.get(`${host}/api/v1/brands/all`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching brands:`, error);
    return [];
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${host}/api/v1/categories/all`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching categories:`, error);
    return [];
  }
};

function Table() {
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brandMap, setBrandMap] = useState({});
  const [categoryMap, setCategoryMap] = useState({});
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState('');
  const [brandName, setBrandName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [price, setPrice] = useState('');
  const [editingItem, setEditingItem] = useState(null);
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
      setItems(pageData.content);
      setTotalRows(pageData.totalElements);
      setLoading(false);
    };

    const loadBrands = async () => {
      const brandsData = await fetchBrands();
      setBrands(brandsData);

      const brandMapping = {};
      brandsData.forEach(brand => {
        brandMapping[brand.name] = brand.id;
      });
      setBrandMap(brandMapping);
    };

    const loadCategories = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);

      const categoryMapping = {};
      categoriesData.forEach(category => {
        categoryMapping[category.name] = category.id;
      });
      setCategoryMap(categoryMapping);
    };

    loadInitialData();
    loadBrands();
    loadCategories();

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
    setItems(pageData.content);
    setLoading(false);
    resetForm(); // 페이지 변경 시 입력 폼 초기화
    setHighlightedRowId(null); // 페이지 변경 시 강조 효과 초기화
  };

  const handleRowClicked = (row) => {
    setName(row.name);
    setBrandId(brandMap[row.brandName]);
    setBrandName(row.brandName);
    setCategoryId(categoryMap[row.categoryName]);
    setCategoryName(row.categoryName);
    setPrice(row.price);
    setEditingItem(row);
    setHighlightedRowId(row.id); // 클릭된 항목을 강조
  };

  const handleDeleteButtonClicked = (row) => {
    deleteItem(row.id);
    setEditingItem(null);
    setName(row.name);
    setBrandId(brandMap[row.brandName]);
    setBrandName(row.brandName);
    setCategoryId(categoryMap[row.categoryName]);
    setCategoryName(row.categoryName);
    setPrice(row.price);
  };

  const handleBrandChange = (e) => {
    const selectedBrandName = e.target.value;
    setBrandName(selectedBrandName);
    setBrandId(brandMap[selectedBrandName]);
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryName = e.target.value;
    setCategoryName(selectedCategoryName);
    setCategoryId(categoryMap[selectedCategoryName]);
  };

  const handleBrandFocus = async () => {
    const brandsData = await fetchBrands();
    setBrands(brandsData);

    const brandMapping = {};
    brandsData.forEach(brand => {
      brandMapping[brand.name] = brand.id;
    });
    setBrandMap(brandMapping);
  };

  const handleCategoryFocus = async () => {
    const categoryData = await fetchCategories();
    setCategories(categoryData);

    const categoryMapping = {};
    categoryData.forEach(category => {
      categoryMapping[category.name] = category.id;
    });
    setCategoryMap(categoryMapping);
  };

  const addItem = async () => {
    try {
      const newItem = { name, brandId, categoryId, price };
      const response = await axios.post(`${host}/api/v1/items`, newItem);
      setHighlightedRowId(response.data.id); // 추가된 항목을 강조
      setCurrentPage(1); // 첫 번째 페이지로 이동
      fetchItems(0); // 첫 번째 페이지의 데이터를 가져옴
      resetForm();
      showMessage('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      showMessage(`Error adding item! [${error.message}]`);
    }
  };

  const updateItem = async () => {
    try {
      const updatedItem = { name, brandId, categoryId, price };
      await axios.put(`${host}/api/v1/items/${editingItem.id}`, updatedItem);
      setHighlightedRowId(editingItem.id); // 업데이트된 항목을 강조
      fetchItems(currentPage - 1);
      showMessage('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      showMessage(`Error updating item! [${error.message}]`);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${host}/api/v1/items/${id}`);
      fetchItems(currentPage - 1); // 현재 페이지의 데이터를 다시 로딩
      showMessage('Item deleted successfully!');
      setEditingItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      showMessage(`Error deleting item! [${error.message}]`);
    }
  };

  const fetchItems = async (page) => {
    setLoading(true);
    const pageData = await fetchPageData(page, pageSize);
    setItems(pageData.content);
    setTotalRows(pageData.totalElements);
    setLoading(false);
  };

  const resetForm = () => {
    setName('');
    setBrandId('');
    setBrandName('');
    setCategoryId('');
    setCategoryName('');
    setPrice('');
    setEditingItem(null);
    setHighlightedRowId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateItem();
    } else {
      addItem();
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 5000); // 5초 후 메시지 자동 제거
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
      cell: row => <img src={row.imageUrl} alt="" width={50} />,
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
        return <MiniChart className={"p-3 mt-5"} 
        strokeWidth={2}
        activePointRadius={5} 
        width={100}
        dataSet={row.popularity} />;
      }
    },
    {
      name: 'Actions',
      cell: row => <button onClick={() => handleDeleteButtonClicked(row)}>Delete</button>,
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
    <div className="ItemApp">
      <Link to="/" className="back-arrow">&#8592; Back to Home</Link> {/* 화살표 컴포넌트 추가 */}
      <h3>Item Management</h3>
      <form onSubmit={handleSubmit} className="form" ref={formRef}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={brandName}
          onChange={handleBrandChange}
          onFocus={handleBrandFocus}
        >
          <option value="">Select Brand</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>
        <select
          value={categoryName}
          onChange={handleCategoryChange}
          onFocus={handleCategoryFocus}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit">{editingItem ? 'Update' : 'Add'}</button>
        {editingItem && <button onClick={resetForm}>Cancel</button>}
      </form>
      <div className="message">{message && <p>{message}</p>}</div> {/* 메시지 출력 */}
      <div className="table-container" ref={tableRef}>
        <DataTable
          title="Items"
          columns={columns}
          data={items}
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
