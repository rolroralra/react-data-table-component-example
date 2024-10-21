
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUrl';
import './page3.css';

const host = getApiUrl();

const MinMaxPrice = () => {
  const [categoryName, setCategoryName] = useState('');
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);

  const loadStatistics = async (category) => {
      const data = await fetchMinMaxPrice(category);
      setData(data);
    };

  useEffect(() => {
    // TBD
  }, []);

  const fetchMinMaxPrice = async (categoryName) => {
    try {
      const response = await axios.get(`${host}/api/v1/items/statistics/min-max-price`, {
        params: { categoryName }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching min-max price statistics:', error);
      return { categoryName: '', brandMinPrice: [], brandMaxPrice: [] };
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

  const handleCategoryChange = async (e) => {
    e.preventDefault();

    const selectedCategoryName = e.target.value
    setCategoryName(selectedCategoryName);

    const data = await fetchMinMaxPrice(selectedCategoryName);
    setData(data);
  };

  const handleCategoryFocus = async () => {
    const categoryData = await fetchCategories();

    setCategories(categoryData);
  };

  return (
    <div className="min-max-price">
      <Link to="/" className="back-arrow">&#8592; Back to Home</Link> {/* 화살표 컴포넌트 추가 */}
      <h3>카테고리별 최대 최소 가격</h3>
      <form onSubmit={handleCategoryChange} className="category-form">
        <label for="category-select">
          카테고리: 
        </label>
        <select
          id="category-select"
          value={categoryName}
          onChange={handleCategoryChange}
          onFocus={handleCategoryFocus}
        >

          <option value="" selected disabled>
            Select Category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </form>
      {data && (
        <div>
          <h4>Category: {data.categoryName}</h4>
          <div>
            <h5>Minimum Price Brands</h5>
            <table>
              <thead>
                <tr>
                  <th>브랜드</th>
                  <th>가격</th>
                </tr>
              </thead>
              <tbody>
                {data.brandMinPrice.map((item, index) => (
                  <tr key={index}>
                    <td>{item.brandName}</td>
                    <td>{item.price.toLocaleString()} 원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h5>Maximum Price Brands</h5>
            <table>
              <thead>
                <tr>
                  <th>브랜드</th>
                  <th>가격</th>
                </tr>
              </thead>
              <tbody>
                {data.brandMaxPrice.map((item, index) => (
                  <tr key={index}>
                    <td>{item.brandName}</td>
                    <td>{item.price.toLocaleString()} 원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
  
export default MinMaxPrice;