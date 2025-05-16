import React, { useState,useEffect } from 'react';
import './AdminPage.css';
import { Layout, Result,Button } from 'antd';
import Sidebar from '../AdminDashboard/Sidebar';
import AdminDashboard from '../AdminDashboard/AdminDashboard';


const { Content } = Layout;

const AdminPage = () => {
  return (
    <Layout style={{ minHeight: '100vh', flexDirection: 'row' }}>
      <Sidebar />
      <Layout className="site-layout" style={{ marginLeft: 0 }}>
        <Content style={{ padding: '20px', minHeight: '100vh' }}>
          <AdminDashboard />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;