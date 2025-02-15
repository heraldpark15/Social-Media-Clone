import {
  Button,
  Flex,
  GridItem,
  Image,
  Text,
  VStack,
  Input,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { Avatar } from "../../components/Misc/avatar";
import { MdDelete } from "react-icons/md";
import Comment from "../../components/Comment/Comment";
import PostFooter from "../../components/FeedPosts/PostFooter";
import {
  DialogContent,
  DialogHeader,
  DialogCloseTrigger,
  DialogFooter,
  DialogBody,
  DialogRoot,
  DialogTrigger,
} from "../../components/Misc/dialog";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import useShowToast from "../../hooks/useShowToast";
import { useState } from "react";
import { deleteObject, ref } from "firebase/storage";
import { firestore, storage } from "../../firebase/firebase";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import usePostStore from "../../store/postStore";
import Divider from "@mui/material/Divider";
import Caption from "../../components/Comment/Caption";

const ProfilePost = ({ post }) => {
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePost = usePostStore((state) => state.deletePost);
  const decrementPostsCount = useUserProfileStore((state) => state.deletePost);

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    if (isDeleting) return;

    try {
      // Delete original and compressed images
      const originalImageRef = ref(storage, `posts/${post.id}_original`);
      const compressedImageRef = ref(storage, `posts/${post.id}_compressed`);

      await deleteObject(originalImageRef);
      await deleteObject(compressedImageRef);

      await deleteDoc(doc(firestore, "posts", post.id));

      const userRef = doc(firestore, "users", authUser.uid);
      await updateDoc(userRef, {
        posts: arrayRemove(post.id),
      });

      deletePost(post.id);
      decrementPostsCount(post.id);
      showToast("Succes", "Post deleted successfully", "success");
    } catch {
      showToast("Error", error.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DialogRoot centered="true" size="">
        <DialogTrigger>
          <GridItem
            cursor={"pointer"}
            borderRadius={4}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"whiteAlpha.300"}
            position={"relative"}
            aspectRatio={1 / 1}
          >
            <Flex
              opacity={0}
              _hover={{ opacity: 1 }}
              position={"absolute"}
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg={"blackAlpha.700"}
              transition={"all 0.3s ease"}
              zIndex={2}
              justifyContent={"center"}
            >
              <Flex alignItems={"center"} justifyContent={"center"} gap={50}>
                <Flex>
                  <AiFillHeart size={20} />
                  <Text fontWeight={"bold"} ml={2}>
                    {post.likes.length}
                  </Text>
                </Flex>
                <Flex>
                  <FaComment size={20} />
                  <Text fontWeight={"bold"} ml={2}>
                    {post.comments.length}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Image
              src={post.compressedImageURL}
              alt="profile post"
              w={"100%"}
              h={"100%"}
              objectFit={"cover"}
            />
          </GridItem>
        </DialogTrigger>
        <DialogContent size={{ base: "5xl", md: "7xl" }}>
          <DialogCloseTrigger />
          <DialogBody bg={"black"} pb={5}>
            <Flex
              gap="4"
              w={{ base: "90%", sm: "70%", md: "full" }}
              mx={"auto"}
              maxH={"90vh"}
              minH={"50vh"}
            >
              <Flex
                borderRadius={4}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"whiteAlpha.300"}
                flex={1.5}
                justifyContent="center"
                alignItems="center"
              >
                <Image src={post.originalImageURL} alt="profile post" />
              </Flex>
              <Flex
                flex={1}
                flexDir={"column"}
                px={4}
                display={{ base: "none", md: "flex" }}
                gap={"3"}
              >
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                  <Flex alignItems={"center"} gap={4}>
                    <Avatar
                      src={userProfile.profilePicURL}
                      size={"sm"}
                      name="As a Programmer"
                    />
                    <Text fontWeight={"bold"} fontSize={12}>
                      {userProfile.username}
                    </Text>
                  </Flex>

                  {authUser?.uid === userProfile.uid && (
                    <Button
                      size={"sm"}
                      bg={"transparent"}
                      _hover={{ bg: "whiteAlpha.300", color: "red.600" }}
                      borderRadius={4}
                      p={1}
                      onClick={handleDeletePost}
                      isLoading={isDeleting}
                    >
                      <MdDelete size={20} cursor="pointer" />
                    </Button>
                  )}
                </Flex>
                <Divider color={"white"} />
                <VStack
                  w="full"
                  align={"start"}
                  overflowY={"auto"}
                  maxH={"none"}
                  spacing={4}
                >
                  {post.caption && <Caption post={post} />}
                  {post.comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                  ))}
                </VStack>
                <PostFooter isProfilePage={true} post={post} />
              </Flex>
            </Flex>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default ProfilePost;
