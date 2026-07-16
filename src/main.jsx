import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";



import { getDB } from "./database/db.js";

getDB()
.then(() => {

    console.log("✅ IndexedDB Ready");

})
.catch((err) => {

    console.error(err);

});

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <App />
    </BrowserRouter>
)
