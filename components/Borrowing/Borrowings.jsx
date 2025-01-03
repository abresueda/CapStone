import React, { useEffect, useState } from "react";
import './Borrowings.css';
import axios from "axios";
import { toast } from 'react-toastify';

function Borrowings() {

    const API_URL = "https://fashionable-bride-abresuedaozmen-64f5d7ec.koyeb.app/api/v1/borrows";
    const [borrows, setBorrows] = useState([]);
    const [update, setUpdate] = useState(false);
    const [updateBorrows, setUpdateBorrows] = useState({
        "id": "",
        "borrowerName": "",
        "borrowingDate": "",
        "returnDate": "",
    })
    const [newBorrows,setNewsBorrows] = useState({
        "borrowerName": "",
        "borrowerMail": "",
        "borrowingDate": "2024-01-01",
        "returnDate": "",
        "bookForBorrowingRequest": {},
    })
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);

    //Book listesini getirtmek için.
    useEffect(() => {
        axios.get("https://fashionable-bride-abresuedaozmen-64f5d7ec.koyeb.app/api/v1/books")
        .then((res) => {
            setBooks(res.data);
        })
        .catch((err) => {
            toast.error("Failed to fetch borrowings.");
        });
    },[update]);

    const handleBookChange = (e)=> {
        const selectedBookId = e.target.value;
        const selectedBook = books.find((book) => String(book.id) === String(selectedBookId));

        if(selectedBook) {
            setNewsBorrows((prevState) => ({
                ...prevState,
                bookForBorrowingRequest: {
                    id: selectedBook.id,
                    name: selectedBook.name,
                    publicationYear: selectedBook.publicationYear,
                    stock: selectedBook.stock,
                },
            }));
        } else {
            setNewsBorrows((prevState) => ({
                ...prevState,
                bookForBorrowingRequest: {}, //Seçim yapılmadığında boş bırakmak için.
            }));
        };
    }

    //GET
    //Backendden gelen returnDate verisinin null olmaması için, borrowingDate'e göre ayarlanır.
    useEffect(() => {
        axios.get(API_URL)
        .then((res) => {
            const fetchedBorrows = res.data;

            // BorrowingDate üzerinden returnDate hesapla
            const updatedBorrows = fetchedBorrows.map((borrow) => {
                const borrowingDate = new Date(borrow.borrowingDate);
                const returnDate = new Date(borrowingDate);
                returnDate.setDate(borrowingDate.getDate() + 15);

                return {
                    ...borrow,
                    returnDate: returnDate.toISOString().split("T")[0], // 'YYYY-MM-DD' formatına çevir
                };
            });

            setBorrows(updatedBorrows);
            setLoading(false);
            setUpdate(true);
        })
        .catch((err) => {
            toast.error("Error fetching borrows:");
        });
    },[update]);

    if(loading) {
        return <div>Loading...</div>
    }

    //Kullanıcı forma yeni borrow eklerse, state'e eklenir.
    const handleNewBorrowsChange = (e) => {
        const { name, value } = e.target;
    
        setNewsBorrows((prevState) => {
            const updatedState = { ...prevState, [name]: value };
    
            // borrowingDate varsa, returnDate hesaplanır.
            if (name === "borrowingDate" && value) {
                const borrowingDate = new Date(value);
                const returnDate = new Date(borrowingDate);
                returnDate.setDate(returnDate.getDate() + 15); //15 gün eklenir.
                //updatedState.returnDate = returnDate.toISOString().split("T")[0]; // 'YYYY-MM-DD' formatı
            }
    
            return updatedState;
        });
    };
    

    //ADD BORROWS
    //Formdaki veriler tamamlandığında ve gönderilmek istendiğinde çalışır.
    const handleAddBorrows = () => {

        if (!newBorrows.borrowerName || !newBorrows.borrowerMail || !newBorrows.borrowingDate || !newBorrows.bookForBorrowingRequest.id) {
            toast.error("All fields are required!");
            return;
        }

        //Tarih formatını kontrol etmek için.
        const borrowingDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
        if (!borrowingDateRegex.test(newBorrows.borrowingDate)) {
        toast.error("Borrowing Date must be in the format yyyy-MM-dd!");
        return;
        }

        //Geçerli bir tarih olup olmadığını kontrol etmek için.
        const isValidDate = (dateString) => {
            const [year, month, day] = dateString.split("-").map(Number);
            const date = new Date(year, month - 1, day); // Aylar 0-11 aralığında olduğu için.
            return (
                date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day
            );
        };

        if (!isValidDate(newBorrows.borrowingDate)) {
            toast.error("Borrowing Date is invalid. Please enter a valid date!");
            return;
        }

        axios.post(API_URL, newBorrows)
        .then((res) => {
            setUpdate(false);
            setNewsBorrows({
              "borrowerName": "",
              "borrowerMail": "",
              "borrowingDate": "",
              "returnDate": "",
              "bookForBorrowingRequest": {},
        });
        toast.success("Borrowing added successfully!");
        })
        .catch((err) => {
            toast.error("Failed to add borrowing!");
        });
    }

    //DELETE
    const handleDeleteBorrows = (e) => {
        axios.delete(`${API_URL}/${e.target.id}`)
        .then((res) => {
            setUpdate(false);
            toast.success("Borrowing deleted successfully!");
        })
        .catch((err) => {
            toast.error("Failed to delete borrowing.");
        });
    }

    //UPDATE BORROWS 
    //Update olacak inputların anlık güncellenmesi için.
    const handleUpdateInputChange = (e) => {
        const {name,value} = e.target;
        setUpdateBorrows((prev) => ({
            ...prev,
            [name]:value,
        }));
    }

    //Edite basılınca mevcut bilgiler dönüyor.
    const handleUpdateBorrowsBtn=(borrow)=> {
        setUpdateBorrows({
            ...borrow,
            book: borrow.book || {},
        });
    }

    const handleUpdateBorrow=()=> {
        if (!updateBorrows.borrowerName || !updateBorrows.borrowingDate || !updateBorrows.returnDate) {
            toast.error("All fields are required!");
            return;
        }

        //Tarih formatını kontrol etmek için.
        const borrowingDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
        if (!borrowingDateRegex.test(updateBorrows.borrowingDate)) {
        toast.error("Borrowing Date must be in the format yyyy-MM-dd!");
        return;
        }

        //Geçerli bir tarih olup olmadığını kontrol etmek için.
        const isValidDate = (dateString) => {
            const [year, month, day] = dateString.split("-").map(Number);
            const date = new Date(year, month - 1, day); // Aylar 0-11 aralığında olduğu için.
            return (
                date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day
            );
        };

        if (!isValidDate(updateBorrows.borrowingDate)) {
            toast.error("Borrowing Date is invalid. Please enter a valid date!");
            return;
        }

        axios.put(`${API_URL}/${updateBorrows.id}`, updateBorrows)
        .then(()=> {
            setUpdate(false);
            setUpdateBorrows({
                borrowerName: "",
                borrowingDate: "",
                returnDate: "",
            });
            toast.success("Borrowing updated successfully!");
        })
        .catch((err) => {
            toast.error("Failed to update borrowing.");
        });
    }

    return (
        <>
        <div className="borrowPage">
            <h1>BOOK BORROW PAGE</h1>
            <p>Manage your book borrowings here.<br /> <strong>INFO: The standard loan period for books in this library is 15 days.</strong></p>
        </div>

        <div className="borrowAdd">
            <div>
            <h1>New Borrowing</h1>

            <input type="text"
            placeholder="Name"
            name="borrowerName"
            value={newBorrows.borrowerName}
            onChange={handleNewBorrowsChange}
            autoComplete="off"
            className="inputField"
            required />
            <br />

            <input type="text"
            placeholder="E-mail"
            name="borrowerMail"
            value={newBorrows.borrowerMail}
            onChange={handleNewBorrowsChange}
            autoComplete="off"
            className="inputField"
            required />
            <br />

            <input type="text"
            placeholder="Borrowing Date"
            name="borrowingDate"
            value={newBorrows.borrowingDate}
            onChange={handleNewBorrowsChange}
            autoComplete="off"
            className="inputField"
            required />
            <br />

            <select 
            name="bookForBorrowingRequest"  
            id="bookForBorrowingRequest"
            onChange={handleBookChange}
            className="inputField"
            required>
                <option value="">Select a Book</option>
                {books.map((book)=> (
                <option key={book.id}
                value={book.id}> {book.id} - {book.name}
                </option>
                ))}
                </select>
                <br />

                <button onClick={handleAddBorrows} className="submitBtn">Add Borrow</button>
            </div>

            <div>
            <h1>Update Borrowing</h1>

            <input type="text"
            placeholder="Name"
            name="borrowerName"
            value={updateBorrows.borrowerName}
            onChange={handleUpdateInputChange}
            autoComplete="off"
            className="inputField"
            required />
            <br />

            <input type="text"
            placeholder="Borrowing Date"
            name="borrowingDate"
            value={updateBorrows.borrowingDate}
            onChange={handleUpdateInputChange}
            autoComplete="off"
            className="inputField"
            required />
            <br />

            <input type="text"
            placeholder="Return Date"
            name="returnDate"
            value={updateBorrows.returnDate}
            onChange={handleUpdateInputChange}
            autoComplete="off"
            className="inputField"
            readOnly
            onClick={() => toast.error("You cannot edit the Return Date. Return Date is set according to the borrowing date.")}
            />
            <br />

            <button onClick={handleUpdateBorrow} className="submitBtn">Update Borrow</button>
            </div>
        </div>

        <div className="borrowList">
            <h1>List of Borrowing</h1>
            {borrows.length > 0 && (
                borrows.map((borrow,index) => (
                    <div key={index} className="borrowItem">
                    <p>{index + 1}. <strong>{borrow.borrowerName}</strong> 
                    <br />
                    <strong>Email:</strong>
                    {borrow.borrowerMail}
                    <br />
                    <strong>Borrowing Date:</strong> {borrow.borrowingDate}<br />
                    <strong>Return Date:</strong> {borrow.returnDate || "-"}
                    <br />
                    <strong>Book Name:</strong> {borrow.book.name}
                    </p>

                    <div className="borrowButtons">
                        <button onClick={handleDeleteBorrows} id={borrow.id}>Delete</button>

                        <button onClick={()=> handleUpdateBorrowsBtn(borrow)}>Edit</button>
                    </div>
                    </div>
                ))
            )}
        </div>
        </>
    )
}

export default Borrowings;