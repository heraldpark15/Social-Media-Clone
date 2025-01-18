import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Login from "./Login"
import Signup from "./Signup"
import GoogleAuth from "./GoogleAuth"

const AuthForm = () => {
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(true)

    useEffect(() => {
        if (location.state?.isLogin !== undefined) {
            setIsLogin(location.state.isLogin);
        }
    }, [location.state]);

    return (
    <>
    <Box border={"1px solid gray"} borderRadius={4} padding={5}>
        <VStack spacing={4}>
            <Image src='logo.png' h={24} cursor={"pointer"} alt='Instagram' />

            {isLogin ? <Login /> : <Signup />}

            {/* --------------- OR -------------- */}
            <Flex alignItems={"center"} justifyContent={"center"} my={4} gap={1} w={"full"}>
                <Box flex={2} h={"1px"} bg={"gray.400"}/>
                <Text mx={1} color={"white"}>OR</Text>
                <Box flex={2} h={"1px"} bg={"gray.400"}/>
            </Flex>
            <GoogleAuth prefix={isLogin? "Log in" : "Sign up"}/>
        </VStack>
    </Box>

    {/* Don't have an account? */}
    <Box border={"1px solid gray"} borderRadius={4} padding={5}>
        <Flex alignItems={"center"} justifyContent={"center"}>
            <Box mx={2} fontSize={14}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Box>
            <Box onClick={() => setIsLogin(!isLogin)} color={"blue.500"} cursor={"pointer"}>
                {isLogin ? "Sign Up" : "Log in"}
            </Box>
        </Flex>
    </Box>
    </>
  )
}

export default AuthForm