import axios from "axios";
import { useQuery } from "react-query";

   //    Get User Profile
const fetchProfile = async () =>{
    const response = await axios.get('http://localhost:5001/api/private/user-profile');
    return response.data;
}

const profile = () =>{
    return useQuery('profile',fetchProfile);
}
export default profile;