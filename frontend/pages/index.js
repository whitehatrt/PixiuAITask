import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import {
  Box,
  Container,
  Button,
  Image,
  Text,
  Badge,
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Select,
  
} from "@chakra-ui/react";
import Swal from 'sweetalert2'
import { BellIcon } from "@chakra-ui/icons";
import { useRadioGroup } from "@chakra-ui/radio";
import RadioCard from "../components/RadioCard";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Link from "next/link";
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
export default function Home() {
  let token;

  const [idea, setIdea] = useState({
    iType: "",
    iName: "",
    iCrypto: "",
    iRisk: "",
    iTarget: "",
    iStoploss: "",
    user: "",
  });
  const [gideas, setGideas] = useState([{}]);
  
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const options = ["Crypto", "Stocks"];
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "iType",
    onChange: (e) => {
      console.log(e);
      setIdea({ ...idea, iType: e });
    },
    value: idea.iType,
  });
  const group = getRootProps();

  const handleChange = (e) => {
    setIdea({ ...idea, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    token = localStorage?.getItem("accessToken");
    const response = await axios.post(`user/createidea/`, idea, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      onClose();
      getIdeas(token);
    }
  };
  const subscribeIdea = async (iid) => {
    token = localStorage?.getItem("accessToken");

    const { user_id, exp } = jwt_decode(token);
    const isExpired = dayjs.unix(exp).diff(dayjs()) < 1;
    if (isExpired) {
      localStorage.removeItem("accessToken");
      router.push("/auth");
      return null;
    } else {
      const response = await axios.post(
        `user/idea/${iid}/subscribeidea/${user_id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        { withCredentials: true }
      );
      
      if(response.status===200){
        Toast.fire({
          icon: 'info',
          title: response.data.msg
        })
        console.log('asdasdaas')
        
      }
      if(response.status===201){
        Toast.fire({
          icon: 'success',
          title: response.data.msg
        })
        
      }
    }
  };
  const getIdeas = async (token) => {
    const response = await axios.get(
      `user/ideas/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      { withCredentials: true }
    );
    setGideas(response.data);
  };
  useEffect(async () => {
    token = localStorage?.getItem("accessToken");
    if (token === null) {
      router.push("/auth");
      return null;
    }
    const { user_id, exp } = jwt_decode(token);
    const isExpired = dayjs.unix(exp).diff(dayjs()) < 1;
    if (isExpired) {
      localStorage.removeItem("accessToken");
      router.push("/auth");
      return null;
    } else {
      setIdea({ ...idea, user: user_id });
      getIdeas(token);
    }
  }, []);
  return (
    <>
      <Head>
        <title>Tradiology | Home</title>
      </Head>
      <Container maxW="container.lg" marginTop="5">
        <Box display="flex" justifyContent="flex-end">
          <Link href="/myideas">
            <Button as="a" mr={2} colorScheme="green">
              My Ideas
            </Button>
          </Link>
          <Button onClick={onOpen} colorScheme="green">
            Add Idea
          </Button>
        </Box>
        
        <Container
          display="grid"
          maxW="container.lg"
          marginY="5"
          gridTemplateColumns={["1fr", "1fr", "1fr 1fr", "1fr 1fr", "1fr 1fr"]}
          gridRowGap="1em"
          gridAutoRows="1fr"
        >
          {gideas?.map((ide, i) => {
            return (
              <Box key={i}>
                <Box
                  maxW="sm"
                  backgroundColor="gray.100"
                  padding="2"
                  rounded="2xl"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center">
                      <Image
                        borderRadius="full"
                        boxSize="50px"
                        src="https://unsplash.com/photos/9pCV2MB65y8/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjM1NjA2MjU5&force=true&w=640"
                        alt="Dummy"
                        marginX="2"
                      />
                      <Text marginX="2">{ide.userName}</Text>
                    </Box>
                    <BellIcon w={6} h={6} />
                  </Box>
                </Box>

                <Box maxW="sm" rounded="2xl">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    marginY="4"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <Text fontSize="md" marginX="2" fontWeight="bold">
                        {ide.iName}
                      </Text>
                      <Text fontSize="sm" marginX="2" fontWeight="bold">
                        {ide.iCrypto}
                      </Text>
                      <Badge
                        marginX="2"
                        variant="solid"
                        borderRadius="full"
                        colorScheme={
                          ide.iRisk === "Low Risk"
                            ? "blue"
                            : ide.iRisk === "Medium Risk"
                            ? "yellow"
                            : ide.iRisk === "High Risk"
                            ? "red"
                            : ""
                        }
                      >
                        {ide.iRisk}
                      </Badge>
                    </Box>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={(e) => {
                        subscribeIdea(ide.id);
                      }}
                    >
                      Join This Idea
                    </Button>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    marginY="4"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <Text fontSize="sm" marginX="2">
                        {"Enter Below"}
                      </Text>
                      <Text fontSize="sm" marginX="2">
                        {"Book Profit Near"}
                      </Text>
                      <Text fontSize="sm" marginX="2">
                        {"Stoploss at"}
                      </Text>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end"
                    >
                      <Text fontSize="sm" marginX="2" color="blue">
                        ${parseInt(ide.iTarget) + 2000}
                      </Text>
                      <Text fontSize="sm" marginX="2" color="blue">
                        ${parseInt(ide.iTarget) + 1000}-$
                        {parseInt(ide.iTarget) + 3000}
                      </Text>
                      <Text fontSize="sm" marginX="2" color="blue">
                        ${ide.iStoploss}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Container>
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Trade Idea</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={(e) => handleSubmit(e)}>
              <ModalBody pb={6}>
                <FormControl>
                  <HStack {...group} mx={2}>
                    {options.map((value) => {
                      const radio = getRadioProps({ value });
                      return (
                        <RadioCard key={value} {...radio}>
                          {value}
                        </RadioCard>
                      );
                    })}
                  </HStack>
                </FormControl>
                <FormControl my={4} display="flex">
                  <Input
                    placeholder="Name Your Idea"
                    name="iName"
                    mx={2}
                    onChange={(e) => handleChange(e)}
                  />
                  <Button mx={2} color="#49f18d" fontSize="sm">
                    5% Upside
                  </Button>
                </FormControl>

                <FormControl my={4} display="flex">
                  <Select
                    placeholder="Select Crypto"
                    name="iCrypto"
                    mx={2}
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="XRP">XRP</option>
                  </Select>
                  <Select
                    placeholder="Select Risk"
                    name="iRisk"
                    mx={2}
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="Low Risk">Low Risk</option>
                    <option value="Medium Risk">Medium Risk</option>
                    <option value="High Risk">High Risk</option>
                  </Select>
                </FormControl>
                <FormControl my={4} display="flex">
                  <Input
                    placeholder="Target"
                    name="iTarget"
                    mx={2}
                    onChange={(e) => handleChange(e)}
                  />
                  <Input
                    placeholder="Stoploss"
                    name="iStoploss"
                    mx={2}
                    onChange={(e) => handleChange(e)}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button colorScheme="blue" ml={3} type="submit">
                  Create
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
}
