import { auth, firestore } from '../firebase/firebase';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { collection, doc, query, setDoc, getDocs, where } from 'firebase/firestore';
import useShowToast from './useShowToast';
import useAuthStore from '../store/authStore';

const useSignUpWithEmailAndPassword = () => {
    const [
        createUserWithEmailAndPassword, ,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);
    const showToast = useShowToast()
    const loginUser = useAuthStore((state) => state.login)

    const signup = async (inputs) => {
        if (!inputs.email || !inputs.password || !inputs.username || !inputs.fullName) {
            showToast("Error", "Please fill all the fields", "error");
            return false;
        }
    
        const usersRef = collection(firestore, "users");
    
        try {
            // Check if username exists
            const q = query(usersRef, where("username", "==", inputs.username));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                showToast("Error", "Username already exists", "error");
                return false;
            }
    
            // Create new user
            const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);
    
            if (!newUser) {
                showToast("Error", error.message, "error");
                return false;
            }
    
            // Prepare user data and write to Firestore
            const userDoc = {
                uid: newUser.user.uid,
                email: inputs.email,
                username: inputs.username,
                fullName: inputs.fullName,
                bio: "",
                profilePicURL: "",
                followers: [],
                following: [],
                posts: [],
                createdAt: Date.now(),
            };
            await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
            localStorage.setItem("user-info", JSON.stringify(userDoc));
            loginUser(userDoc);
        } catch (error) {
            // Handle unexpected errors
            showToast("Error", error.message, "error");
        }
    }
    
    return {loading,error,signup}
  
}
export default useSignUpWithEmailAndPassword