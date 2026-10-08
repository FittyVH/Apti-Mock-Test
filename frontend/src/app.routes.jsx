import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Landing from './features/auth/pages/Landing';
import Protected from './features/auth/components/Protected';
import TestLayout from './features/test/pages/TestLayout';
import Home from './features/test/pages/Home';
import SavedQuestions from './features/test/pages/SavedQuestions';
import TestHistory from './features/test/pages/TestHistory';
import Profile from './features/test/pages/Profile';

export const router = createBrowserRouter([
    {
        path: '/landing',
        element: <Landing />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/',
        element: (
            <Protected>
                <TestLayout />
            </Protected>
        ),
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'saved-questions',
                element: <SavedQuestions />
            },
            {
                path: 'history',
                element: <TestHistory />
            },
            {
                path: 'profile',
                element: <Profile />
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
]);