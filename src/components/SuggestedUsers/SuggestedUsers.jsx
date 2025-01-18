import { Text, Flex, VStack, Box, Stack, HStack } from "@chakra-ui/react"
import SuggestedHeader from "./SuggestedHeader"
import SuggestedUser from "./SuggestedUser"
import useGetSuggestedUsers from "../../hooks/useGetSuggestedUsers"
import { Skeleton, SkeletonCircle } from "../Misc/skeleton"


const SuggestUsers = () => {
  const {isLoading, suggestedUsers} = useGetSuggestedUsers()

  if(isLoading) return (
    <HStack gap="5">
      <SkeletonCircle size="12" />
      <Stack flex="1">
        <Skeleton height="5" />
        <Skeleton height="5" width="80%" />
      </Stack>
    </HStack>
  )

  return (
    <VStack py={8} px={6} gap={4}>
      <SuggestedHeader />
        {suggestedUsers.length !== 0 && (
          <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
              <Text fontSize={12} fontWeight={"bold"} color={"gray.500"}>
                    Suggested for you
              </Text>
              <Text fontSize={12} fontWeight={"bold"} _hover={{color:"gray.400"}} cursor={"pointer"}>
                    See All
              </Text>
          </Flex>
        )}
        {suggestedUsers.map((user) => (
            <SuggestedUser user={user} key={user.id} />
        ))}
        <Box fontSize={12} color={"gray.500"} mt={5} alignSelf={"start"}> ©2024 Built by Herald Park</Box>
    </VStack>
  )
}

export default SuggestUsers