import axios from "axios";
import { AuthContext } from "../UserContext";
import { useContext } from "react";
import { useEffect, useState } from "react";
import GenreMovies from "./GenreMovies";

export default function Profilepage() {
  const [currentUser] = useContext(AuthContext);
  const [data, setdata] = useState(null);
  const uid = currentUser && currentUser.uid;
  let userId = uid?.toString();
  console.log("user", userId);
  const getdata = async () => {
    const response = await axios.get("http://localhost:8000/profilepage", {
      params: {
        userId: userId,
      },
    });
    console.log("response", response);

    let arr = response.data.map((e) => {
      return e;
    });
    console.log("arr", arr, typeof arr);
    setdata(arr);
  };

  useEffect(() => {
    console.log("in useEffect");
    getdata();
  }, [currentUser]);

  return (
    <div>
      <GenreMovies movies={data} />
    </div>
  );
}
