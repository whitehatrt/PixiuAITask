import { BellIcon } from '@chakra-ui/icons';
import { Container,Text,Image,Box,Badge,Button } from '@chakra-ui/react';
import axios from 'axios';
import dayjs from 'dayjs';
import jwt_decode from "jwt-decode";

import Head from 'next/head';
import { useEffect, useState } from 'react';
const myideas = () => {
  let token;
  const [ideas, setIdeas] = useState([{}]);

  const getIdeas = async (user_id,token) => {
    const response = await axios.get(
      `user/${user_id}/ideas/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      { withCredentials: true }
    );
    setIdeas(response.data);
  };
  useEffect(async () => {
    token = localStorage?.getItem("accessToken");
    const { user_id, exp } = jwt_decode(token);
    const isExpired = dayjs.unix(exp).diff(dayjs()) < 1;
    if (isExpired) {
      localStorage.removeItem("accessToken");
      router.push("/auth");
      return null;
    } else {
      getIdeas(user_id,token);
    }
  }, []);
  return (
    <>
      <Head>
        <title>Tradiology | My Ideas</title>
      </Head>
      <Container maxW='container.lg'  marginTop={5}>
      <Container
          display="grid"
          maxW="container.lg"
          marginY="5"
          gridTemplateColumns={["1fr", "1fr", "1fr 1fr", "1fr 1fr", "1fr 1fr"]}
          gridRowGap="1em"
          gridAutoRows="1fr"
        >
          {ideas?.map((ide, i) => {
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
                    {/* <BellIcon w={6} h={6} /> */}
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
                    <Button size="sm" as='span' colorScheme="blue">
                      {parseInt(ide.userJoined)===1?`${parseInt(ide.userJoined)} User`:`${parseInt(ide.userJoined)} Users`}  Joined This Idea
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
      </Container>
    </>
  );
};

export default myideas;
