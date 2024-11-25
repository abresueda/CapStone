import React from "react";
import './Category.css';
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function Category() {

    const API_URL = "https://fashionable-bride-abresuedaozmen-64f5d7ec.koyeb.app/api/v1/categories";
    const [category,setCategory] = useState([]); //API'deki boş kategori listesini saklar.
    const [update, setUpdate] = useState(false); //Kategorilerde değişiklik olunca useEffect'in yeniden çalışmasını sağlar.
    const [updateCategory, setUpdateCategory] = useState({
        "id": "",
        "name": "",
        "description": ""
    }); //Güncellenecek kategori bilgisini saklar.
    const [newCategory, setNewCategory] = useState({
        "name": "",
        "description": ""
    }); //Yeni kategori eklemek için.
    const [loading, setLoading] = useState(true);

    //GET
    useEffect(() => {
        axios.get(API_URL)
        .then((res) => {
            setCategory(res.data);
            setLoading(false);
            setUpdate(true);
        })
        .catch((err) => {
            toast.error("Failed to fetch categories.");
        });
    },[update]); //update değiştiğinde bu kod tekrar çalışır.

    if(loading) {
        return <div>Loading...</div>
    }

    //ADD CATEGORY
    //Formdaki veriler tamamlandığında ve gönderilmek istendiğinde çalışır.
    const handleAddCategory =() => {
        if(!newCategory.name || !newCategory.description) {
            toast.error("All fields are required!");
            return;
        }

        axios.post(API_URL, newCategory)
        .then((res) => {
            setUpdate(false);
            setNewCategory({
                name: "",
                description: "",
            }); //Kategori eklendikten sonra formun temizlenmesi için.
            toast.success("Category added successfully!");
        }) 
        .catch((err) => {
            console.log("Error:", err);
            toast.error("Failed to add category!");
        });
    }

    //Kullanıcı forma yeni kategori eklerse, newCategory state'ine eklenir.
    const handleNewCategoryChange =(e) => {
        const {name, value} = e.target;
        setNewCategory((prev) =>({
            ...prev,
            [name]:value,
        }))
    }

    //UPDATE
    //Update olacak kategorinin input alanlarının anlık güncellenmesi için.
    const handleUpdateInputChange =(e)=> {
        const {name,value} = e.target;
        setUpdateCategory((prev) => ({
            ...prev,
            [name]:value,
        }))
    }

    //DELETE
    const handleDeleteCategory=(e)=> {
        axios.delete(`${API_URL}/${e.target.id}`)
        .then(() =>
        {
            setUpdate(false);
            toast.success("Category deleted successfully!");
        })
        .catch(() => {
            toast.error("Failed to delete category.");
        });
    }

    //PUT
    const handleUpdateCategoryBtn=(cat)=> {
        setUpdateCategory(cat);
    }

    const handleUpdateCategory=()=> {
        
        // Eğer name ve description eski değerlerle aynıysa, yalnızca description güncellenemez diye hata mesajı verir.
        const selectedCategory = category.find((cat) => cat.id === updateCategory.id);
        if (
        selectedCategory &&
        selectedCategory.name === updateCategory.name &&
        selectedCategory.description !== updateCategory.description
        ) {
        toast.error("You cannot update only the description. Please also update the name.");
        return;
        }

        //Güncelleme yaparken bütün inputların dolu olması gerekir.
        if(!updateCategory.name || !updateCategory.description) {
            toast.error("All fields are required!");
            return;
        }

        axios.put(`${API_URL}/${updateCategory.id}`, updateCategory)
        .then(()=> {
            setUpdate(false);
            setUpdateCategory({
                name: "",
                description: ""
            })
            toast.success("Category updated successfully!");
        })
        .catch((err) => {
            console.log("Error:", err);
            toast.error("Failed to update category.");
        });
    }

    return (
        <>

        <div className="categoryPage">
            <h1>CATEGORY PAGE</h1>
            <p>Manage book's categories here.</p>
        </div>

        <div className="categoryAdd">
            <div>
                <h1>New Category</h1>
                
                <input type="text"
                placeholder="Name"
                name="name"
                value={newCategory.name}
                onChange={handleNewCategoryChange}
                autoComplete="off" 
                className="inputField"/>
                <br />

                <input type="text"
                placeholder="Description"
                name="description"
                value={newCategory.description}
                onChange={handleNewCategoryChange}
                autoComplete="off"
                className="inputField" />
                <br />

                <button onClick={handleAddCategory} className="submitBtn">Add Category</button>
            </div>

            <div>
            <h1>Update Category</h1>

            <input type="text"
            placeholder="Name"
            name="name"
            value={updateCategory.name}
            onChange={handleUpdateInputChange}
            autoComplete="off" 
            className="inputField"/>
            <br />

            <input type="text"
            placeholder="Description"
            name="description"
            value={updateCategory.description}
            onChange={handleUpdateInputChange}
            autoComplete="off"
            className="inputField" />
            <br />

            <button onClick={handleUpdateCategory} className="submitBtn">Update Category</button>
            </div>
        </div>

        <div className="categoryList">
            <h2>List of Categories</h2>
            {category.length > 0 && (
                category.map((category, index) => (
                <div key={index} className="categoryItem">
                <p>{index + 1}. <strong>{category.name}</strong><br /> 
                ({category.description})
                </p>

        <div className="categoryButtons">
            <button onClick={handleDeleteCategory} id={category.id}>Delete</button>
            <button onClick={()=> handleUpdateCategoryBtn(category)}>Edit
            </button>
        </div>
    </div>
)))}
</div>
</>
    )
}

export default Category;