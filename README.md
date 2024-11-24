# Library Application - Capstone Project

This project is the final milestone of the Patika+ Frontend Web Developer Program, designed to demonstrate the skills and knowledge acquired throughout the course. Below are the details and requirements for the project.

---

## Project Overview
The Library Application is a **Single Page Application (SPA)** built with React, showcasing CRUD (Create, Read, Update, Delete) operations for managing books, authors, publishers, categories, and borrowing records.

### Key Features
1. **React Router**: Enables navigation between pages without reloading.
2. **CRUD Operations**: All operations for managing data are implemented within their respective pages.
3. **Error Handling**: User feedback is provided for failed operations using modern UI components (e.g., Toast messages) instead of `window.alert`.
4. **Data Management**: Each page is pre-populated with five data entries, allowing full CRUD functionality testing.
5. **Live Backend Integration**: Communicates with a live backend server using Axios for API requests.
6. **Responsive Design**: The project is limited to a 1200px layout, and responsive design is not required.

---

## Technology Stack
- **Frontend**: React (React Router, Axios)
- **UI Framework**: Material UI (MUI)
- **Backend**: Pre-configured backend provided by the program
- **Styling**: Material UI components with custom CSS
- **Hosting**: [Vercel](https://vercel.com/)

---

## Page Details

### 1. **Welcome Page**
- **Description**: Serves as the landing page for the application.
- **Features**: Navigation to other sections via a styled navbar.

### 2. **Publisher Management**
- **Description**: Manages publisher information (name, location, etc.).
- **Features**:
  - List publishers with pagination.
  - Add, update, and delete publishers.
  - Validations for empty or duplicate inputs.

### 3. **Category Management**
- **Description**: Handles categories for books (e.g., Fiction, Science, History).
- **Features**:
  - Add and delete categories.
  - Prevent duplicate categories.

### 4. **Book Management**
- **Description**: Central page for managing book details.
- **Features**:
  - Display books with associated categories and publishers.
  - Edit book details, such as the title, author, and category.

### 5. **Author Management**
- **Description**: Manages author profiles.
- **Features**:
  - Add, edit, and delete author information.
  - Display the number of books associated with each author.

### 6. **Borrowing Records**
- **Description**: Handles book borrowing and return management.
- **Features**:
  - Automatically set a 15-day return deadline.
  - Validations for overdue returns.

---

## How to Run the Application

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd library-application
2. Install dependencies:
   npm install
3. Start the development server:
   npm start

### Backend Integration
1. Ensure the backend server is running locally on http://localhost:8080.
2. Update the API endpoints in src/api if necessary.

### Live Deployment
The project is live and can be accessed at:  https://cap-stone-nfib-mjwsw70s9-abre-sueda-ozmens-projects.vercel.app