import { useContext } from "react";
import { FirebaseContext } from "../context/FirebaseContext";

const useFirebase = () => useContext(FirebaseContext);

export default useFirebase;
