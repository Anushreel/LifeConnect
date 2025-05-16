// import React, { useState, useEffect , useRef} from 'react';
// import { Button, Card, Spin, Tabs, DatePicker, Empty, Alert,message } from 'antd';
// import { ArrowLeftOutlined } from '@ant-design/icons';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import moment from 'moment';
// import { sensorAPI, predictionAPI, taskAPI } from '../components/api';
// import UserTasks from './UserTasks';
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const { TabPane } = Tabs;
// const { RangePicker } = DatePicker;

// const UserHealthDetails = ({ user, onBack }) => {
//   const [loading, setLoading] = useState(true);
//   const [sensorData, setSensorData] = useState({});
//   const [predictions, setPredictions] = useState([]);
//   const [dateRange, setDateRange] = useState([moment().subtract(7, 'days'), moment()]);
//   const [days, setDays] = useState(7);
  
//   // Refs for chart instances
//   const chartRefs = {
//     temperature: useRef(null),
//     heartRate: useRef(null),
//     humidity: useRef(null),
//     ecg: useRef(null)
//   };

//   useEffect(() => {
//     fetchUserData();
    
//     // Cleanup function to destroy chart instances
//     return () => {
//       // Destroy chart instances when component unmounts
//       Object.values(chartRefs).forEach(ref => {
//         if (ref.current && ref.current.chartInstance) {
//           ref.current.chartInstance.destroy();
//         }
//       });
//     };
//   }, [days]);

//   const fetchUserData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch sensor data
//       const sensorResponse = await sensorAPI.getReadingsForUser(user.uid, days);
      
//       // Fetch predictions
//       const predictionsResponse = await predictionAPI.getPredictionsForUser(user.uid, days);
      
//       setSensorData(processChartData(sensorResponse.data));
//       setPredictions(predictionsResponse.data);
      
//       setLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch user data:', error);
//       setLoading(false);
//     }
//   };

//   const processChartData = (rawData) => {
//     if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
//       return {};
//     }

//     // Extract timestamps for x-axis
//     const timestamps = rawData.map(reading =>
//       moment(reading.timestamp).format('MM/DD HH:mm')
//     );
    
//     // Process sensor readings
//     const chartData = {
//       temperature: {
//         labels: timestamps,
//         datasets: [{
//           label: 'Temperature (°C)',
//           data: rawData.map(reading => reading.temperature),
//           fill: false,
//           borderColor: 'rgb(255, 99, 132)',
//           tension: 0.1
//         }]
//       },
//       heartRate: {
//         labels: timestamps,
//         datasets: [{
//           label: 'Heart Rate (BPM)',
//           data: rawData.map(reading => reading.heart_rate),
//           fill: false,
//           borderColor: 'rgb(54, 162, 235)',
//           tension: 0.1
//         }]
//       },
//       humidity: {
//         labels: timestamps,
//         datasets: [{
//           label: 'Humidity (%)',
//           data: rawData.map(reading => reading.humidity),
//           fill: false,
//           borderColor: 'rgb(75, 192, 192)',
//           tension: 0.1
//         }]
//       },
//       ecg: {
//         labels: timestamps,
//         datasets: [{
//           label: 'ECG',
//           data: rawData.map(reading => reading.ecg),
//           fill: false,
//           borderColor: 'rgb(153, 102, 255)',
//           tension: 0.1
//         }]
//       }
//     };
    
//     return chartData;
//   };

//   const handleDateRangeChange = (dates) => {
//     if (!dates || dates.length !== 2) {
//       setDateRange([moment().subtract(7, 'days'), moment()]);
//       setDays(7);
//       return;
//     }
    
//     setDateRange(dates);
//     // Calculate days difference for API call
//     const daysDiff = dates[1].diff(dates[0], 'days') + 1;
//     setDays(daysDiff);
//   };

//   const getChartOptions = (title) => {
//     return {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           position: 'top',
//         },
//         title: {
//           display: true,
//           text: title
//         }
//       },
//       scales: {
//         y: {
//           beginAtZero: false
//         }
//       }
//     };
//   };

//   return (
//     <div className="user-health-details">
//       <Button
//         type="default"
//         icon={<ArrowLeftOutlined />}
//         onClick={onBack}
//         className="back-button"
//       >
//         Back to Dashboard
//       </Button>
      
//       <Card title={`Health Data for ${user.full_name} (ID: ${user.uid})`} className="health-details-card">
//         {loading ? (
//           <div className="loading-container">
//             <Spin size="large" />
//           </div>
//         ) : (
//           <>
//             <div className="date-range-picker">
//               <RangePicker
//                 value={dateRange}
//                 onChange={handleDateRangeChange}
//                 allowClear={false}
//               />
//             </div>
            
//             <Tabs defaultActiveKey="health" className="details-tabs">
//               <TabPane tab="Health Parameters" key="health">
//                 <div className="charts-container">
//                   {Object.keys(sensorData).length === 0 ? (
//                     <Empty description="No sensor data available for this period" />
//                   ) : (
//                     <>
//                       <div className="chart-row">
//                         <div className="chart-container">
//                           <Line
//                             ref={chartRefs.temperature}
//                             data={sensorData.temperature}
//                             options={getChartOptions('Temperature Over Time')}
//                             key={`temp-chart-${days}`} // Add key to force re-render
//                           />
//                         </div>
//                         <div className="chart-container">
//                           <Line
//                             ref={chartRefs.heartRate}
//                             data={sensorData.heartRate}
//                             options={getChartOptions('Heart Rate Over Time')}
//                             key={`hr-chart-${days}`} // Add key to force re-render
//                           />
//                         </div>
//                       </div>
//                       <div className="chart-row">
//                         <div className="chart-container">
//                           <Line
//                             ref={chartRefs.humidity}
//                             data={sensorData.humidity}
//                             options={getChartOptions('Humidity Over Time')}
//                             key={`humidity-chart-${days}`} // Add key to force re-render
//                           />
//                         </div>
//                         <div className="chart-container">
//                           <Line
//                             ref={chartRefs.ecg}
//                             data={sensorData.ecg}
//                             options={getChartOptions('ECG Over Time')}
//                             key={`ecg-chart-${days}`} // Add key to force re-render
//                           />
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </TabPane>
              
//               <TabPane tab="Predictions" key="predictions">
//                 {predictions.length === 0 ? (
//                   <Empty description="No prediction data available for this period" />
//                 ) : (
//                   <div className="predictions-container">
//                     {predictions.map((prediction, index) => (
//                       <Alert
//                         key={index}
//                         message={`Health Status: ${prediction.health_status}`}
//                         description={`Timestamp: ${moment(prediction.prediction_timestamp).format('YYYY-MM-DD HH:mm:ss')} | Score: ${prediction.result}`}
//                         type={
//                           prediction.health_status.toLowerCase() === 'critical' ? 'error' :
//                           prediction.health_status.toLowerCase() === 'warning' ? 'warning' : 'success'
//                         }
//                         showIcon
//                         className="prediction-alert"
//                       />
//                     ))}
//                   </div>
//                 )}
//               </TabPane>
              
//               <TabPane tab="Tasks" key="tasks">
//                 <UserTasks userId={user.uid} />
//               </TabPane>
//             </Tabs>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default UserHealthDetails;

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Spin, Tabs, Input, Empty, Alert, Space } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';
import { sensorAPI, predictionAPI, taskAPI } from '../components/api';
import UserTasks from './UserTasks';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { TabPane } = Tabs;

const UserHealthDetails = ({ user, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [days, setDays] = useState(7);
  
  // Refs for chart instances
  const chartRefs = {
    temperature: useRef(null),
    heartRate: useRef(null),
    humidity: useRef(null),
    ecg: useRef(null)
  };

  useEffect(() => {
    fetchUserData();
    
    // Cleanup function to destroy chart instances
    return () => {
      // Destroy chart instances when component unmounts
      Object.values(chartRefs).forEach(ref => {
        if (ref.current && ref.current.chartInstance) {
          ref.current.chartInstance.destroy();
        }
      });
    };
  }, [days]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch sensor data
      const sensorResponse = await sensorAPI.getReadingsForUser(user.uid, days);
      
      // Fetch predictions
      const predictionsResponse = await predictionAPI.getPredictionsForUser(user.uid, days);
      
      setSensorData(processChartData(sensorResponse.data));
      setPredictions(predictionsResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setLoading(false);
    }
  };

  const processChartData = (rawData) => {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return {};
    }

    // Extract timestamps for x-axis
    const timestamps = rawData.map(reading => 
      moment(reading.timestamp).format('MM/DD HH:mm')
    );
    
    // Process sensor readings
    const chartData = {
      temperature: {
        labels: timestamps,
        datasets: [{
          label: 'Temperature (°C)',
          data: rawData.map(reading => reading.temperature),
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }]
      },
      heartRate: {
        labels: timestamps,
        datasets: [{
          label: 'Heart Rate (BPM)',
          data: rawData.map(reading => reading.heart_rate),
          fill: false,
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        }]
      },
      humidity: {
        labels: timestamps,
        datasets: [{
          label: 'Humidity (%)',
          data: rawData.map(reading => reading.humidity),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      ecg: {
        labels: timestamps,
        datasets: [{
          label: 'ECG',
          data: rawData.map(reading => reading.ecg),
          fill: false,
          borderColor: 'rgb(153, 102, 255)',
          tension: 0.1
        }]
      }
    };
    
    return chartData;
  };

  const handleDateChange = () => {
    if (!startDate || !endDate) {
      return;
    }
    
    const start = moment(startDate);
    const end = moment(endDate);
    
    if (!start.isValid() || !end.isValid()) {
      return;
    }
    
    // Calculate days difference for API call
    const daysDiff = end.diff(start, 'days') + 1;
    setDays(daysDiff);
  };

  const getChartOptions = (title) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: title
        }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    };
  };

  return (
    <div className="user-health-details">
      <Button 
        type="default" 
        icon={<ArrowLeftOutlined />} 
        onClick={onBack}
        className="back-button"
      >
        Back to Dashboard
      </Button>
      
      <Card title={`Health Data for ${user.full_name} (ID: ${user.uid})`} className="health-details-card">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="date-range-selector">
              <Space>
                <span><CalendarOutlined /> Date Range:</span>
                <Input
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: 150 }}
                />
                <span>to</span>
                <Input
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: 150 }}
                />
                <Button type="primary" onClick={handleDateChange}>
                  Apply
                </Button>
              </Space>
              <div className="date-hint" style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                Format: YYYY-MM-DD (Current range: {days} days)
              </div>
            </div>
            
            <Tabs defaultActiveKey="health" className="details-tabs">
              <TabPane tab="Health Parameters" key="health">
                <div className="charts-container">
                  {Object.keys(sensorData).length === 0 ? (
                    <Empty description="No sensor data available for this period" />
                  ) : (
                    <>
                      <div className="chart-row">
                        <div className="chart-container">
                          <Line 
                            ref={chartRefs.temperature}
                            data={sensorData.temperature} 
                            options={getChartOptions('Temperature Over Time')}
                            key={`temp-chart-${days}`} // Add key to force re-render
                          />
                        </div>
                        <div className="chart-container">
                          <Line 
                            ref={chartRefs.heartRate}
                            data={sensorData.heartRate} 
                            options={getChartOptions('Heart Rate Over Time')}
                            key={`hr-chart-${days}`} // Add key to force re-render
                          />
                        </div>
                      </div>
                      <div className="chart-row">
                        <div className="chart-container">
                          <Line 
                            ref={chartRefs.humidity}
                            data={sensorData.humidity} 
                            options={getChartOptions('Humidity Over Time')}
                            key={`humidity-chart-${days}`} // Add key to force re-render
                          />
                        </div>
                        <div className="chart-container">
                          <Line 
                            ref={chartRefs.ecg}
                            data={sensorData.ecg} 
                            options={getChartOptions('ECG Over Time')}
                            key={`ecg-chart-${days}`} // Add key to force re-render
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabPane>
              
              <TabPane tab="Predictions" key="predictions">
                {predictions.length === 0 ? (
                  <Empty description="No prediction data available for this period" />
                ) : (
                  <div className="predictions-container">
                    {predictions.map((prediction, index) => (
                      <Alert
                        key={index}
                        message={`Health Status: ${prediction.health_status}`}
                        description={`Timestamp: ${moment(prediction.prediction_timestamp).format('YYYY-MM-DD HH:mm:ss')} | Score: ${prediction.result}`}
                        type={
                          prediction.health_status.toLowerCase() === 'critical' ? 'error' : 
                          prediction.health_status.toLowerCase() === 'warning' ? 'warning' : 'success'
                        }
                        showIcon
                        className="prediction-alert"
                      />
                    ))}
                  </div>
                )}
              </TabPane>
              
              <TabPane tab="Tasks" key="tasks">
                <UserTasks userId={user.uid} />
              </TabPane>
            </Tabs>
          </>
        )}
      </Card>
    </div>
  );
};

export default UserHealthDetails;