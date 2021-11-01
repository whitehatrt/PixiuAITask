import {
  Container,
  Box,
  FormControl,
  FormLabel,
  Input,
  Text,
  Button,
} from "@chakra-ui/react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router'

const auth = () => {
  const [creds, setCreds] = useState({ username: "", email: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup === true) {
      const response = await axios.post("user/register/", creds,{withCredentials: true});
      if (response.status === 200 && response.data?.access_token !== "") {
        handleRoute();
      }
    } else {
      const response = await axios.post("user/login/", creds,{withCredentials: true});
      localStorage.setItem("accessToken", response.data?.access_token);
      router.push('/')
    }
  };
  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };
  const handleRoute = (e) => {
    setIsSignup((prevState) => !prevState);
  };
  return (
    <>
      <Head>
        <title>Tradiology | {isSignup === false ? "Login" : "SignUp"}</title>
      </Head>
      <Container maxW="container.md" marginTop="10">
        <Text fontSize="5xl">{isSignup === false ? "Login" : "SignUp"}</Text>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          {isSignup && (
            <FormControl id="username" isRequired marginTop="4">
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Username"
                type="text"
                name="username"
                onChange={(e) => handleChange(e)}
              />
            </FormControl>
          )}
          <FormControl id="email" isRequired marginTop="4">
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="E-Mail"
              type="email"
              name="email"
              onChange={(e) => handleChange(e)}
            />
          </FormControl>
          <FormControl id="password" isRequired marginTop="4">
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="Password"
              type="password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
          </FormControl>
          <FormControl
            id="login"
            marginTop="4"
            display="flex"
            flexDirection="column"
          >
            <Button
              colorScheme="teal"
              size="md"
              variant="outline"
              w="100px"
              type="submit"
            >
              {isSignup === false ? "Login" : "SignUp"}
            </Button>
            <Button
              colorScheme="teal"
              size="md"
              w="100px"
              marginTop="4"
              variant="link"
              type="button"
              onClick={() => handleRoute()}
            >
              {isSignup === true ? "Login" : "SignUp"}
            </Button>
          </FormControl>
        </form>
      </Container>
    </>
  );
};

export default auth;
