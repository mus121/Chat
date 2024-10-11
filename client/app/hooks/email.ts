import { useQuery } from 'react-query'
import axios from 'axios'

const fetchemails = async () => {
    const respone = await axios.get('http://localhost:5001/api/auth/email');
    return respone.data;
}

const email = () => {
    return useQuery('emails', fetchemails);
}
export default email
