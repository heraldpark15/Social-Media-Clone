import { Container, Flex, Link, Skeleton, Text, VStack } from "@chakra-ui/react"
import { SkeletonCircle } from "../../components/Misc/skeleton"
import ProfileHeader from "./ProfileHeader"
import ProfileTabs from "./ProfileTabs"
import ProfilePosts from "./ProfilePosts"
import useGetUserProfileByUserName from "../../hooks/useGetUserProfileByUserName"
import { useParams } from "react-router-dom"
import { Link as RouterLink} from "react-router-dom"

const ProfilePage = () => {
  const {username} = useParams()
  const {isLoading, userProfile} = useGetUserProfileByUserName(username)

  const userNotFound = !isLoading && !userProfile
  if(userNotFound) return <UserNotFound />

  return <Container maxWidth="container.lg" py={5}>
    <Flex py={10} px={4} pl={{base:4,md:10}} width={"full"} mx={"auto"} flexDirection={"column"}>
        {!isLoading && userProfile && <ProfileHeader />}
        {isLoading && <ProfileHeaderSkeleton />}
    </Flex>
    <Flex px={{base:2,sm:4}} maxWidth={"full"} mx={"auto"} borderTop={"1px solid"} borderColor={"whiteAlpha.300"} direction={"column"}>
        <ProfileTabs/>
        <ProfilePosts/>
    </Flex>
  </Container>
}

export default ProfilePage

const ProfileHeaderSkeleton = () => {
  return (
    <Flex
      gap={{ base: 4, sm: 10}}
      py={10}
      direction={{ base: "column", sm: "row"}}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <SkeletonCircle size="24" />
      <VStack alignItems={{ base: "center", sm: "flex-start"}} gap={2} mx={"auto"} flex={1}>
        <Skeleton height='12px' width='150px' />
        <Skeleton height='12px' width='100px' />
      </VStack>
    </Flex>
  )
}

const UserNotFound = () => {
  return (
    <Flex flexDir='column' textAlign={"center"} mx={"auto"}>
      <Text fontSize={"2xl"}>User Not Found</Text>
      <Link as={RouterLink} to={"/"} color={"blue.500"} w={"max-content"} mx={"auto"}>
        Go home
      </Link>
    </Flex>
  )
}