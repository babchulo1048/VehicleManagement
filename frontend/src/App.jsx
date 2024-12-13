import React from 'react';
import { Route, Routes} from 'react-router-dom';
import MenuItems from './pages/Admin/menuItem/MenuItems';

import Dashboard2 from './pages/Admin/Dashboard2';
import Blog from './pages/blog/Blog';
// import MainGrid from './components/MainGrid';
import VehicleList from './pages/vehicle/VehicleList';
import Vehicles from './pages/vehicle/Vehicles';




function App() {
  
  
    return (

     
        <Routes>
          {/* Admin-only Routes */}
          <Route path="/" element={<Dashboard2 />}>

            <Route path="menu-items" element={<MenuItems />} />
        
            <Route path="blogs" element={<Blog />} />
            <Route path="vehicle" element={<VehicleList />} />
            <Route path="vehicles" element={<Vehicles/>} />

          </Route>
  
        </Routes>
     
    );
  }
  
  export default App;
  