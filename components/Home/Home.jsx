import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Home.css';
import { toast } from 'react-toastify';

function Home() {

    return(
        <>

        <div className="header">
            
            <h1>Welcome to our book borrowing system! 📚 Here’s what you can do:</h1>
            <ul>
                <li><span className="info">Authors:</span> Keep track of your favorite authors by adding, editing, or removing them.</li>
                <li><span className="info">Books:</span> Add new books to your collection, update their details, or remove ones you no longer need.</li>
                <li><span className="info">Book Borrowing:</span> Easily manage who borrowed which book and when it’s due.</li>
                <li><span className="info">Categories:</span> Organize your books into categories for quicker access.</li>
                <li><span className="info">Publishers:</span> Add and manage publishers to keep everything connected.
                </li>
                <li><span className="info">INFO:</span> The standard loan period for books in this library is 15 days.</li>
            </ul> 
        </div>
        </>

    )
}

export default Home;