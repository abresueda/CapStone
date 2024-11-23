import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Book.css';
import axios from "axios";
import { toast } from 'react-toastify';

function Books() {

    const [books, setBooks] = useState([]);
    const [update, setUpdate] = useState(false);
    const [updateBook, setUpdateBook] = useState({
        "id": "",
        "name": "",
        "publicationYear": "",
        "stock": "",
        "author": {},
        "publisher": {},
        "categories": [],
    })
    const [newBook, setNewBook] = useState({
        "name": "",
        "publicationYear": "",
        "stock": "",
        "author": {},
        "publisher": {},
        "categories":[],
    })
    const [loading, setLoading] = useState(true);
    //Author'ı getirtmek için.
    const [authors, setAuthors] = useState([]);
    //Publisher'ı getirtmek için.
    const [publishers, setPublishers] = useState([]);
    //Category'ı getirmek için.
    const [categories, setCategories] = useState([]);

    //Author listesini getirmek için.
    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/authors")
        .then((res) => {
            setAuthors(res.data);
        })
        .catch((err) => {
            toast.error("Failed to fetch authors.");
        });
    },[update]);

    const handleAuthorChange = (e) => {
        const selectedAuthorId = e.target.value;
        const selectedAuthor = authors.find((author) => String(author.id) === String(selectedAuthorId));
        
        // Eğer author seçildiyse, tüm bilgileri ekleyelim
        setNewBook(prevState => ({
            ...prevState,
            author: selectedAuthor ? selectedAuthor : "",
        }));
    };

    //Publisher listesini getirmek için.
    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/publishers")
        .then((res) => {
            setPublishers(res.data);
        })
        .catch((err) => {
            toast.error("Failed to fetch publishers.");
        });
    },[update]);

    const handlePublisherChange = (e) => {
        const selectedPublisherId = e.target.value;
        const selectedPublisher = publishers.find((publisher) => String(publisher.id) === String(selectedPublisherId));
    
        setNewBook(prevState => ({
            ...prevState,
            publisher: selectedPublisher ? selectedPublisher : "",
        }));
    };

    //Category listesini getirmek için.
    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/categories")
        .then((res) => {
            setCategories(res.data);
        })
        .catch((err) => {
            toast.error("Failed to fetch categories.");
        });
    },[update]);

    const handleCategoryChange = (e) => {
        const selectedCategoryIds = Array.from(e.target.selectedOptions, (option) => option.value);
    
        // Seçilen kategorilerin objelerini buluyoruz
        const selectedCategories = categories.filter((category) =>
            selectedCategoryIds.includes(String(category.id))
        );
    
        setNewBook((prevState) => ({
            ...prevState,
            categories: selectedCategories, // Kategori objelerini ekliyoruz
        }));
    };
    
    //GET
    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/books")
        .then((res) => {
            setBooks(res.data);
            setLoading(false);
            setUpdate(true);
            console.log(books); 
        })
        .catch((err) => {
            toast.error("Failed to fetch books.");
        });
    },[update]);

    if(loading) {
        return <div>Loading....</div>
    }

    //Kullanıcı forma yeni kitap eklerse, state'e eklenir.
    const handleNewBookChange =(e) => {
        const {name,value} = e.target;
        setNewBook((prev) =>({
            ...prev,
            [name]:value,
        }))
    }

    //ADD BOOK
    //Formdaki veriler tamamlandığında ve gönderilmek istendiğinde çalışır.
    const handleAddBook = () => {
        if (!newBook.name || !newBook.publicationYear || !newBook.stock || !newBook.author || !newBook.publisher || !newBook.categories) {
            toast.error("All fields are required!");
            return;
        }

        //publicationYear'ın formatını kontrol etmek için.
        const yearRegex = /^\d{4}$/;
        
        if (!yearRegex.test(newBook.publicationYear)) {
            toast.error("Publication Year must be a valid 4-digit year!");
            return;
        }

        //Stock alanı için sayı kontrolü.
        if (isNaN(newBook.stock) || newBook.stock < 0) {
        toast.error("Stock must be a positive number!");
        return;
        }

       axios.post("http://localhost:8080/api/v1/books", newBook)
        .then((res) => {
            setUpdate(false);
            setNewBook({
                "name": "",
                "publicationYear": "",
                "stock": "",
                "author": {},
                "publisher": {},
                "categories": [],
            })
            toast.success("Book added successfully!");
        })
        .catch((err) => {
            toast.error("Failed to add book!");
        });
    }

    //DELETE
    const handleDeleteBook=(e) => {
        axios.delete("http://localhost:8080/api/v1/books/" + e.target.id)
        .then((res) => 
        {
            setUpdate(false);
            toast.success("Book deleted successfully!");
        })
        .catch((err) => {
            toast.error("Failed to delete book.");
        });
    }

    //UPDATE BOOK
    //Update olacak inputların anlık güncellenmesi için.
    const handleUpdateInputChange =(e)=> {
        const { name, value} = e.target;
        setUpdateBook((prev) => ({
            ...prev,
            [name]:value,
        }));
    }

    //PUT
    //Edite basılınca mevcut yazar bilgilerini doldurur.
    const handleUpdateBookBtn=(book)=> {
        setUpdateBook({
            ...book,
            author: book.author || {},
            publisher: book.publisher || {},
            categories: book.categories || [],
        });
    }

    const handleUpdateBook=()=> {
        if (!updateBook.name || !updateBook.publicationYear || !updateBook.stock || !updateBook.author || !updateBook.publisher || !updateBook.categories) {
            toast.error("All fields are required!");
            return;
        }

        //publicationYear'ın formatını kontrol etmek için.
        const yearRegex = /^\d{4}$/;
        
        if (!yearRegex.test(updateBook.publicationYear)) {
            toast.error("Publication Year must be a valid 4-digit year!");
            return;
        }

        //Stock alanı için sayı kontrolü.
        if (isNaN(updateBook.stock) || updateBook.stock < 0) {
        toast.error("Stock must be a positive number!");
        return;
        }

        axios.put("http://localhost:8080/api/v1/books/" + updateBook.id, updateBook)
        .then(()=> {
            setUpdate(false);
            setUpdateBook({
                "name": "",
                "publicationYear": "",
                "stock": "",
                "author": {},
                "publisher": {},
                "categories": [],
            })
            toast.success("Book updated successfully!");
        })
        .catch((err) => {
            toast.error("Failed to update book.");
        });
    }

    //Author Update yapabilmek için.
    const handleUpdateAuthorChange = (e) => {
        const selectedAuthorId = e.target.value;
        const selectedAuthor = authors.find((author) => String(author.id) === String(selectedAuthorId));

        setUpdateBook((prevState) => ({
            ...prevState,
            author: selectedAuthor || {},
        }));
    };

    //Publisher Update yapabilmek için.
    const handleUpdatePublisherChange = (e)=> {
        const selectedPublisherId = e.target.value;
        const selectedPublisher = publishers.find((publisher) => String(publisher.id) === String(selectedPublisherId));

        setUpdateBook((prevState) => ({
            ...prevState,
            publisher: selectedPublisher || {},
        }));
    };

    //Kategori Update yapabilmek için.
    const handleUpdateCategoryChange = (e) => {
        //Kullanıcın seçtiği id'leri dizi olarak alır.
        const selectedCategoryIds = Array.from(e.target.selectedOptions, (option) => option.value);

        //Seçilen kategorilerin objelerini buluyoruz.
        const selectedCategories = categories.filter((category) => 
             selectedCategoryIds.includes(String(category.id))
        );

        setUpdateBook((prevState) => ({
            ...prevState,
            categories: selectedCategories,
        }));
    };

    return(
        <>
        <nav className="navbar">
                <Link to="/" className="href">Home</Link>
                <Link to="/author" className="href">Authors</Link>
                <Link to="/book" className="href">Books</Link>
                <Link to="/borrows" className="href">Book Borrowing</Link>
                <Link to="/categories" className="href">Book's Category</Link>
                <Link to="/publisher" className="href">Publishers</Link>
        </nav>

        <div className="bookPage">
            <h1>BOOK'S PAGE</h1>
            <p>Manage your books here.</p>
        </div>

        <div className="bookAdd">
            <div>
                <h1>New Book</h1>

                <form>
                <input type="text"
                placeholder="Name"
                name="name"
                value={newBook.name}
                onChange={handleNewBookChange}autoComplete= "off"
                className="inputField"
                required
                 />
                 <br />

                <input type="text"
                placeholder="Publication Year"
                name="publicationYear"
                value={newBook.publicationYear}
                onChange={handleNewBookChange}
                autoComplete="off"
                className="inputField"
                required
                 />
                <br />

                <input type="text"
                placeholder="Stock"
                name="stock"
                value={newBook.stock}
                onChange={handleNewBookChange}
                autoComplete="off"
                className="inputField"
                required
                />
                <br />

                <select 
                name="author" 
                id="author"
                onChange={handleAuthorChange}
                className="inputField"
                required>
                    <option value="">Select an Author</option>
                    {authors.map((author) => (
                        <option key={author.id} value={author.id}>{author.id} - {author.name}</option>
                    ))}
                </select>
                <br />

                <select 
                name="publisher" 
                id="publisher" 
                onChange={handlePublisherChange} className="inputField"
                required>
                    <option value="">Select an Publisher</option>
                    {publishers.map((publisher) => (
                        <option key={publisher.id} value={publisher.id}>{publisher.id} - {publisher.name}</option>
                    ))}
                </select>
                <br />

                <select 
                name="category" 
                id="category" 
                multiple
                onChange={handleCategoryChange} className="inputField" 
                required>
                    <option value="">Select an Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <br />

                <button onClick={handleAddBook} className="submitBtn">Add Book</button>
                </form>
            </div>

            <div>
                <h1>Update Book</h1>

                <form>
                <input type="text"
                placeholder="Name"
                name="name"
                value={updateBook.name}
                onChange={handleUpdateInputChange}
                autoComplete="off"
                className="inputField"
                required
                 />
                 <br />

                <input type="text"
                placeholder="Publication Year"
                name="publicationYear"
                value={updateBook.publicationYear}
                onChange={handleUpdateInputChange}
                autoComplete="off"
                className="inputField"
                required
                 />
                 <br />

                <input type="text"
                placeholder="Stock"
                name="stock"
                value={updateBook.stock}
                onChange={handleUpdateInputChange}
                autoComplete="off"
                className="inputField"
                required
                 />
                <br />

                <select 
                name="author" 
                id="author"
                value={updateBook.author?.id || ""}
                onChange={handleUpdateAuthorChange}
                className="inputField"
                required>
                    <option value="">Select an Author</option>
                    {authors.map((author) => (
                        <option key={author.id} value={author.id}>{author.id} - {author.name}</option>
                    ))}
                </select>
                <br />

                <select 
                name="publisher" 
                id="publisher" 
                value={updateBook.publisher?.id || ""}
                onChange={handleUpdatePublisherChange} className="inputField"
                required>
                    <option value="">Select an Publisher</option>
                    {publishers.map((publisher) => (
                        <option key={publisher.id} value={publisher.id}>{publisher.id} - {publisher.name}</option>
                    ))}
                </select>
                <br />

                <select 
                name="category" 
                id="category"
                multiple
                value={updateBook.categories.map((category) => category.id) || []} 
                onChange={handleUpdateCategoryChange} className="inputField" 
                required>
                    <option value="">Select an Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <br />

                <button onClick={handleUpdateBook} className="submitBtn">Update Book</button>
                </form>
            </div>
        </div>

        <div className="bookList">
            <h1>List of Books</h1>
            {books.length > 0 && (
                books.map((book, index) => (
                <div key={index} className="bookItem">
                <p>{index + 1}. <strong>{book.name}</strong><br />
                ({book.publicationYear}) <br /> Stock: {book.stock} <br />
                </p>

                <div className="bookButtons">
                    <button onClick={handleDeleteBook} id={book.id}>Delete</button>
                    
                    <button onClick={()=> handleUpdateBookBtn(book)}>Edit</button>
                </div>
                </div>
                ))
            )}
        </div>
        </>
    )
}

export default Books;