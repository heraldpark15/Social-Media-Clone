import { Flex, Container, VStack, Box, Image } from '@chakra-ui/react'
import React from 'react'
import AuthForm from '../../components/ui/AuthForm/AuthForm'

const AuthPage = () => {
  return (
    <Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4}>
        <Container maxW={"container.md"} padding={0}>
            <Flex justifyContent={"center"} alignItems={"center"} gap={10}>
            {/* Left handside  */}
            <Box display={{base:"none",md:"block"}}>
                <Image src="/auth.png" h={650} alt="Phone img"/>
            </Box>

            {/* Right handside - use vertical stack to show multiple stacked items */}
            <VStack spacing={4} align={"stretch"}>
                <AuthForm />
                <Box textAlign={"center"}>Get the app.</Box>
                <Flex gap={5} justifyContent={"center"}>
                    <Image src='/playstore.png' h={10} alt='Playstore logo'/>
                    <Image src='/microsoft.png' h={10} alt='Micro logo'/>
                </Flex>
            </VStack>
            </Flex>
        </Container>
    </Flex>
  )
}

export default AuthPage