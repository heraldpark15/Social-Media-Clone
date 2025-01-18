import { Button, Flex, Text, VStack } from "@chakra-ui/react"
import useUserProfileStore from "../../store/userProfileStore"
import { Avatar, AvatarGroup } from "../../components/Misc/avatar"
import useAuthStore from "../../store/authStore"
import EditProfile from "./EditProfile"
import useFollowUser from "../../hooks/useFollowUser"

const ProfileHeader = () => {
  const {userProfile} = useUserProfileStore()
  const authUser = useAuthStore((state) => state.user)
  const {isFollowing, isUpdating, handleFollowUser} = useFollowUser(userProfile?.uid)
  const visitingOwnProfileAuth = authUser && authUser.username === userProfile.username
  const vistingAnotherUserProfileAndAuth = authUser && authUser.username !== userProfile.username

  return <Flex gap={{base:4,sm:10}} py={10} direction={{base:"column", sm:"row"}}>
    <AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf={"center"} alignSelf={"flex-start"} mx={"auto"}>
        <Avatar src={userProfile.profilePicURL} alt='As a programmer logo' />
    </AvatarGroup>
    <VStack alignItems={"start"} gap={2} mx={"auto"} flex={1}>
        <Flex gap={4} direction={{base:"column",sm:"row"}} justifyContent={{base:"center",sm:"flex-start"}} alignItems={"center"} w={"full"}>
            <Text fontSize={{base:"sm",md:"lg"}}>
                {userProfile.username}
            </Text>
            {visitingOwnProfileAuth && (
            <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
                <EditProfile />
            </Flex>
            )}
            {vistingAnotherUserProfileAndAuth && (
                <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
                <Button background={"blue.500"} color={"white"} _hover={{bg:"blue.600"}} size={{base:"xs",md:"sm"}}
                onClick={handleFollowUser} isLoading={isUpdating}> 
                    {isFollowing? "Unfollow" : "Follow "}
                </Button>
            </Flex>
            )}
        </Flex>
        <Flex alignItems={"center"} gap={{base:2,sm:4}}>
            <Text>
                <Text as="span" fontWeight={"bold"} mr={1}>{userProfile.posts.length}</Text>
                posts
            </Text>
            <Text>
                <Text as="span" fontWeight={"bold"} mr={1}>{userProfile.followers.length}</Text>
                followers
            </Text>
            <Text>
                <Text as="span" fontWeight={"bold"} mr={1}>{userProfile.following.length}</Text>
                following
            </Text>
        </Flex>
        <Flex alignItems={"center"} gap={4}>
            <Text fontSize={"sm"} fontWeight={"bold"}>{userProfile.fullName}</Text>
        </Flex>
        <Flex alignItems={"center"} gap={4}>
            <Text fontSize={"sm"}>{userProfile.bio}</Text>
        </Flex>
    </VStack>
  </Flex>
}

export default ProfileHeader