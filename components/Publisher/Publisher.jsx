import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Publisher.css';
import axios from "axios";
import { toast } from 'react-toastify';

function Publisher() {

    const API_URL = "https://fashionable-bride-abresuedaozmen-64f5d7ec.koyeb.app/api/v1/publishers"
    const [publishers, setPublishers] = useState([]);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updatePublishers, setUpdatePublishers] = useState({
        "id": "",
        "name": "",
        "establishmentYear": "",
        "address": ""
    });
    const [newPublishers, setNewPublishers] = useState({
        "name": "",
        "establishmentYear": "",
        "address": ""
    });

    //GET
    useEffect(() => {
        axios
        .get(API_URL)
        .then((res) => {
        setPublishers(res.data);
        setLoading(false);
        setUpdate(true);
    })
    .catch((err) => {
        toast.error("Failed to fetch publishers.");
    });
    },[update]);

    if(loading) {
        return <div>Loading...</div>
    }

    //ADD PUBLISHERS
    const handleAddPublishers =() => {
        if(!newPublishers.name || !newPublishers.establishmentYear || !newPublishers.address) {
            toast.error("All fields are required!");
            return;
        }

        //establishmentYear'ın formatını kontrol etmek için.
        const yearRegex = /^\d{4}$/;
        
        if (!yearRegex.test(newPublishers.establishmentYear)) {
            toast.error("Establishment Year must be a valid 4-digit year!");
            return;
        }

        axios.post(API_URL, newPublishers)
        .then((res) =>
        {
            setUpdate(false);
            setNewPublishers({
                name: "",
                establishmentYear: "",
                address: ""
            })
            toast.success("Publisher added successfully!");
        }) 
        .catch ((err) =>{
            toast.error("Failed to add publisher.");
        })
    }

    const handleNewPublishersChange =(e)=> {
        const {name, value} = e.target;
        setNewPublishers((prev) => ({
            ...prev,
            [name]:value,
        }))
    }

    //Updatede inputların dolu gelmesi için.
    const handleUpdateInputChange =(e)=> {
        const {name, value} = e.target;
        setUpdatePublishers((prev) =>({
            ...prev,
            [name]:value,
        }))
    }

    //DELETE
    const handleDeletePublishers=(e)=> {
        axios.delete(`${API_URL}/${e.target.id}`)
        .then((res)=> 
        {
            setUpdate(false);
            toast.success("Publisher deleted successfully!");
        })
        .catch((err) => {
            toast.error("Failed to delete publisher.");
        });
    }

    //PUT
    const handleUpdatePublishersBtn=(e)=> {
        setUpdatePublishers(e);
    }

    const handleUpdatePublishers=()=> {

        // Eğer sadece 'address' değeri değişmişse, hata mesajı göster.
    
        const selectedPublisher = publishers.find((pub) => pub.id === updatePublishers.id);
        if (
        selectedPublisher &&
        selectedPublisher.name === updatePublishers.name &&
        selectedPublisher.establishmentYear === updatePublishers.establishmentYear &&
        selectedPublisher.address !== updatePublishers.address
        ) {
        toast.error("You cannot update only the address. Please also update the name or establishment year.");
        return;
        }
        
        //Güncelleme yaparken bütün inputların dolu olması gerekir.
        if (!updatePublishers.name || !updatePublishers.establishmentYear || !updatePublishers.address) {
            toast.error("All fields are required!");
            return;
        }

        //establishmentYear'ın formatını kontrol etmek için.
        const yearRegex = /^\d{4}$/;
        
        if (!yearRegex.test(updatePublishers.establishmentYear)) {
            toast.error("Establishment Year must be a valid 4-digit year!");
            return;
        }

        axios
        .put(`${API_URL}/${updatePublishers.id}`, updatePublishers)
        .then(()=> {
            setUpdate(false);
            setUpdatePublishers({
                "name": "",
                "establishmentYear": "",
                "address": ""
            })
            toast.success("Publisher updated successfully!");
        })
        .catch((err) => {
            toast.error("Failed to update publisher.");
        });
    }

    return (
        <>

        <div className="publisherPage">
                <h1>PUBLISHER PAGE</h1>
                <p>Manage your publishers here.</p>
        </div>

        <div className="publishersAdd">
           <div>
                <h2>Add New Publisher</h2>

                <input
                type="text"
                placeholder="Publisher Name"
                name="name"
                value={newPublishers.name}
                onChange={handleNewPublishersChange}
                autoComplete="off"
                className="inputField"
                />
                <br />

                <input
                type="text"
                placeholder="Establishment Year"
                name="establishmentYear"
                value={newPublishers.establishmentYear}
                onChange={handleNewPublishersChange}
                autoComplete="off"
                className="inputField"
                />
                <br />

                <input
                type="text"
                placeholder="Publisher Address"
                name="address"
                value={newPublishers.address}
                onChange={handleNewPublishersChange}
                autoComplete="off"
                className="inputField"
                />
                <br />

                <button onClick={handleAddPublishers} className="submitBtn">
                Add Publisher
                </button>
           </div>
           <div>
            <h2>Update Publisher</h2>

            <input
            type="text"
            placeholder="Publisher Name"
            name="name"
            value={updatePublishers.name}
            onChange={handleUpdateInputChange}
            autoComplete="off"
            className="inputField"
            />
            <br />

            <input
            type="text"
            placeholder="Establishment Year"
            name="establishmentYear"
            value={updatePublishers.establishmentYear}
            onChange={handleUpdateInputChange}
            autoComplete="off"
            className="inputField"
            />
            <br />

            <input
            type="text"
            placeholder="Publisher Address"
            name="address"
            value={updatePublishers.address}
            onChange={handleUpdateInputChange}
            autoComplete="off"
            className="inputField"
            />
            <br />

            <button onClick={handleUpdatePublishers} className="submitBtn">
            Update Publisher
            </button>
           </div>
        </div>

        <div className="publishersList">
            <h2>List of Publishers</h2>
            {publishers.length > 0 && (
            publishers.map((publisher, index) => (
            <div key={index} className="publisherItem">
            <p>
            {index + 1}. <strong>{publisher.name}</strong> ({publisher.establishmentYear})
                                <br />
                                <span>{publisher.address}</span>  </p>
                            <div className="publisherButtons">
                                <button 
            onClick={handleDeletePublishers} id={publisher.id}>Delete
            </button>
            <button onClick={()=>handleUpdatePublishersBtn(publisher)}>
            Edit
            </button>
            </div>
    </div>
    )))}
    </div>
    </>
    )
}

export default Publisher;