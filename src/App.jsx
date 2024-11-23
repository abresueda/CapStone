import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import Home from '../components/Home/Home';
import Author from '../components/Author/Author';
import Publisher from '../components/Publisher/Publisher';
import Category from '../components/Category/Category';
import Book from '../components/Book/Book';
import Borrows from '../components/Borrowing/Borrowings';


function App() {

  return (
    <Router>
      {/* ToastContainer'ı ekliyoruz */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover 
        draggable 
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/author" element={<Author />} />
        <Route path="/publisher" element={<Publisher />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/book" element={<Book />} />
        <Route path="/borrows" element={<Borrows />} />
        

        {/* Yanlış bir URL girildiğinde Home'a yönlendirir. */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
