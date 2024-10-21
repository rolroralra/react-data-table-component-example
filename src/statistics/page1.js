// ItemList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUrl';
import './page1.css';

const host = getApiUrl();

const fetchData = async () => {
    try {
      const response = await axios.get(`${host}/api/v1/items/statistics/min-brand-price-group-by-category`);
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { totalMinPrice: 0, categoryBrandPriceDtos: [] };
    }
  };

const ItemList = () => {
const [data, setData] = useState(null);

useEffect(() => {
    const loadStatistics = async () => {
    const data = await fetchData();
    setData(data);
    };

    loadStatistics();
}, []);

if (!data) {
    return <div>Loading...</div>;
}

return (
    <div className="feature1">
    <Link to="/" className="back-arrow">&#8592; Back to Home</Link> {/* 화살표 컴포넌트 추가 */}
    <h3>Feature 1</h3>
    <table>
        <thead>
        <tr>
            <th>카테고리</th>
            <th>브랜드</th>
            <th>가격</th>
        </tr>
        </thead>
        <tbody>
        {data.categoryBrandPriceDtos.map((item, index) => (
            <tr key={index}>
            <td>{item.categoryName}</td>
            <td>{item.brandName}</td>
            <td>{item.price.toLocaleString()} 원</td>
            </tr>
        ))}
        </tbody>
        <tfoot>
        <tr>
            <td colSpan="2">총액</td>
            <td>{data.totalMinPrice.toLocaleString()} 원</td>
        </tr>
        </tfoot>
    </table>
    </div>
);
};

export default ItemList;