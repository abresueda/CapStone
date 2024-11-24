import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Author.css';
import axios from "axios";
import { toast } from 'react-toastify';

function Author() {

    const [authors, setAuthors] = useState([]);
    const [update, setUpdate] = useState(false); //Sayfayı güncellemek için kullanıyoruz.
    const [updateAuthors, setUpdateAuthors] = useState({
        "id": "",
        "name": "",
        "birthDate": "",
        "country": ""
    });
    const [newAuthors, setNewAuthors] = useState({
        "name": "",
        "birthDate": "2024-11-12",
        "country": ""
    });
    const [loading, setLoading] = useState(true);

    //GET
    useEffect(() => {
        axios.get("https://natural-kim-abresuedaozmen-a60d14d6.koyeb.app/api/v1/authors")
        .then((res) => {
            setAuthors(res.data);
            setLoading(false);
            setUpdate(true);
        })
        .catch((err) => {
            toast.error("Failed to fetch authors.");
        });
    },[update]);

    if(loading) {
        return <div>Loading...</div>
    }

    //ADD AUTHORS
    const handleAddAuthors =()=> {
        if (!newAuthors.name || !newAuthors.birthDate || !newAuthors.country) {
            toast.error("All fields are required!");
            return;
        }

        //Tarih formatını kontrol etmek için.
        const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
        if (!birthDateRegex.test(newAuthors.birthDate)) {
        toast.error("Birth Date must be in the format yyyy-MM-dd!");
        return;
        }

        //Geçerli bir tarih olup olmadığını kontrol etmek için.
        const [year, month, day] = newAuthors.birthDate.split("-").map(Number);
        const isValidDate = (year, month, day) => {
            const date = new Date(year, month -1, day); //Aylar 0-11 arasındadır.
            return (
                date.getFullYear() === year &&
                date.getMonth() === month -1 &&
                date.getDate() === day
            );
        };

        if (!isValidDate(year, month, day)) {
            toast.error("Birth Date is invalid. Please enter a valid date!");
            return;
        }

        axios.post("https://natural-kim-abresuedaozmen-a60d14d6.koyeb.app/api/v1/authors", newAuthors)
        .then((res)=> {
            setUpdate(false);
            setNewAuthors({
                name: "",
                birthDate: "",
                country: "",
            });
            toast.success("Author added successfully!");
        }) 
        .catch((err)=>{
            toast.error("Failed to add author!");
        });
    }

    const handleNewAuthorsChange =(e)=> {
        const {name, value} = e.target;
        setNewAuthors((prev) =>({
            ...prev,
            [name]:value,
        }))
    }

    //Update olayında inputların dolu gelmesi için.
    const handleUpdateInputChange =(e)=> {
        const {name, value} = e.target;
        setUpdateAuthors((prev) =>({
            ...prev,
            [name]:value,
        }))
    }

    //DELETE
    const handleDeleteAuthors=(e)=> {
        axios.delete("https://natural-kim-abresuedaozmen-a60d14d6.koyeb.app/api/v1/authors/" + e.target.id)
        .then((res)=> {
            setUpdate(false);
            toast.success("Author deleted succesfully!");
        })
        .catch((err) => {
            toast.error("Failed to delete author.");
        });
    }

    //PUT
    const handleUpdateAuthorBtn=(auth)=> {
        setUpdateAuthors({
            id: auth.id,
            name: auth.name,
            birthDate: auth.birthDate,
            country: auth.country
        }); 
    }

    const handleUpdateAuthor=()=> {
        if (!updateAuthors.name || !updateAuthors.birthDate || !updateAuthors.country) {
            toast.error("All fields are required!");
            return;
        }

        //Tarih formatını kontrol etmek için.
        const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
        if (!birthDateRegex.test(updateAuthors.birthDate)) {
        toast.error("Birth Date must be in the format yyyy-MM-dd!");
        return;
        }

        //Geçerli bir tarih olup olmadığını kontrol etmek için.
        const [year, month, day] = updateAuthors.birthDate.split("-").map(Number);
        const isValidDate = (year, month, day) => {
            const date = new Date(year, month -1, day); //Aylar 0-11 arasındadır.
            return (
                date.getFullYear() === year &&
                date.getMonth() === month -1 &&
                date.getDate() === day
            );
        };

        if (!isValidDate(year, month, day)) {
            toast.error("Birth Date is invalid. Please enter a valid date!");
            return;
        }

        axios.put(`https://natural-kim-abresuedaozmen-a60d14d6.koyeb.app/api/v1/authors/${updateAuthors.id}`, updateAuthors)
        .then(()=> {
            setUpdate(false);
            setUpdateAuthors({
                "name": "",
                "birthDate": "",
                "country": ""
            })
            toast.success("Author updated successfully!");
        })
        .catch((err) => {
            toast.error("Failed to update author.");
        });
    }

    return (
        <>
        <nav className="navbar">
                <Link to="/" className="href">Home</Link>
                <Link to="/author" className="href">Authors</Link>
                <Link to="/book" className="href">Books</Link>
                <Link to="/borrows" className="href">Book Borrowing</Link>
                <Link to="/categories" className="href">Book's Category</Link>
                <Link to="/publisher" className="href">Publishers</Link>
        </nav>

        <div className="authorPage">
            <h1>AUTHOR PAGE</h1>
            <p>Manage your favourite authors here.</p>
        </div>

        <div className="authorsAdd">
            <div>
            <h1>New Authors</h1>

            <input type="text"
            placeholder="Name"
            name="name"
            value={newAuthors.name}
            onChange={handleNewAuthorsChange}
            autoComplete="off"
            className="inputField" />
            <br />

            <input type="text"
            placeholder="Birth Date(yyyy-MM-dd)"
            name="birthDate"
            value={newAuthors.birthDate}
            onChange={handleNewAuthorsChange}
            autoComplete="off"
            className="inputField" />
            <br />

            <input type="text"
            placeholder="Country"
            name="country"
            value={newAuthors.country}
            onChange={handleNewAuthorsChange}
            autoComplete="off"
            className="inputField" />
            <br />

            <button onClick={handleAddAuthors}className="submitBtn">Add Author</button>
            </div>

            <div>
            <h1>Update Authors</h1>

            <input type="text"
            placeholder="Name"
            name="name"
            value={updateAuthors.name}
            onChange={handleUpdateInputChange}
            autoComplete="off"
            className="inputField" />
            <br />

            <input type="text"
            placeholder="Birth Date"
            name="birthDate"
            value={updateAuthors.birthDate}
            onChange={handleUpdateInputChange}
            autoComplete="off"
            className="inputField" />
            <br />

            <input type="text"
            placeholder="Country"
            name="country"
            value={updateAuthors.country}
            onChange={handleUpdateInputChange}
            autoComplete="off"
            className="inputField" />
            <br />

            <button onClick={handleUpdateAuthor} className="submitBtn">Update Author</button>
            
            </div>
        </div>

        <div className="authorList">
        <h1>List of Authors</h1>
            {authors.length > 0 && (
            authors.map((author,index)=> (
        <div key={index} className="authorItem">
        <p >
        {index + 1}. <strong>{author.name} </strong> <br /> Birth Date: {author.birthDate} <br />
        Country: {author.country}
        </p>
            
        <div className="authorButtons">
        <button onClick={handleDeleteAuthors} id={author.id}>Delete</button>
        <button onClick={()=> handleUpdateAuthorBtn(author)}>Edit</button>
    </div>    
</div>
)))}
</div>
</>
    )
}

export default Author;