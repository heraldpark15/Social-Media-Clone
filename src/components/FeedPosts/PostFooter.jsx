import { Box, Flex, Text, Input, Button } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { CommentLogo, NotificationsLogo, UnlikeLogo } from '../../assets/constants'
import usePostComment from '../../hooks/usePostComment';
import useAuthStore from '../../store/authStore';
import { InputGroup } from '../Misc/input-group';
import useLikePost from '../../hooks/useLikePost';
import { timeAgo } from '../../utils/timeAgo';
import CommentDialog from '../Modal/CommentModal';
import {
      DialogContent,
      DialogHeader,
      DialogCloseTrigger,
      DialogFooter,
      DialogBody,
      DialogRoot,
      DialogTrigger,
  } from "../../components/Misc/dialog";

const PostFooter = ({ post, isProfilePage, creatorProfile }) => {
  const { isCommenting, handlePostComment } = usePostComment()
  const [comment, setComment] = useState("")
  const authUser = useAuthStore(state => state.user)
  const commentRef = useRef(null)
  const { handleLikePost, isLiked, likes } = useLikePost(post)

  const handleSubmitComment = async() => {
    await handlePostComment(post.id,comment)
    setComment("")
  }

  return (
        <Box mb={10} marginTop={"auto"}>
              <Flex alignItems={"center"} gap={4} w={"full"} pt={0} mb={2} mt={4}>
                    <Box onClick={handleLikePost} cursor={"pointer"} fontSize={18}>
                        {!isLiked ? <NotificationsLogo /> : <UnlikeLogo />}
                    </Box>

                    <Box cursor={"pointer"} fontSize={18} onClick={() => commentRef.current.focus()}>
                        <CommentLogo />
                    </Box>
              </Flex>
              <Text fontWeight={600} fontSize={"sm"}>
                  {likes} likes
              </Text>

              {isProfilePage && (
                    <Text fontSize='12' color={"gray"}>
                          Posted {timeAgo(post.createdAt)}
                    </Text>
              )}

              {!isProfilePage && (
                    <>
                        <Text fontSize='sm' fontWeight={700}>
                              {creatorProfile?.username}{" "}
                              <Text as='span' fontWeight={400}>
                                    {post.caption}
                              </Text>
                        </Text>
                        {Array.isArray(post.comments) && post.comments.length > 0 && (
                        <DialogRoot>
                              <DialogTrigger>
                                    <Text fontSize='sm' color={"gray"} cursor={"pointer"}>
                                          View all {post.comments.length} comments
                                    </Text>
                              </DialogTrigger>
                              <CommentDialog post={post}/>
                        </DialogRoot>
                        )}
                    </>
              )}
              
              {authUser && (
                    <Flex
                        alignItems={"center"}
                        gap={2}
                        justifyContent={"space-between"}
                        w={"full"}
                    >
                          <InputGroup>
                                <Input
                                    variant={"flushed"}
                                    placeholder={"Add a comment..."}
                                    fontSize={14}
                                    onChange = {(e) => setComment(e.target.value)}
                                    value={comment}
                                    ref={commentRef}
                                  />
                          </InputGroup>
                          <InputGroup>
                                  <Button
                                    fontSize={14}
                                    color={"blue.500"}
                                    fontWeight={600}
                                    cursor={"pointer"}
                                    _hover={{ color: "white" }}
                                    bg={"transparent"}
                                    onClick={handleSubmitComment}
                                    isLoading={isCommenting}
                                  >
                                      Post
                                  </Button>
                          </InputGroup>
                    </Flex>
              )}
      </Box>
  );
};

export default PostFooter;
