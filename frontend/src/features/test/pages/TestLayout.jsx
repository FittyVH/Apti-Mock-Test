import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';

const TestLayout = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default TestLayout;
