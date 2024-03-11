import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query';

export const useFetchProducts = () => {
    return useQuery({
    queryFn: async () => {
      const getProducts = await axiosInstance.get("/products")
      console.log("axios request")
      return getProducts
    }
  })
};
