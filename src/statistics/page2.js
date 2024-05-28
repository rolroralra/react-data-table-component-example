import React, { useEffect, useState } from 'react';
import './page2.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const host = 'http://localhost:8080';

const fetchSingleBrandStatistics = async () => {
    try {
      const response = await axios.get(`${host}/api/v1/items/statistics/min-single-brand-price`);
      return response.data;
    } catch (error) {
      console.error('Error fetching single brand statistics:', error);
      return { brandName: '', minPriceSummation: 0, categoryPriceDtos: [] };
    }
  };

  const SingleBrandStatistics = () => {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      const loadStatistics = async () => {
        const data = await fetchSingleBrandStatistics();
        setData(data);
      };
  
      loadStatistics();
    }, []);
  
    if (!data) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="brand-statistics">
        <Link to="/" className="back-arrow">&#8592; Back to Home</Link> {/* 화살표 컴포넌트 추가 */}
        <h3>Featuer2 - Brand: {data.brandName}</h3>
        <table>
          <thead>
            <tr>
              <th>카테고리</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody>
            {data.categoryPriceDtos.map((item, index) => (
              <tr key={index}>
                <td>{item.categoryName}</td>
                <td>{item.price.toLocaleString()} 원</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>총액</td>
              <td>{data.minPriceSummation.toLocaleString()} 원</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };
  
  export default SingleBrandStatistics;