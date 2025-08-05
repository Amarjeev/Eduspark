import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AnimatedRoutes from './AnimatedRoutes';

function RouterConfig() {
  return (
     <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <AnimatedRoutes />
    </Router>
  )
}

export default RouterConfig
