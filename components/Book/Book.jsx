import React, { useEffect, useState } from "react";
import './Book.css';
import axios from "axios";
import { toast } from 'react-toastify';

function Books() {

    const API_URL = "https://fashionable-bride-abresuedaozmen-64f5d7ec.koyeb.app/api/v1/books";
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
        name: "",
        publicationYear: "",
        stock: "",
        author: {},
        publisher: {},
        categories: [],
    })
    const [loading, setLoading] = useState(true);
    //Author'ı getirtmek için.
    const [authors, setAuthors] = useState([]);
    //Publisher'ı getirtmek için.
    const [publishers, setPublishers] = useState([]);
    //Category'ı getirmek için.
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

    //Author listesini getirmek için.
    useEffect(() => {
        axios.get("https://fashionable-bride-abresuedaozmen-64f5d7ec.koyeb.app/api/v1/authors")
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
        axios.get("https://fashionable-bride-abresuedaozmen-64f5d7ec.koyeb.app/api/v1/publishers")
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
        axios.get("https://fashionable-bride-abresuedaozmen-64f5d7ec.koyeb.app/api/v1/categories")
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

        setNewBook((prevState) => {
            const updatedBook = {
                ...prevState,
                categories: selectedCategories, // Kategori objelerini ekliyoruz
            };
            console.log("Updated categories:", updatedBook.categories); // Debug log
            return updatedBook;
        });
    };
    
    //GET
    useEffect(() => {
        axios.get(API_URL)
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
        setNewBook((prevBook) => ({ 
            ...prevBook, 
            [name]: value,
        }));
    }

    const validateBook = (book) => {
        const errors = {};
        
        // Book name kontrolü
        if (!book.name) {
        errors.name = "Book name is required!";
        } else if (!book.publicationYear || isNaN(Number(book.publicationYear)) || book.publicationYear.length !== 4) {
        // Publication Year kontrolü
        errors.publicationYear = "Publication Year must be a valid 4-digit year!";
        } else if (!book.stock || isNaN(book.stock) || book.stock < 0) {
        // Stock kontrolü
        errors.stock = "Stock must be a positive number!";
        } else if (!book.author.id) {
        // Author kontrolü
        errors.author = "An author must be selected!";
        } else if (!book.publisher.id) {
        // Publisher kontrolü
        errors.publisher = "A publisher must be selected!";
        } else if (!book.categories || book.categories.length === 0) {
        // Category kontrolü
        errors.categories = "At least one category must be selected!";
        }

        setErrors(errors); // Hataları state'e kaydet

        return errors;
    };

    //ADD BOOK
    //Formdaki veriler tamamlandığında ve gönderilmek istendiğinde çalışır.
    const handleAddBook = () => {

        const validationErrors = validateBook(newBook);

        // Eğer hata varsa, her bir hata için toast mesajları göster.
        if (Object.keys(validationErrors).length > 0) {
        // Hataları her bir alan için toast.error ile göster
        Object.keys(validationErrors).forEach((key) => {
            toast.error(validationErrors[key]);  // Hata mesajını göster
        });
        return;
        }
    
       axios.post(API_URL, newBook)
        .then((res) => {
            setBooks((prevBooks) => [...prevBooks, res.data]);
            setUpdate(false);
            
            setNewBook({
                name: "",
                publicationYear: "",
                stock: "",
                author: {},
                publisher: {},
                categories: [],
            }); 
            toast.success("Book added successfully!");
        })
        .catch(() => {
            toast.error("Failed to add book!");
        });
    }

    //DELETE
    const handleDeleteBook=(e) => {
        axios.delete(`${API_URL}/${e.target.id}`)
        .then(() => 
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
        console.log('book:', book); 
        setUpdateBook({
            ...book,
            author: book.author || {},
            publisher: book.publisher || {},
            categories: book.categories || [],
        });
    }

    const handleUpdateBook=()=> {

        const validationErrors = validateBook(updateBook);

        // Eğer hata varsa, her bir hata için toast mesajları göster.
        if (Object.keys(validationErrors).length > 0) {
        // Hataları her bir alan için toast.error ile göster
        Object.keys(validationErrors).forEach((key) => {
            toast.error(validationErrors[key]);  // Hata mesajını göster
        });
        return;
        }

        axios.put(`${API_URL}/${updateBook.id}`, updateBook)
        .then((res)=> {
            setBooks((prevBooks) => [ ...prevBooks, res.data]);
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

        <div className="bookPage">
            <h1>BOOK'S PAGE</h1>
            <p>Manage your books here.</p>
        </div>

        <div className="bookAdd">
            <div>
                <h1>New Book</h1>

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
                value={newBook.author?.id || ""}
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
                value={newBook.publisher?.id || ""}
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
                value={newBook.categories.map((category) => category.id)}
                onChange={handleCategoryChange} className="inputField" >
                    <option value="">Select an Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <br />

                <button onClick={handleAddBook} className="submitBtn">Add Book</button>
               
            </div>

            <div>
                <h1>Update Book</h1>

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
                value={updateBook.publicationYear || ""}
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
                value={updateBook.categories.map((category) => category.id)} 
                onChange={handleUpdateCategoryChange} className="inputField" 
                required>
                    <option value="">Select an Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <br />

                <button onClick={handleUpdateBook}
                className="submitBtn">Update Book</button>
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