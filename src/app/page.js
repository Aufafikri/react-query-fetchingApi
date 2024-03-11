"use client";

import {
  Container,
  Heading,
  Tbody,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Spinner,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast
} from "@chakra-ui/react";
import { useFormik } from "formik";
import {useFetchProducts, useCreateProduct, useDeleteProduct, useEditProduct} from "@/features/product"
import { useMutation } from "@tanstack/react-query";

const Home = () => {
  const { data, isLoading: productsIsLoading, refetch: refetchProducts } = useFetchProducts();
  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      image: "",
    },
    onSubmit: () => {
      const { name, price, description, image, id } = formik.values;

      if(id) {
        editProduct({
          name,
          price: parseInt(price),
          description,
          image,
          id,
        })

        toast({
          title: "product edited",
          status: "success"
        })
      } else {
        createProduct({
          name,
          price: parseInt(price),
          description,
          image,
        });
        
        toast({
          title: "product added",
          status: "success"
        })
      }

      formik.setFieldValue("name", "")
      formik.setFieldValue("price", "")
      formik.setFieldValue("description", "")
      formik.setFieldValue("image", "")
    },
  });

  const handleFormInput = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const { mutate: createProduct, isLoading: createProductIsLoading } = useCreateProduct({
    onSuccess: () => {
      refetchProducts()
    }
  })

  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess: () => {
      refetchProducts()
      toast({
        title: "deleted Product",
        status: "info",
        colorScheme: "red"
      })
    }
  })

  const { mutate: editProduct } = useEditProduct({
    onSuccess: () => {
      refetchProducts()
    }
  })

  const onEditClick = (product) => {
    formik.setFieldValue("id", product.id);
    formik.setFieldValue("name", product.name);
    formik.setFieldValue("description", product.description);
    formik.setFieldValue("price", product.price);
    formik.setFieldValue("image", product.image);
  };

  const renderProducts = () => {
    return data?.data.map((product) => {
      return (
        <Tr key={product.id}>
          <Td> {product.id} </Td>
          <Td> {product.name} </Td>
          <Td> {product.price} </Td>
          <Td> {product.description} </Td>
          <Td>
            <Button 
            colorScheme="green"
            onClick={() => onEditClick(product)}>Edit</Button>
          </Td>
          <Td>
            <Button 
            colorScheme="red" 
            onClick={() => 
            deleteProduct(product.id)}>Delete</Button>
          </Td>
        </Tr>
      );
    });
  };
  return (
    <Container>
      <Heading>HELLO WORLD</Heading>
      <Table mb="6">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Description</Th>
            <Th colSpan={2}>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {renderProducts()}
          {productsIsLoading? <Spinner /> : null}
        </Tbody>
      </Table>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing="3">
        <FormControl>
            <FormLabel>ID Products</FormLabel>
            <Input
              onChange={handleFormInput}
              name="id"
              value={formik.values.id}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Name Products</FormLabel>
            <Input
              onChange={handleFormInput}
              name="name"
              value={formik.values.name}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Price</FormLabel>
            <Input
              onChange={handleFormInput}
              name="price"
              value={formik.values.price}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              onChange={handleFormInput}
              name="description"
              value={formik.values.description}
            />
          </FormControl>
          <FormControl>
            <FormLabel>image</FormLabel>
            <Input
              onChange={handleFormInput}
              name="image"
              value={formik.values.image}
            />
          </FormControl>
          {
            createProductIsLoading? (
              <Spinner />
            ) : (
              <Button type="submit" mb="12">Submit</Button>
            )}
        </VStack>
      </form>
    </Container>
  );
};

export default Home;