//helper function for storage access
import { STORAGE_KEYS } from '../constants/configs';


// -- storage access --
export const getLocalDataAsync = async (key) => {
    return localStorage.getItem(key);
}

// -- storage access --
export const saveLocalDataAsync = async (key, value) => {    
    localStorage.setItem(key, value);

}

// -- storage access --
export const removeStorage = (key) => {
    localStorage.removeItem(key);

}

// -- storage access --
export const clearStorage = () => {
    localStorage.clear();
}