import { Box, Button, Flex } from '@chakra-ui/react'
import { Avatar } from '../Misc/avatar'
import { Link } from 'react-router-dom'
import { SkeletonCircle } from '../Misc/skeleton'
import useFollowUser from '../../hooks/useFollowUser'
import { timeAgo } from '../../utils/timeAgo'

const PostHeader = ({ post, creatorProfile }) => {

  const { handleFollowUser, isFollowing, isUpdating} = useFollowUser(post.createdBy)

  if(!creatorProfile) return null
  
  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} my={2}>
      {creatorProfile ? (
        <Link to={`/${creatorProfile.username}`}>
          <Flex alignItems={"center"} gap={2}>
            <Avatar src={creatorProfile.profilePicURL} alt="user profile pic" size="sm" sx={{ width: 15, height: 15 }}/>
            <Flex fontSize={14} fontWeight={"bold"} gap="2">
                {creatorProfile.username}
                <Box color={"gray.500"}>• {timeAgo(post.createdAt)}</Box>
            </Flex>
          </Flex>
        </Link>
      ) : (
        <SkeletonCircle size='10' />
      ) }

      <Box cursor={"pointer"} >
        <Button
          size={"xs"}
          bg={"transparent"}
          fontSize={12}
          color={"blue.500"}
          fontWeight={"bold"}
          _hover={{ color: "white" }}
          transition={"0.2s ease-in-out"}
          onClick={handleFollowUser}
          isLoading={isUpdating}
        >
            {isFollowing ? "Unfollow" : "Follow" }
        </Button>
        </Box>
    </Flex>
  )
}

export default PostHeader