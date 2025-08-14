import { useEffect } from "react";
import api from "./lib/axios";

function App() {

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/user/");
        const data = res.data;
        if (data.error){
          console.log("Error in fetch user : ", data.error);
        }
        else {
          console.log("User data fetched : ", data)
        }
      } catch (error) {
        console.log("Error in fetch user : ", error)
      }
    }
  
    fetchUser();
  }, []);

  return (
    <>
      <h1>You are now the member of the typeminati</h1>
    </>
  )  
}

export default App;
