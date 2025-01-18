import { Flex, Box } from '@chakra-ui/react'
import SideBar from '../../components/SideBar/SideBar'
import { useLocation } from 'react-router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'
import Navbar from '../../components/Navbar/Navbar'
import { Spinner } from '@chakra-ui/react'

const PageLayout = ({children}) => {
    const {pathname} = useLocation()
    const [user, loading] = useAuthState(auth)
    const canRenderSidebar = pathname !== "/auth" && user
    const canRenderNavbar = !user && !loading && pathname !== "/auth"

    const checkingUserIsAuth = !user && loading
    if(checkingUserIsAuth) return <PageLayoutSpinner />
    return (
    <Flex flexDir={canRenderNavbar ?  "column" : "row"}>
        {/* sidebar on the left */}
        {canRenderSidebar ? (
            <Box w={{base:"70px", md:"240px"}}>
                <SideBar/>
            </Box>
        ) : null}
        
        {/* Navbar */}
        {canRenderNavbar ? <Navbar /> : null}
        {/* put child page on the right */}
        <Box flex={1} w={{base:"calc(100% - 70px)", md:"calc(100% - 240px)"}} mx={"auto"}>
            {children}
        </Box>
    </Flex>
  )
}

export default PageLayout

const PageLayoutSpinner = () => {
    return(
        <Flex flexDir='column' h = '100vh' alignItems='center' justifyContent='center'>
            <Spinner size='xl' />
        </Flex>
    )
}