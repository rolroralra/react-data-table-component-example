
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUrl';
import './page3.css';

const host = getApiUrl();

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


  const MinMaxPrice = () => {
    const [categoryName, setCategoryName] = useState('상의');
    const [data, setData] = useState(null);
  
    const loadStatistics = async (category) => {
        const data = await fetchMinMaxPrice(category);
        setData(data);
      };

    useEffect(() => {
        loadStatistics('상의');
    }, []);

    const handleInputChange = (e) => {
      setCategoryName(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = await fetchMinMaxPrice(categoryName);
      setData(data);
    };
  
    return (
      <div className="min-max-price">
        <Link to="/" className="back-arrow">&#8592; Back to Home</Link> {/* 화살표 컴포넌트 추가 */}
        <h3>Min-Max Price Statistics</h3>
        <form onSubmit={handleSubmit} className="category-form">
          <input
            type="text"
            value={categoryName}
            onChange={handleInputChange}
            placeholder="Enter category name"
          />
          <button type="submit">Search</button>
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