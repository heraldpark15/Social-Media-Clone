import { Flex, Button, Text } from "@chakra-ui/react"
import { Avatar } from "../Misc/avatar";
import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import useAuthStore from "../../store/authStore";

 
const SuggestedHeader = () => {
  const {handleLogout, isLoggingOut} = useLogout()
  const authUser = useAuthStore((state) => state.user)

  if (!authUser) return null

  return (<Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
    <Flex alignItems={"center"} gap={2}>
    <Link to={`/${authUser.username}`}>
      <Avatar size={"lg"} src={authUser.profilePicURL} />  
    </Link>
    <Link to={`/${authUser.username}`}>
      <Text fontsize={12} fontWeight={"bold"} cursor={"pointer"}>
        {authUser.username}
      </Text>
    </Link>
    </Flex>
    <Button
        size={"xs"}
        background={"transparent"}
        onClick={handleLogout}
        isLoading = {isLoggingOut}
        fontSize={14}
        fontWeight={"medium"}
        color={"blue.400"}
        cursor={"pointer"}
        _hover={{background: "transparent"}}
    >Log Out</Button>
  </Flex>)
}

export default SuggestedHeader