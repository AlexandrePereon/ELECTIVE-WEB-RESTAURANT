import axios from 'axios';
import clientConfig from './clientConfig.json' assert { type: 'json' };;
import logger from '../utils/logger/logger.js';

const authClient = {
  deleteUserRestaurant: async (headerData) => {
    try {
      const axiosReq = axios.create({
        baseURL: `http://elective-web-auth:3000`,
        headers: JSON.parse(headerData),      
      });

      const response = await axiosReq.delete(`/auth/delete/restaurant`);
      logger.log('info', `data :  ${response}`);
      return response.data;
    } catch (error) {
      logger.log('error', `Error lors de la suppression du restaurant`, { error: error });
      return null;
    }
  },
};

export default authClient;
