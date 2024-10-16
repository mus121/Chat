import { useQuery } from 'react-query';
import axios from 'axios';

export const useFetchEmails = () => {
  return useQuery('fetchEmails', async () => {
    const { data } = await axios.get('http://localhost:5001/api/private/email');
    return data;
  });
};
